<!-- 混合菜单 -->
<template>
  <div class="mixed-menu flex-c">
    <!-- 左侧滚动按钮 -->
    <div v-show="showLeftArrow" class="button-arrow" @click="scroll('left')">
      <ElIcon>
        <ArrowLeft />
      </ElIcon>
    </div>

    <!-- 滚动容器 -->
    <ElScrollbar
      ref="scrollbarRef"
      wrap-class="scrollbar-wrapper"
      :horizontal="true"
      @scroll="handleScroll"
      @wheel="handleWheel"
    >
      <div class="scroll-content flex-c">
        <template v-for="item in processedMenuList" :key="item.meta.title">
          <div
            v-if="!item.meta.isHide"
            class="menu-item flex-c c-p"
            :class="{ 'menu-item-active': item.isActive }"
            @click="handleMenuJump(item, true)"
          >
            <AoSvgIcon
              :icon="item.meta.icon"
              class="menu-item-icon"
              :class="{ 'is-active': item.isActive }"
            />
            <span class="menu-item-title" :class="{ 'is-active': item.isActive }">
              {{ item.formattedTitle }}
            </span>
            <div v-if="item.meta.showBadge" class="ao-badge ao-badge-mixed" />
          </div>
        </template>
      </div>
    </ElScrollbar>

    <!-- 右侧滚动按钮 -->
    <div v-show="showRightArrow" class="button-arrow button-arrow-right" @click="scroll('right')">
      <ElIcon>
        <ArrowRight />
      </ElIcon>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, nextTick } from 'vue'
  import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
  import { useThrottleFn } from '@vueuse/core'
  import { formatMenuTitle } from '@/utils/router'
  import { handleMenuJump } from '@/utils/navigation'
  import type { AppRouteRecord } from '@/types/router'

  defineOptions({ name: 'AoMixedMenu' })

  interface Props {
    /** 菜单列表数据 */
    list: AppRouteRecord[]
  }

  interface ProcessedMenuItem extends AppRouteRecord {
    isActive: boolean
    formattedTitle: string
  }

  type ScrollDirection = 'left' | 'right'

  const route = useRoute()

  const props = withDefaults(defineProps<Props>(), {
    list: () => []
  })

  const scrollbarRef = ref<any>()
  const showLeftArrow = ref(false)
  const showRightArrow = ref(false)

  /** 滚动配置 */
  const SCROLL_CONFIG = {
    /** 点击按钮时的滚动距离 */
    BUTTON_SCROLL_DISTANCE: 200,
    /** 鼠标滚轮快速滚动时的步长 */
    WHEEL_FAST_STEP: 35,
    /** 鼠标滚轮慢速滚动时的步长 */
    WHEEL_SLOW_STEP: 30,
    /** 区分快慢滚动的阈值 */
    WHEEL_FAST_THRESHOLD: 100
  }

  /**
   * 获取当前激活路径
   * 使用computed缓存，避免重复计算
   */
  const currentActivePath = computed(() => {
    return String(route.meta.activePath || route.path)
  })

  /**
   * 判断菜单项是否为激活状态
   * 递归检查子菜单中是否包含当前路径
   * @param item 菜单项数据
   * @returns 是否为激活状态
   */
  const isMenuItemActive = (item: AppRouteRecord): boolean => {
    const activePath = currentActivePath.value

    // 如果有子菜单，递归检查子菜单
    if (item.children?.length) {
      return item.children.some((child) => {
        if (child.children?.length) {
          return isMenuItemActive(child)
        }
        return child.path === activePath
      })
    }

    // 直接比较路径
    return item.path === activePath
  }

  /**
   * 预处理菜单列表
   * 缓存每个菜单项的激活状态和格式化标题
   */
  const processedMenuList = computed<ProcessedMenuItem[]>(() => {
    return props.list.map((item) => ({
      ...item,
      isActive: isMenuItemActive(item),
      formattedTitle: formatMenuTitle(item.meta.title)
    }))
  })

  /**
   * 处理滚动事件的核心逻辑
   * 根据滚动位置显示/隐藏滚动按钮
   */
  const handleScrollCore = (): void => {
    if (!scrollbarRef.value?.wrapRef) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollbarRef.value.wrapRef

    // 判断是否显示左侧滚动按钮
    showLeftArrow.value = scrollLeft > 0

    // 判断是否显示右侧滚动按钮
    showRightArrow.value = scrollLeft + clientWidth < scrollWidth
  }

  /**
   * 节流后的滚动事件处理函数
   * 调整节流间隔为16ms，约等于60fps
   */
  const handleScroll = useThrottleFn(handleScrollCore, 16)

  /**
   * 滚动菜单容器
   * @param direction 滚动方向，left 或 right
   */
  const scroll = (direction: ScrollDirection): void => {
    if (!scrollbarRef.value?.wrapRef) return

    const currentScroll = scrollbarRef.value.wrapRef.scrollLeft
    const targetScroll =
      direction === 'left'
        ? currentScroll - SCROLL_CONFIG.BUTTON_SCROLL_DISTANCE
        : currentScroll + SCROLL_CONFIG.BUTTON_SCROLL_DISTANCE

    // 平滑滚动到目标位置
    scrollbarRef.value.wrapRef.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    })
  }

  /**
   * 处理鼠标滚轮事件
   * 优化滚轮响应性能
   * @param event 滚轮事件
   */
  const handleWheel = (event: WheelEvent): void => {
    // 立即阻止默认滚动行为和事件冒泡，避免页面滚动
    event.preventDefault()
    event.stopPropagation()

    // 直接处理滚动，提升响应性
    if (!scrollbarRef.value?.wrapRef) return

    const { wrapRef } = scrollbarRef.value
    const { scrollLeft, scrollWidth, clientWidth } = wrapRef

    // 使用更小的滚动步长，让滚动更平滑
    const scrollStep =
      Math.abs(event.deltaY) > SCROLL_CONFIG.WHEEL_FAST_THRESHOLD
        ? SCROLL_CONFIG.WHEEL_FAST_STEP
        : SCROLL_CONFIG.WHEEL_SLOW_STEP
    const scrollDelta = event.deltaY > 0 ? scrollStep : -scrollStep
    const targetScroll = Math.max(0, Math.min(scrollLeft + scrollDelta, scrollWidth - clientWidth))

    // 立即滚动，无动画
    wrapRef.scrollLeft = targetScroll

    // 更新滚动按钮状态
    handleScrollCore()
  }

  /**
   * 初始化滚动状态
   */
  const initScrollState = (): void => {
    nextTick(() => {
      handleScrollCore()
    })
  }

  onMounted(initScrollState)
