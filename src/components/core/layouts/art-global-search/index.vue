<!-- 全局搜索组件 -->
<template>
  <div class="layout-search">
    <ElDialog
      v-model="showSearchDialog"
      width="600"
      :show-close="false"
      :lock-scroll="false"
      modal-class="search-modal"
      @close="closeSearchDialog"
    >
      <ElInput
        v-model.trim="searchVal"
        :placeholder="$t('search.placeholder')"
        @input="search"
        @blur="searchBlur"
        ref="searchInput"
        :prefix-icon="Search"
        class="search-input"
      >
        <template #suffix>
          <div class="search-input__suffix flex-cc">
            <ArtSvgIcon icon="fluent:arrow-enter-left-20-filled" />
          </div>
        </template>
      </ElInput>
      <ElScrollbar class="search-scrollbar" max-height="370px" ref="searchResultScrollbar" always>
        <div class="result search-result" v-show="searchResult.length">
          <div
            class="box search-result__item c-p"
            v-for="(item, index) in searchResult"
            :key="index"
          >
            <div
              class="search-result__inner flex-cb rounded-custom-sm"
              :class="isHighlighted(index) ? 'search-result__inner--highlighted' : ''"
              @click="searchGoPage(item)"
              @mouseenter="highlightOnHover(index)"
            >
              {{ formatMenuTitle(item.meta.title) }}
              <ArtSvgIcon v-show="isHighlighted(index)" icon="fluent:arrow-enter-left-20-filled" />
            </div>
          </div>
        </div>

        <div v-show="!searchVal && searchResult.length === 0 && historyResult.length > 0">
          <p class="search-history__title">{{ $t('search.historyTitle') }}</p>
          <div class="search-history__list">
            <div
              class="box search-history__item c-p flex-cb rounded-custom-sm"
              v-for="(item, index) in historyResult"
              :key="index"
              :class="historyHIndex === index ? 'search-history__item--highlighted' : ''"
              @click="searchGoPage(item)"
              @mouseenter="highlightOnHoverHistory(index)"
            >
              {{ formatMenuTitle(item.meta.title) }}
              <div
                class="selected-icon search-history__delete flex-cc c-p"
                @click.stop="deleteHistory(index)"
              >
                <ArtSvgIcon icon="ri:close-large-fill" class="search-history__delete-icon" />
              </div>
            </div>
          </div>
        </div>
      </ElScrollbar>

      <template #footer>
        <div class="dialog-footer box-border flex-c border-t-d">
          <div class="flex-cc">
            <ArtSvgIcon icon="fluent:arrow-enter-left-20-filled" class="keyboard" />
            <span class="dialog-footer__text">{{ $t('search.selectKeydown') }}</span>
          </div>
          <div class="flex-c">
            <ArtSvgIcon icon="ri:arrow-up-wide-fill" class="keyboard" />
            <ArtSvgIcon icon="ri:arrow-down-wide-fill" class="keyboard" />
            <span class="dialog-footer__text">{{ $t('search.switchKeydown') }}</span>
          </div>
          <div class="flex-c">
            <i class="keyboard keyboard--esc flex-cc"><p class="keyboard__esc-text">ESC</p></i>
            <span class="dialog-footer__text">{{ $t('search.exitKeydown') }}</span>
          </div>
        </div>
      </template>
    </ElDialog>
  </div>
</template>

