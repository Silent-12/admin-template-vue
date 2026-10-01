<!-- 表格组件 -->
<!-- 支持：el-table 全部属性、事件、插槽，同官方文档写法 -->
<!-- 扩展功能：分页组件、渲染自定义列、loading、表格全局边框、斑马纹、表格尺寸、表头背景配置 -->
<!-- 集成能力：传入 searchItems 自动渲染搜索栏（v-model:searchForm 双向绑定，内置查询 / 重置按钮）；编写 #header-left / #header-right 插槽自动渲染表格头部 -->
<!-- 获取 ref：默认暴露了 elTableRef 外部通过 ref.value.elTableRef 可以调用 el-table 方法 -->
<template>
  <div class="ao-table-root" :class="rootClass">
    <!-- 搜索栏：有搜索项或显式传入 showSearchBar 时挂载；显隐交给 v-show，避免隐藏后再显示时重新挂载刷新 AoSearchBar 的重置快照 -->
    <AoSearchBar
      v-if="hasSearchItems || showSearchBar !== undefined"
      v-show="renderSearchBar"
      ref="searchBarRef"
      v-model="searchFormModel"
      :items="searchItems"
      :rules="searchRules"
      :span="searchSpan"
      :show-expand="searchShowExpand"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 表格容器：集成模式由卡片承载；默认模式使用 display: contents 透传，保持既有 DOM 布局不变 -->
    <component :is="cardComponent" :class="cardClass">
      <!-- 表格头部：集成模式下由 AoTable 内部渲染，#header-left / #header-right 插槽内容写入对应位置 -->
      <AoTableHeader
        v-if="renderHeader"
        v-model:columns="headerColumns"
        :show-search-bar="showSearchBar"
        :show-zebra="headerShowZebra"
        :show-border="headerShowBorder"
        :show-header-background="headerShowHeaderBackground"
        :loading="loading"
        @update:show-search-bar="handleShowSearchBarChange"
        @refresh="handleRefresh"
      >
        <template #left>
          <slot name="header-left"></slot>
        </template>
        <template #right>
          <slot name="header-right"></slot>
        </template>
      </AoTableHeader>

      <!-- 表格主体 -->
      <div class="ao-table" :class="{ 'is-empty': isEmpty }" :style="containerHeight">
        <ElTable ref="elTableRef" v-loading="!!loading" v-bind="mergedTableProps">
          <template #default>
            <template v-for="col in columns" :key="col.prop || col.type">
              <!-- 渲染全局序号列 -->
              <ElTableColumn v-if="col.type === 'globalIndex'" v-bind="{ ...col }">
                <template #default="{ $index }">
                  <span>{{ getGlobalIndex($index) }}</span>
                </template>
              </ElTableColumn>

              <!-- 渲染展开行 -->
              <ElTableColumn v-else-if="col.type === 'expand'" v-bind="cleanColumnProps(col)">
                <template #default="{ row }">
                  <component :is="col.formatter ? col.formatter(row) : null" />
                </template>
              </ElTableColumn>

              <!-- 渲染普通列 -->
              <ElTableColumn v-else v-bind="cleanColumnProps(col)">
                <template v-if="col.useHeaderSlot && col.prop" #header="headerScope">
                  <slot
                    :name="col.headerSlotName || `${col.prop}-header`"
                    v-bind="{ ...headerScope, prop: col.prop, label: col.label }"
                  >
                    {{ col.label }}
                  </slot>
                </template>
                <template v-if="col.useSlot && col.prop" #default="slotScope">
                  <slot
                    v-if="shouldRenderSlotScope(slotScope)"
                    :name="col.slotName || col.prop"
                    v-bind="{
                      ...slotScope,
                      prop: col.prop,
                      value: col.prop ? slotScope.row[col.prop] : undefined
                    }"
                  />
                </template>
              </ElTableColumn>
            </template>

            <slot v-if="$slots.default" />
          </template>

          <template #empty>
            <div v-if="loading"></div>
            <ElEmpty v-else :description="emptyText" :image-size="120" />
          </template>
        </ElTable>

        <div
          class="pagination custom-pagination"
          v-if="showPagination"
          :class="mergedPaginationOptions?.align"
          ref="paginationRef"
        >
          <ElPagination
            v-bind="mergedPaginationOptions"
            :total="pagination?.total"
            :disabled="loading"
            :page-size="pagination?.size"
            :current-page="pagination?.current"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>

      <!-- 卡片附加内容插槽：弹窗、抽屉等 -->
      <slot name="footer"></slot>
    </component>
  </div>