</script>

<style scoped lang="scss">
  // 混合菜单容器：relative box-border w-full overflow-hidden
  .mixed-menu {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    overflow: hidden;
  }

  // 滚动内容容器：box-border flex-shrink-0 flex-nowrap h-15 whitespace-nowrap
  .scroll-content {
    box-sizing: border-box;
    flex-shrink: 0;
    flex-wrap: nowrap;
    height: 3.75rem; // h-15
    white-space: nowrap;
  }

  // 菜单项：relative flex-shrink-0 h-10 px-3 text-sm hover:text-theme
  .menu-item {
    position: relative;
    flex-shrink: 0;
    height: 2.5rem; // h-10
    padding-right: 0.75rem; // px-3
    padding-left: 0.75rem; // px-3
    font-size: 0.875rem; // text-sm
    line-height: 1.25rem; // text-sm

    &:hover {
      color: var(--theme-color); // hover:text-theme
    }

    // 激活状态：text-theme
    &.menu-item-active {
      color: var(--theme-color);
    }
  }

  // 菜单项图标：text-lg text-g-700 dark:text-g-800 mr-1
  .menu-item-icon {
    margin-right: 0.25rem; // mr-1
    font-size: 1.125rem; // text-lg
    line-height: 1.75rem; // text-lg
    color: var(--ao-gray-700); // text-g-700

    // 暗黑模式：dark:text-g-800
    .dark & {
      color: var(--ao-gray-800);
    }

    // 激活状态：!text-theme
    &.is-active {
      color: var(--theme-color) !important;
    }
  }

  // 菜单项标题：text-md text-g-700 dark:text-g-800
  .menu-item-title {
    font-size: 1rem; // text-md
    line-height: 1.5rem; // text-md
    color: var(--ao-gray-700); // text-g-700

    // 暗黑模式：dark:text-g-800
    .dark & {
      color: var(--ao-gray-800);
    }

    // 激活状态：!text-theme
    &.is-active {
      color: var(--theme-color) !important;
    }
  }

  // 滚动按钮（左右通用）：
  // absolute top-1/2 z-2 flex items-center justify-center size-7.5
  // text-g-600 cursor-pointer rounded transition-all duration-300 -translate-y-1/2
  // hover:text-g-900 hover:bg-g-200
  .button-arrow {
    position: absolute;
    top: 50%; // top-1/2
    z-index: 2; // z-2
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.875rem; // size-7.5
    height: 1.875rem; // size-7.5
    color: var(--ao-gray-600); // text-g-600
    cursor: pointer;
    border-radius: 0.25rem; // rounded
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); // Tailwind 默认
    transition-duration: 300ms;
    transition-property: all;
    transform: translateY(-50%); // -translate-y-1/2

    &:hover {
      color: var(--ao-gray-900); // hover:text-g-900
      background: var(--ao-gray-200); // hover:bg-g-200
    }
  }

  // 右侧滚动按钮：right-2
  .button-arrow-right {
    right: 0.5rem; // right-2
  }

  :deep(.el-scrollbar__bar.is-horizontal) {
    bottom: 5px;
    display: none;
    height: 2px;
  }

  :deep(.scrollbar-wrapper) {
    flex: 1;
    min-width: 0;
    margin: 0 50px 0 30px;
  }

  .menu-item-active::after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 2px;
    margin: auto;
    content: '';
    background-color: var(--theme-color);
  }

  @media (width <= 1440px) {
    :deep(.scrollbar-wrapper) {
      margin: 0 45px;
    }
  }
</style>