<script lang="ts" setup>
  import { useUserStore } from '@/store/modules/user'
  import { AppRouteRecord } from '@/types/router'
  import { Search } from '@element-plus/icons-vue'
  import { mittBus } from '@/utils/sys'
  import { useMenuStore } from '@/store/modules/menu'
  import { formatMenuTitle } from '@/utils/router'
  import { handleMenuJump } from '@/utils/navigation'
  import { type ScrollbarInstance } from 'element-plus'

  defineOptions({ name: 'ArtGlobalSearch' })

  const userStore = useUserStore()
  const { menuList } = storeToRefs(useMenuStore())

  const showSearchDialog = ref(false)
  const searchVal = ref('')
  const searchResult = ref<AppRouteRecord[]>([])
  const historyMaxLength = 10

  const { searchHistory: historyResult } = storeToRefs(userStore)

  const searchInput = ref<HTMLInputElement | null>(null)
  const highlightedIndex = ref(0)
  const historyHIndex = ref(0)
  const searchResultScrollbar = ref<ScrollbarInstance>()
  const isKeyboardNavigating = ref(false) // 新增状态：是否正在使用键盘导航

  // 生命周期钩子
  onMounted(() => {
    mittBus.on('openSearchDialog', openSearchDialog)
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })

  // 键盘快捷键处理
  const handleKeydown = (event: KeyboardEvent) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
    const isCommandKey = isMac ? event.metaKey : event.ctrlKey

    if (isCommandKey && event.key.toLowerCase() === 'k') {
      event.preventDefault()
      showSearchDialog.value = true
      focusInput()
    }

    // 当搜索对话框打开时，处理方向键和回车键
    if (showSearchDialog.value) {
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        highlightPrevious()
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        highlightNext()
      } else if (event.key === 'Enter') {
        event.preventDefault()
        selectHighlighted()
      } else if (event.key === 'Escape') {
        event.preventDefault()
        showSearchDialog.value = false
      }
    }
  }

  const focusInput = () => {
    setTimeout(() => {
      searchInput.value?.focus()
    }, 100)
  }

  // 搜索逻辑
  const search = (val: string) => {
    if (val) {
      searchResult.value = flattenAndFilterMenuItems(menuList.value, val)
    } else {
      searchResult.value = []
    }
  }

  const flattenAndFilterMenuItems = (items: AppRouteRecord[], val: string): AppRouteRecord[] => {
    const lowerVal = val.toLowerCase()
    const result: AppRouteRecord[] = []

    const flattenAndMatch = (item: AppRouteRecord) => {
      if (item.meta?.isHide) return

      const lowerItemTitle = formatMenuTitle(item.meta.title).toLowerCase()

      if (item.children && item.children.length > 0) {
        item.children.forEach(flattenAndMatch)
        return
      }

      if (
        lowerItemTitle.includes(lowerVal) &&
        ((item.path && item.path.trim()) || item.meta.link || item.meta.isIframe)
      ) {
        result.push({ ...item, children: undefined })
      }
    }

    items.forEach(flattenAndMatch)
    return result
  }

  // 高亮控制并实现滚动条跟随
  const highlightPrevious = () => {
    isKeyboardNavigating.value = true
    if (searchVal.value) {
      highlightedIndex.value =
        (highlightedIndex.value - 1 + searchResult.value.length) % searchResult.value.length
      scrollToHighlightedItem()
    } else {
      historyHIndex.value =
        (historyHIndex.value - 1 + historyResult.value.length) % historyResult.value.length
      scrollToHighlightedHistoryItem()
    }
    // 延迟重置键盘导航状态，防止立即被 hover 覆盖
    setTimeout(() => {
      isKeyboardNavigating.value = false
    }, 100)
  }

  const highlightNext = () => {
    isKeyboardNavigating.value = true
    if (searchVal.value) {
      highlightedIndex.value = (highlightedIndex.value + 1) % searchResult.value.length
      scrollToHighlightedItem()
    } else {
      historyHIndex.value = (historyHIndex.value + 1) % historyResult.value.length
      scrollToHighlightedHistoryItem()
    }
    setTimeout(() => {
      isKeyboardNavigating.value = false
    }, 100)
  }

  const scrollToHighlightedItem = () => {
    nextTick(() => {
      if (!searchResultScrollbar.value || !searchResult.value.length) return

      const scrollWrapper = searchResultScrollbar.value.wrapRef
      if (!scrollWrapper) return

      const highlightedElements = scrollWrapper.querySelectorAll('.result .box')
      if (!highlightedElements[highlightedIndex.value]) return

      const highlightedElement = highlightedElements[highlightedIndex.value] as HTMLElement
      const itemHeight = highlightedElement.offsetHeight
      const scrollTop = scrollWrapper.scrollTop
      const containerHeight = scrollWrapper.clientHeight
      const itemTop = highlightedElement.offsetTop
      const itemBottom = itemTop + itemHeight

      if (itemTop < scrollTop) {
        searchResultScrollbar.value.setScrollTop(itemTop)
      } else if (itemBottom > scrollTop + containerHeight) {
        searchResultScrollbar.value.setScrollTop(itemBottom - containerHeight)
      }
    })
  }

  const scrollToHighlightedHistoryItem = () => {
    nextTick(() => {
      if (!searchResultScrollbar.value || !historyResult.value.length) return

      const scrollWrapper = searchResultScrollbar.value.wrapRef
      if (!scrollWrapper) return

      const historyItems = scrollWrapper.querySelectorAll('.history-result .box')
      if (!historyItems[historyHIndex.value]) return

      const highlightedElement = historyItems[historyHIndex.value] as HTMLElement
      const itemHeight = highlightedElement.offsetHeight
      const scrollTop = scrollWrapper.scrollTop
      const containerHeight = scrollWrapper.clientHeight
      const itemTop = highlightedElement.offsetTop
      const itemBottom = itemTop + itemHeight

      if (itemTop < scrollTop) {
        searchResultScrollbar.value.setScrollTop(itemTop)
      } else if (itemBottom > scrollTop + containerHeight) {
        searchResultScrollbar.value.setScrollTop(itemBottom - containerHeight)
      }
    })
  }

  const selectHighlighted = () => {
    if (searchVal.value && searchResult.value.length) {
      searchGoPage(searchResult.value[highlightedIndex.value])
    } else if (!searchVal.value && historyResult.value.length) {
      searchGoPage(historyResult.value[historyHIndex.value])
    }
  }

  const isHighlighted = (index: number) => {
    return highlightedIndex.value === index
  }

  const searchBlur = () => {
    highlightedIndex.value = 0
  }

  const searchGoPage = (item: AppRouteRecord) => {
    showSearchDialog.value = false
    addHistory(item)
    handleMenuJump(item)
    searchVal.value = ''
    searchResult.value = []
  }

  // 历史记录管理
  const updateHistory = () => {
    if (Array.isArray(historyResult.value)) {
      userStore.setSearchHistory(historyResult.value)
    }
  }

  const addHistory = (item: AppRouteRecord) => {
    const itemKey = item.path || String(item.meta.link || '')
    const hasItemIndex = historyResult.value.findIndex(
      (historyItem: AppRouteRecord) =>
        (historyItem.path || String(historyItem.meta.link || '')) === itemKey
    )

    if (hasItemIndex !== -1) {
      historyResult.value.splice(hasItemIndex, 1)
    } else if (historyResult.value.length >= historyMaxLength) {
      historyResult.value.pop()
    }

    const cleanedItem = { ...item }
    delete cleanedItem.children
    delete cleanedItem.meta.authList
    historyResult.value.unshift(cleanedItem)
    updateHistory()
  }

  const deleteHistory = (index: number) => {
    historyResult.value.splice(index, 1)
    updateHistory()
  }

  // 对话框控制
  const openSearchDialog = () => {
    showSearchDialog.value = true
    focusInput()
  }

  const closeSearchDialog = () => {
    searchVal.value = ''
    searchResult.value = []
    highlightedIndex.value = 0
    historyHIndex.value = 0
  }

  // 修改 hover 高亮逻辑，只有在非键盘导航时才生效
  const highlightOnHover = (index: number) => {
    if (!isKeyboardNavigating.value && searchVal.value) {
      highlightedIndex.value = index
    }
  }

  const highlightOnHoverHistory = (index: number) => {
    if (!isKeyboardNavigating.value && !searchVal.value) {
      historyHIndex.value = index
    }
  }