</template>

<script setup lang="ts">
  import { ElCard, ElEmpty, ElPagination, ElTable, ElTableColumn } from 'element-plus'
  import { ref, computed, nextTick, watchEffect, getCurrentInstance, useAttrs, useSlots } from 'vue'
  import type { FormRules, TableInstance, TableProps } from 'element-plus'
  import { storeToRefs } from 'pinia'
  import type { ColumnOption } from '@/types/component'
  import { useTableStore } from '@/store/modules/table'
  import { useCommon } from '@/hooks/core/useCommon'
  import { useTableHeight } from '@/hooks/core/useTableHeight'
  import { useResizeObserver, useWindowSize } from '@vueuse/core'
  import AoSearchBar, { type SearchFormItem } from '@/components/forms/AoSearchBar.vue'
  import AoTableHeader from '../AoTableHeader.vue'

  defineOptions({ name: 'AoTable' })

  const { width } = useWindowSize()
  const elTableRef = ref<TableInstance | null>(null)
  const paginationRef = ref<HTMLElement>()
  const tableHeaderRef = ref<HTMLElement>()
  const tableStore = useTableStore()
  const { isBorder, isZebra, tableSize, isFullScreen, isHeaderBackground } = storeToRefs(tableStore)
  const slots = useSlots()

  /** 搜索栏组件实例，用于查询前触发表单校验 */
  const searchBarRef = ref<{ validate: () => Promise<unknown> } | null>(null)

  /** 分页配置接口 */
  interface PaginationConfig {
    /** 当前页码 */
    current: number
    /** 每页显示条目个数 */
    size: number
    /** 总条目数 */
    total: number
  }

  /** 分页器配置选项接口 */
  interface PaginationOptions {
    /** 每页显示个数选择器的选项列表 */
    pageSizes?: number[]
    /** 分页器的对齐方式 */
    align?: 'left' | 'center' | 'right'
    /** 分页器的布局 */
    layout?: string
    /** 是否显示分页器背景 */
    background?: boolean
    /** 只有一页时是否隐藏分页器 */
    hideOnSinglePage?: boolean
    /** 分页器的大小 */
    size?: 'small' | 'default' | 'large'
    /** 分页器的页码数量 */
    pagerCount?: number
  }

  /** AoTable 组件的 Props 接口 */
  interface AoTableProps extends TableProps<Record<string, any>> {
    /** 加载状态 */
    loading?: boolean
    /** 列渲染配置 */
    columns?: ColumnOption[]
    /** 分页状态 */
    pagination?: PaginationConfig
    /** 分页配置 */
    paginationOptions?: PaginationOptions
    /** 空数据表格高度 */
    emptyHeight?: string
    /** 空数据时显示的文本 */
    emptyText?: string
    /** 是否开启 AoTableHeader，解决表格高度自适应问题 */
    showTableHeader?: boolean
    /** 搜索项配置（同 AoSearchBar 的 items），传入后自动在表格上方渲染搜索栏 */
    searchItems?: SearchFormItem[]
    /** 搜索表单校验规则，配置后点击查询会先校验，未通过则不触发查询 */
    searchRules?: FormRules
    /** 搜索栏单项占位宽度（24 栅格），默认沿用 AoSearchBar 的 6 */
    searchSpan?: number
    /** 搜索栏是否显示展开 / 收起按钮，默认沿用 AoSearchBar 的 true */
    searchShowExpand?: boolean
    /** 是否渲染搜索栏；显式传入时同时作为表格头部搜索切换按钮的开关状态 */
    showSearchBar?: boolean
    /** 表格头部是否显示斑马纹开关，默认沿用 AoTableHeader 的 true */
    headerShowZebra?: boolean
    /** 表格头部是否显示边框开关，默认沿用 AoTableHeader 的 true */
    headerShowBorder?: boolean
    /** 表格头部是否显示表头背景开关，默认沿用 AoTableHeader 的 true */
    headerShowHeaderBackground?: boolean
    /** 是否启用集成布局（搜索栏 + 卡片 + 表格头部），默认按 searchItems / 头部插槽自动判断 */
    integrated?: boolean
  }

  const props = withDefaults(defineProps<AoTableProps>(), {
    columns: () => [],
    searchItems: () => [],
    fit: true,
    showHeader: true,
    stripe: undefined,
    border: undefined,
    size: undefined,
    emptyHeight: '100%',
    emptyText: '暂无数据',
    showTableHeader: true,
    searchShowExpand: undefined,
    showSearchBar: undefined,
    headerShowZebra: undefined,
    headerShowBorder: undefined,
    headerShowHeaderBackground: undefined,
    integrated: undefined
  })

  /** 搜索表单数据，支持 v-model:searchForm 双向绑定 */
  const searchFormModel = defineModel<Record<string, any>>('searchForm', {
    default: () => ({})
  })

  /** 表格头部列显示控制，支持 v-model:columnChecks 双向绑定（通常直接传入 useTable 的 columnChecks） */
  const headerColumns = defineModel<ColumnOption[]>('columnChecks', {
    default: () => []
  })

  const instance = getCurrentInstance()
  const attrs = useAttrs()

  const LAYOUT = {
    MOBILE: 'prev, pager, next, sizes, jumper, total',
    IPAD: 'prev, pager, next, jumper, total',
    DESKTOP: 'total, prev, pager, next, sizes, jumper'
  }

  const layout = computed(() => {
    if (width.value < 768) {
      return LAYOUT.MOBILE
    } else if (width.value < 1024) {
      return LAYOUT.IPAD
    } else {
      return LAYOUT.DESKTOP
    }
  })

  // 默认分页常量
  const DEFAULT_PAGINATION_OPTIONS: PaginationOptions = {
    pageSizes: [10, 20, 30, 50, 100],
    align: 'center',
    background: true,
    layout: layout.value,
    hideOnSinglePage: false,
    size: 'default',
    pagerCount: width.value > 1200 ? 7 : 5
  }

  // 合并分页配置
  const mergedPaginationOptions = computed(() => ({
    ...DEFAULT_PAGINATION_OPTIONS,
    ...props.paginationOptions
  }))

  // 边框 (优先级：props > store)
  const border = computed(() => props.border ?? isBorder.value)
  // 斑马纹
  const stripe = computed(() => props.stripe ?? isZebra.value)
  // 表格尺寸
  const size = computed(() => props.size ?? tableSize.value)
  // 数据是否为空
  const isEmpty = computed(() => props.data?.length === 0)

  // 是否传入搜索项
  const hasSearchItems = computed(() => (props.searchItems?.length ?? 0) > 0)
  // 是否编写了表格头部插槽
  const hasHeaderSlot = computed(() => !!(slots['header-left'] || slots['header-right']))
  // 是否启用集成布局：显式指定优先，否则按搜索项 / 头部插槽自动判断
  const isIntegrated = computed(
    () => props.integrated ?? (hasSearchItems.value || hasHeaderSlot.value)
  )
  // 搜索栏是否显示（仅控制 v-show 显隐，不影响挂载，避免重置快照被刷新）
  const renderSearchBar = computed(() => props.showSearchBar ?? hasSearchItems.value)
  // 是否渲染表格头部
  const renderHeader = computed(() => isIntegrated.value && props.showTableHeader)
  // 根容器样式类：集成模式为纵向容器，默认模式不生成盒子以保持既有 DOM 布局
  const rootClass = computed(() => (isIntegrated.value ? 'is-integrated' : 'is-bare'))
  // 表格容器组件：集成模式使用卡片承载
  const cardComponent = computed(() => (isIntegrated.value ? ElCard : 'div'))
  // 表格容器样式类：集成模式使用卡片承载，未显示搜索栏时卡片紧贴页面顶部
  const cardClass = computed(() => {
    if (!isIntegrated.value) return 'ao-table-bare'
    return ['ao-table-card', { 'is-search-hidden': !renderSearchBar.value }]
  })

  const paginationHeight = ref(0)
  const tableHeaderHeight = ref(0)

  // 使用 useResizeObserver 监听分页器高度变化
  useResizeObserver(paginationRef, (entries) => {
    const entry = entries[0]
    if (entry) {
      // 使用 requestAnimationFrame 避免 ResizeObserver loop 警告
      requestAnimationFrame(() => {
        paginationHeight.value = entry.contentRect.height
      })
    }
  })

  // 使用 useResizeObserver 监听表格头部高度变化
  useResizeObserver(tableHeaderRef, (entries) => {
    const entry = entries[0]
    if (entry) {
      // 使用 requestAnimationFrame 避免 ResizeObserver loop 警告
      requestAnimationFrame(() => {
        tableHeaderHeight.value = entry.contentRect.height
      })
    }
  })

  // 分页器与表格之间的间距常量（计算属性，响应 showTableHeader 变化）
  const PAGINATION_SPACING = computed(() => (props.showTableHeader ? 6 : 15))

  // 使用表格高度计算 Hook
  const { containerHeight } = useTableHeight({
    showTableHeader: computed(() => props.showTableHeader),
    paginationHeight,
    tableHeaderHeight,
    paginationSpacing: PAGINATION_SPACING
  })

  // 表格高度逻辑
  const height = computed(() => {
    // 全屏模式下占满全屏
    if (isFullScreen.value) return '100%'
    // 空数据且非加载状态时固定高度
    if (isEmpty.value && !props.loading) return props.emptyHeight
    // 使用传入的高度
    if (props.height) return props.height
    // 默认占满容器高度
    return '100%'
  })

  // 表头背景颜色样式
  const headerCellStyle = computed(() => ({
    background: isHeaderBackground.value
      ? 'var(--el-fill-color-lighter)'
      : 'var(--default-box-color)',
    ...(props.headerCellStyle || {}) // 合并用户传入的样式
  }))

  // 只有显式传入时才覆盖 ElTable 的原生默认值，避免继承的 Boolean props 把官方默认值冲掉。
  const hasExplicitTableProp = (propName: string): boolean => {
    const rawProps = (instance?.vnode.props || {}) as Record<string, unknown>
    const kebabName = propName.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
    return propName in rawProps || kebabName in rawProps
  }

  /** AoTable 自身扩展属性，不向 ElTable 透传，避免对象 / 数组被序列化为 DOM 属性 */
  const OWN_PROP_KEYS = [
    'loading',
    'columns',
    'pagination',
    'paginationOptions',
    'emptyHeight',
    'emptyText',
    'showTableHeader',
    'searchItems',
    'searchRules',
    'searchSpan',
    'searchShowExpand',
    'showSearchBar',
    'headerShowZebra',
    'headerShowBorder',
    'headerShowHeaderBackground',
    'integrated',
    'searchForm',
    'columnChecks'
  ]

  /**
   * @description 过滤掉 AoTable 自身属性后，需要透传给 ElTable 的属性
   * @return 透传给 ElTable 的属性对象
   */
  const passThroughProps = computed(() => {
    const rest = { ...props } as Record<string, unknown>
    OWN_PROP_KEYS.forEach((key) => {
      delete rest[key]
    })
    return rest
  })

  const mergedTableProps = computed(() => ({
    ...attrs,
    ...passThroughProps.value,
    height: height.value,
    stripe: stripe.value,
    border: border.value,
    size: size.value,
    headerCellStyle: headerCellStyle.value,
    // Element Plus 默认值为 true，未显式传入时不应被 AoTable 覆盖成 false。
    selectOnIndeterminate: hasExplicitTableProp('selectOnIndeterminate')
      ? props.selectOnIndeterminate
      : undefined
  }))

  // 是否显示分页器
  const showPagination = computed(() => props.pagination && !isEmpty.value)

  // Element Plus 在部分场景会先用 $index = -1 进行预渲染。
  // 这对普通展示无影响，但会让 ElForm 错误注册出 lineList.-1.xxx 这类字段。
  const shouldRenderSlotScope = (slotScope: { $index?: number }) => {
    return slotScope.$index === undefined || slotScope.$index >= 0
  }

  // 清理列属性，移除插槽相关的自定义属性，确保它们不会被 ElTableColumn 错误解释
  const cleanColumnProps = (col: ColumnOption) => {
    const columnProps = { ...col }
    // 删除自定义的插槽控制属性
    delete columnProps.useHeaderSlot
    delete columnProps.headerSlotName
    delete columnProps.useSlot
    delete columnProps.slotName
    return columnProps
  }

  // 分页大小变化
  const handleSizeChange = (val: number) => {
    emit('pagination:size-change', val)
  }

  // 分页当前页变化
  const handleCurrentChange = (val: number) => {
    emit('pagination:current-change', val)
    scrollToTop() // 页码改变后滚动到表格顶部
  }

  /**
   * @description 处理搜索事件，配置校验规则时先校验，未通过则不触发查询
   * @param params 清洗后的搜索参数
   */
  const handleSearch = async (params: Record<string, any>): Promise<void> => {
    if (props.searchRules) {
      try {
        await searchBarRef.value?.validate()
      } catch {
        return
      }
    }
    emit('search', params)
  }

  /** @description 处理重置事件，表单重置由搜索栏内部完成，此处仅向父级抛出以重置查询参数 */
  const handleReset = (): void => {
    emit('reset')
  }

  /** @description 处理表格头部刷新事件 */
  const handleRefresh = (): void => {
    emit('refresh')
  }

  /**
   * @description 处理表格头部搜索按钮的开关变化
   * @param value 搜索栏显示状态
   */
  const handleShowSearchBarChange = (value: boolean): void => {
    emit('update:showSearchBar', value)
  }

  const { scrollToTop: scrollPageToTop } = useCommon()

  // 滚动表格内容到顶部，并可以联动页面滚动到顶部
  const scrollToTop = () => {
    nextTick(() => {
      elTableRef.value?.setScrollTop(0) // 滚动 ElTable 内部滚动条到顶部
      scrollPageToTop() // 调用公共 composable 滚动页面到顶部
    })
  }

  // 全局序号
  const getGlobalIndex = (index: number) => {
    if (!props.pagination) return index + 1
    const { current, size } = props.pagination
    return (current - 1) * size + index + 1
  }

  const emit = defineEmits<{
    (e: 'pagination:size-change', val: number): void
    (e: 'pagination:current-change', val: number): void
    (e: 'refresh'): void
    (e: 'search', params: Record<string, any>): void
    (e: 'reset'): void
    (e: 'update:showSearchBar', value: boolean): void
  }>()

  // 查找并绑定表格头部元素 - 使用 VueUse 优化
  const findTableHeader = () => {
    if (!props.showTableHeader) {
      tableHeaderRef.value = undefined
      return
    }

    const tableHeader = document.getElementById('ao-table-header')
    if (tableHeader) {
      tableHeaderRef.value = tableHeader
    } else {
      // 如果找不到表格头部，设置为 undefined，useElementSize 会返回 0
      tableHeaderRef.value = undefined
    }
  }

  watchEffect(
    () => {
      // 访问响应式数据以建立依赖追踪
      void props.data?.length // 追踪数据变化
      const shouldShow = props.showTableHeader

      // 只有在需要显示表格头部时才查找
      if (shouldShow) {
        nextTick(() => {
          findTableHeader()
        })
      } else {
        // 不显示时清空引用
        tableHeaderRef.value = undefined
      }
    },
    { flush: 'post' }
  )

  defineExpose({
    scrollToTop,
    elTableRef
  })
</script>

<style lang="scss" scoped>
  @use './style';
</style>