</script>
<style lang="scss" scoped>
  .layout-search {
    :deep(.search-modal) {
      background-color: rgb(0 0 0 / 20%);
    }

    :deep(.el-dialog__body) {
      padding: 5px 0 0 !important;
    }

    :deep(.el-dialog__header) {
      padding: 0;
    }

    .el-input {
      :deep(.el-input__wrapper) {
        background-color: var(--art-gray-200);
        border: 1px solid var(--default-border-dashed);
        border-radius: calc(var(--custom-radius) / 2 + 2px) !important;
        box-shadow: none;
      }

      :deep(.el-input__inner) {
        color: var(--art-gray-800) !important;
      }
    }
  }

  .dark .layout-search {
    .el-input {
      :deep(.el-input__wrapper) {
        background-color: #333;
        border: 1px solid #4c4d50;
      }
    }

    :deep(.search-modal) {
      background-color: rgb(23 23 26 / 60%);
      backdrop-filter: none;
    }

    :deep(.el-dialog) {
      background-color: #252526;
    }
  }

  // ==================== 搜索输入框 ====================
  // h-12
  .search-input {
    height: 3rem; // h-12

    // 后缀容器：h-4.5 flex-cc rounded border border-g-300 dark:!bg-g-200/50 !bg-box px-1.5 text-g-500
    // 保留全局工具类 flex-cc
    &__suffix {
      height: 1.125rem; // h-4.5
      padding-left: 0.375rem; // px-1.5
      padding-right: 0.375rem;
      border: 1px solid var(--art-gray-300); // border border-g-300
      border-radius: 0.25rem; // rounded
      color: var(--art-gray-500);
      background: var(--default-box-color) !important; // !bg-box

      // dark:!bg-g-200/50
      .dark & {
        background: color-mix(in srgb, var(--art-gray-200) 50%, transparent) !important;
      }
    }
  }

  // ==================== 滚动区 ====================
  // mt-5
  .search-scrollbar {
    margin-top: 1.25rem; // mt-5
  }

  // ==================== 搜索结果 ====================
  // w-full
  .search-result {
    width: 100%; // w-full

    // box !mt-0 c-p text-base leading-none
    &__item {
      margin-top: 0 !important; // !mt-0
      font-size: 1rem; // text-base
      line-height: 1; // leading-none
    }

    // mt-2 h-12 flex-cb rounded-custom-sm bg-g-200/80 px-4 text-sm text-g-700
    // 保留全局工具类 flex-cb rounded-custom-sm
    &__inner {
      height: 3rem; // h-12
      margin-top: 0.5rem; // mt-2
      padding-left: 1rem; // px-4
      padding-right: 1rem;
      font-size: 0.875rem; // text-sm
      line-height: 1.25rem;
      color: var(--art-gray-700);
      background: color-mix(in srgb, var(--art-gray-200) 80%, transparent); // bg-g-200/80

      // highlighted !bg-theme/70 !text-white
      &--highlighted {
        background: color-mix(in srgb, var(--theme-color) 70%, transparent) !important;
        color: #fff !important;
      }
    }
  }

  // ==================== 历史搜索 ====================
  // text-xs text-g-500
  .search-history__title {
    font-size: 0.75rem; // text-xs
    line-height: 1rem;
    color: var(--art-gray-500);
  }

  // mt-1.5 w-full
  .search-history__list {
    margin-top: 0.375rem; // mt-1.5
    width: 100%; // w-full
  }

  // box mt-2 h-12 c-p flex-cb rounded-custom-sm bg-g-200/80 px-4 text-sm text-g-800
  // 保留全局工具类 c-p flex-cb rounded-custom-sm
  .search-history__item {
    height: 3rem; // h-12
    margin-top: 0.5rem; // mt-2
    padding-left: 1rem; // px-4
    padding-right: 1rem;
    font-size: 0.875rem; // text-sm
    line-height: 1.25rem;
    color: var(--art-gray-800);
    background: color-mix(in srgb, var(--art-gray-200) 80%, transparent); // bg-g-200/80

    // highlighted !bg-theme/70 !text-white [&_.selected-icon]:!text-white
    &--highlighted {
      background: color-mix(in srgb, var(--theme-color) 70%, transparent) !important;
      color: #fff !important;

      // [&_.selected-icon]:!text-white
      .selected-icon {
        color: #fff !important;
      }
    }
  }

  // 删除按钮：size-5 selected-icon select-none rounded-full text-g-500 flex-cc c-p
  // 保留全局工具类 flex-cc c-p
  .search-history__delete {
    width: 1.25rem; // size-5
    height: 1.25rem;
    user-select: none; // select-none
    border-radius: 9999px; // rounded-full
    color: var(--art-gray-500);
  }

  // 删除图标：text-xs
  .search-history__delete-icon {
    font-size: 0.75rem; // text-xs
    line-height: 1rem;
  }

  // ==================== 对话框底部 ====================
  // box-border flex-c border-t-d pt-4.5 pb-1
  // 保留全局工具类 flex-c border-t-d
  .dialog-footer {
    box-sizing: border-box;
    padding-top: 1.125rem; // pt-4.5
    padding-bottom: 0.25rem; // pb-1

    // mr-3.5 text-xs text-g-700
    &__text {
      margin-right: 0.875rem; // mr-3.5
      font-size: 0.75rem; // text-xs
      line-height: 1rem;
      color: var(--art-gray-700);
    }
  }

  // ==================== 键盘按键样式（原 @apply 展开） ====================
  // 原: @apply mr-2 box-border h-5 w-5.5 rounded border border-g-400 px-1 text-g-500
  //      shadow-[0_2px_0_var(--default-border-dashed)] last-of-type:mr-1.5;
  .keyboard {
    box-sizing: border-box; // box-border
    width: 1.375rem; // w-5.5
    height: 1.25rem; // h-5
    margin-right: 0.5rem; // mr-2
    padding-left: 0.25rem; // px-1
    padding-right: 0.25rem;
    border: 1px solid var(--art-gray-400); // border border-g-400
    border-radius: 0.25rem; // rounded
    color: var(--art-gray-500);
    box-shadow: 0 2px 0 var(--default-border-dashed); // shadow-[0_2px_0_var(--default-border-dashed)]

    &:last-of-type {
      margin-right: 0.375rem; // last-of-type:mr-1.5
    }
  }

  // ESC 键宽度覆盖：!w-8
  .keyboard--esc {
    width: 2rem !important; // !w-8
  }

  // ESC 文字：text-[10px] font-medium
  .keyboard__esc-text {
    font-size: 10px; // text-[10px]
    font-weight: 500; // font-medium
  }
</style>
