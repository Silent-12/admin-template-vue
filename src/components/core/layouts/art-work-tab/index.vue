<!-- 标签页 -->
<template>
  <div
    v-if="showWorkTab"
    class="work-tab flex-b"
    :class="[
      tabStyle === 'tab-card' ? 'work-tab--card' : '',
      tabStyle === 'tab-google' ? 'work-tab--google' : ''
    ]"
  >
    <div class="work-tab__scroll" ref="scrollRef">
      <ul
        class="work-tab__list"
        :class="[tabStyle === 'tab-google' ? 'work-tab__list--google' : '']"
        ref="tabsRef"
        :style="{
          transform: `translateX(${scrollState.translateX}px)`,
          transition: `${scrollState.transition}`
        }"
      >
        <li
          class="work-tab__item art-card-xs flex-cc c-p"
          :class="[
            item.path === activeTab
              ? 'work-tab__item--active activ-tab'
              : 'work-tab__item--inactive',
            tabStyle === 'tab-google' ? 'google-tab' : ''
          ]"
          :style="{
            padding: item.fixedTab ? '0 10px' : '0 8px 0 12px',
            borderRadius:
              tabStyle === 'tab-google'
                ? 'calc(var(--custom-radius) / 2.5 + 4px) !important'
                : 'calc(var(--custom-radius) / 2.5 + 2px) !important'
          }"
          v-for="(item, index) in list"
          :key="item.path"
          :ref="item.path"
          :id="`scroll-li-${index}`"
          @click="clickTab(item)"
          @contextmenu.prevent="(e: MouseEvent) => showMenu(e, item.path)"
        >
          <ArtSvgIcon
            v-show="item.icon"
            :icon="item.icon"
            class="work-tab__item-icon"
          />
          {{ item.customTitle || formatMenuTitle(item.title) }}
          <span
            v-if="list.length > 1 && !item.fixedTab"
            class="work-tab__close flex-cc tad-200"
            @click.stop="closeWorktab('current', item.path)"
          >
            <ArtSvgIcon icon="ri:close-large-fill" class="work-tab__close-icon" />
          </span>
          <div
            v-if="tabStyle === 'tab-google'"
            class="line"
          />
        </li>
      </ul>
    </div>

    <div class="work-tab__actions">
      <div
        class="work-tab__menu-btn flex-cc art-card-xs c-p tad-200"
        :style="{
          borderRadius: 'calc(var(--custom-radius) / 2.5 + 0px)',
          marginTop: tabStyle === 'tab-google' ? '-2px' : ''
        }"
        @click="(e: MouseEvent) => showMenu(e, activeTab)"
      >
        <ArtSvgIcon icon="iconamoon:arrow-down-2-thin" class="work-tab__menu-icon" />
      </div>
    </div>

    <ArtMenuRight
      ref="menuRef"
      :menu-items="menuItems"
      :menu-width="140"
      :border-radius="10"
      @select="handleSelect"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch, nextTick, onUnmounted } from 'vue'
  import { LocationQueryRaw, useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { storeToRefs } from 'pinia'

  import { useWorktabStore } from '@/store/modules/worktab'
  import { useUserStore } from '@/store/modules/user'
  import { formatMenuTitle } from '@/utils/router'
  import { useSettingStore } from '@/store/modules/setting'
  import { MenuItemType } from '../../others/art-menu-right/index.vue'
  import { useCommon } from '@/hooks/core/useCommon'
  import { WorkTab } from '@/types'

  defineOptions({ name: 'ArtWorkTab' })

  // 类型定义
  interface ScrollState {
    translateX: number
    transition: string
  }

  interface TouchState {
    startX: number
    currentX: number
  }

  type TabCloseType = 'current' | 'left' | 'right' | 'other' | 'all'

  // 基础设置
  const { t } = useI18n()
  const store = useWorktabStore()
  const userStore = useUserStore()
  const route = useRoute()
  const router = useRouter()
  const { currentRoute } = router
  const settingStore = useSettingStore()
  const { tabStyle, showWorkTab } = storeToRefs(settingStore)

  // DOM 引用
  const scrollRef = ref<HTMLElement | null>(null)
  const tabsRef = ref<HTMLElement | null>(null)
  const menuRef = ref()

  // 状态管理
  const scrollState = ref<ScrollState>({
    translateX: 0,
    transition: ''
  })

  const touchState = ref<TouchState>({
    startX: 0,
    currentX: 0
  })

  const clickedPath = ref('')

  // 计算属性
  const list = computed(() => store.opened)
  const activeTab = computed(() => currentRoute.value.path)
  const activeTabIndex = computed(() => list.value.findIndex((tab) => tab.path === activeTab.value))

  // 右键菜单逻辑
  const useContextMenu = () => {
    const getClickedTabInfo = () => {
      const clickedIndex = list.value.findIndex((tab) => tab.path === clickedPath.value)
      const currentTab = list.value[clickedIndex]

      return {
        clickedIndex,
        currentTab,
        isLastTab: clickedIndex === list.value.length - 1,
        isOneTab: list.value.length === 1,
        isCurrentTab: clickedPath.value === activeTab.value
      }
    }

    // 检查标签页是否固定
    const checkTabsFixedStatus = (clickedIndex: number) => {
      const leftTabs = list.value.slice(0, clickedIndex)
      const rightTabs = list.value.slice(clickedIndex + 1)
      const otherTabs = list.value.filter((_, index) => index !== clickedIndex)

      return {
        areAllLeftTabsFixed: leftTabs.length > 0 && leftTabs.every((tab) => tab.fixedTab),
        areAllRightTabsFixed: rightTabs.length > 0 && rightTabs.every((tab) => tab.fixedTab),
        areAllOtherTabsFixed: otherTabs.length > 0 && otherTabs.every((tab) => tab.fixedTab),
        areAllTabsFixed: list.value.every((tab) => tab.fixedTab)
      }
    }

    // 右键菜单选项
    const menuItems = computed(() => {
      const { clickedIndex, currentTab, isLastTab, isOneTab, isCurrentTab } = getClickedTabInfo()
      const fixedStatus = checkTabsFixedStatus(clickedIndex)

      return [
        {
          key: 'refresh',
          label: t('worktab.btn.refresh'),
          icon: 'ri:refresh-line',
          disabled: !isCurrentTab
        },
        {
          key: 'fixed',
          label: currentTab?.fixedTab ? t('worktab.btn.unfixed') : t('worktab.btn.fixed'),
          icon: 'ri:pushpin-2-line',
          disabled: false,
          showLine: true
        },
        {
          key: 'left',
          label: t('worktab.btn.closeLeft'),
          icon: 'ri:arrow-left-s-line',
          disabled: clickedIndex === 0 || fixedStatus.areAllLeftTabsFixed
        },
        {
          key: 'right',
          label: t('worktab.btn.closeRight'),
          icon: 'ri:arrow-right-s-line',
          disabled: isLastTab || fixedStatus.areAllRightTabsFixed
        },
        {
          key: 'other',
          label: t('worktab.btn.closeOther'),
          icon: 'ri:close-fill',
          disabled: isOneTab || fixedStatus.areAllOtherTabsFixed
        },
        {
          key: 'all',
          label: t('worktab.btn.closeAll'),
          icon: 'ri:close-circle-line',
          disabled: isOneTab || fixedStatus.areAllTabsFixed
        }
      ]
    })

    return { menuItems }
  }

  // 滚动逻辑
  const useScrolling = () => {
    const setTransition = () => {
      scrollState.value.transition = 'transform 0.5s cubic-bezier(0.15, 0, 0.15, 1)'
      setTimeout(() => {
        scrollState.value.transition = ''
      }, 250)
    }

    const getCurrentTabElement = (): HTMLElement | null => {
      return document.getElementById(`scroll-li-${activeTabIndex.value}`)
    }

    const calculateScrollPosition = () => {
      if (!scrollRef.value || !tabsRef.value) return

      const scrollWidth = scrollRef.value.offsetWidth
      const ulWidth = tabsRef.value.offsetWidth
      const curTabEl = getCurrentTabElement()

      if (!curTabEl) return

      const { offsetLeft, clientWidth } = curTabEl
      const curTabRight = offsetLeft + clientWidth
      const targetLeft = scrollWidth - curTabRight

      return {
        scrollWidth,
        ulWidth,
        offsetLeft,
        clientWidth,
        curTabRight,
        targetLeft
      }
    }

    const autoPositionTab = () => {
      const positions = calculateScrollPosition()
      if (!positions) return

      const { scrollWidth, ulWidth, offsetLeft, curTabRight, targetLeft } = positions

      if (
        (offsetLeft > Math.abs(scrollState.value.translateX) && curTabRight <= scrollWidth) ||
        (scrollState.value.translateX < targetLeft && targetLeft < 0)
      ) {
        return
      }

      requestAnimationFrame(() => {
        if (curTabRight > scrollWidth) {
          scrollState.value.translateX = Math.max(targetLeft - 6, scrollWidth - ulWidth)
        } else if (offsetLeft < Math.abs(scrollState.value.translateX)) {
          scrollState.value.translateX = -offsetLeft
        }
      })
    }

    const adjustPositionAfterClose = () => {
      const positions = calculateScrollPosition()
      if (!positions) return

      const { scrollWidth, ulWidth, offsetLeft, clientWidth } = positions
      const curTabLeft = offsetLeft + clientWidth

      requestAnimationFrame(() => {
        scrollState.value.translateX = curTabLeft > scrollWidth ? scrollWidth - ulWidth : 0
      })
    }

    return {
      setTransition,
      autoPositionTab,
      adjustPositionAfterClose
    }
  }

  // 事件处理逻辑
  const useEventHandlers = () => {
    const { setTransition, adjustPositionAfterClose } = useScrolling()

    const handleWheelScroll = (event: WheelEvent) => {
      if (!scrollRef.value || !tabsRef.value) return

      event.preventDefault()

      if (tabsRef.value.offsetWidth <= scrollRef.value.offsetWidth) return

      const xMax = 0
      const xMin = scrollRef.value.offsetWidth - tabsRef.value.offsetWidth
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY

      scrollState.value.translateX = Math.min(
        Math.max(scrollState.value.translateX - delta, xMin),
        xMax
      )
    }

    const handleTouchStart = (event: TouchEvent) => {
      touchState.value.startX = event.touches[0].clientX
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (!scrollRef.value || !tabsRef.value) return

      touchState.value.currentX = event.touches[0].clientX
      const deltaX = touchState.value.currentX - touchState.value.startX
      const xMin = scrollRef.value.offsetWidth - tabsRef.value.offsetWidth

      scrollState.value.translateX = Math.min(
        Math.max(scrollState.value.translateX + deltaX, xMin),
        0
      )
      touchState.value.startX = touchState.value.currentX
    }

    const handleTouchEnd = () => {
      setTransition()
    }

    const setupEventListeners = () => {
      if (tabsRef.value) {
        tabsRef.value.addEventListener('wheel', handleWheelScroll, { passive: false })
        tabsRef.value.addEventListener('touchstart', handleTouchStart, { passive: true })
        tabsRef.value.addEventListener('touchmove', handleTouchMove, { passive: true })
        tabsRef.value.addEventListener('touchend', handleTouchEnd, { passive: true })
      }
    }

    const cleanupEventListeners = () => {
      if (tabsRef.value) {
        tabsRef.value.removeEventListener('wheel', handleWheelScroll)
        tabsRef.value.removeEventListener('touchstart', handleTouchStart)
        tabsRef.value.removeEventListener('touchmove', handleTouchMove)
        tabsRef.value.removeEventListener('touchend', handleTouchEnd)
      }
    }

    return {
      setupEventListeners,
      cleanupEventListeners,
      adjustPositionAfterClose
    }
  }

  // 标签页操作逻辑
  const useTabOperations = (adjustPositionAfterClose: () => void) => {
    const clickTab = (item: WorkTab) => {
      router.push({
        path: item.path,
        query: item.query as LocationQueryRaw
      })
    }

    const closeWorktab = (type: TabCloseType, tabPath: string) => {
      const path = typeof tabPath === 'string' ? tabPath : route.path

      const closeActions = {
        current: () => store.removeTab(path),
        left: () => store.removeLeft(path),
        right: () => store.removeRight(path),
        other: () => store.removeOthers(path),
        all: () => store.removeAll()
      }

      closeActions[type]?.()

      setTimeout(() => {
        adjustPositionAfterClose()
      }, 100)
    }

    const showMenu = (e: MouseEvent, path?: string) => {
      clickedPath.value = path || ''
      menuRef.value?.show(e)
      e.preventDefault()
      e.stopPropagation()
    }

    const handleSelect = (item: MenuItemType) => {
      const { key } = item

      if (key === 'refresh') {
        useCommon().refresh()
        return
      }

      if (key === 'fixed') {
        useWorktabStore().toggleFixedTab(clickedPath.value)
        return
      }

      const activeIndex = list.value.findIndex((tab) => tab.path === activeTab.value)
      const clickedIndex = list.value.findIndex((tab) => tab.path === clickedPath.value)

      const navigationRules = {
        left: activeIndex < clickedIndex,
        right: activeIndex > clickedIndex,
        other: true
      } as const

      const shouldNavigate = navigationRules[key as keyof typeof navigationRules]

      if (shouldNavigate) {
        router.push(clickedPath.value)
      }

      closeWorktab(key as TabCloseType, clickedPath.value)
    }

    return {
      clickTab,
      closeWorktab,
      showMenu,
      handleSelect
    }
  }

  // 组合所有逻辑
  const { menuItems } = useContextMenu()
  const { setTransition, autoPositionTab } = useScrolling()
  const { setupEventListeners, cleanupEventListeners, adjustPositionAfterClose } =
    useEventHandlers()
  const { clickTab, closeWorktab, showMenu, handleSelect } =
    useTabOperations(adjustPositionAfterClose)

  // 生命周期
  onMounted(() => {
    setupEventListeners()
    autoPositionTab()
  })

  onUnmounted(() => {
    cleanupEventListeners()
  })

  // 监听器
  watch(
    () => currentRoute.value,
    () => {
      setTransition()
      autoPositionTab()
    }
  )

  watch(
    () => userStore.language,
    () => {
      scrollState.value.translateX = 0
      nextTick(() => {
        autoPositionTab()
      })
    }
  )
</script>

<style scoped lang="scss">
  // ==================== 标签页容器 ====================
  // box-border flex-b w-full px-5 mb-3 select-none max-sm:px-[15px]
  // 保留全局工具类 flex-b
  .work-tab {
    box-sizing: border-box;
    width: 100%; // w-full
    padding-left: 1.25rem; // px-5
    padding-right: 1.25rem;
    margin-bottom: 0.75rem; // mb-3
    user-select: none; // select-none

    // tab-card: py-1 border-b border-[var(--art-card-border)]
    &--card {
      padding-top: 0.25rem; // py-1
      padding-bottom: 0.25rem;
      border-bottom: 1px solid var(--art-card-border);
    }

    // tab-google: pt-1 pb-0 border-b border-[var(--art-card-border)]
    &--google {
      padding-top: 0.25rem; // pt-1
      padding-bottom: 0; // pb-0
      border-bottom: 1px solid var(--art-card-border);
    }
  }

  // 滚动容器：w-full overflow-hidden
  .work-tab__scroll {
    width: 100%;
    overflow: hidden;
  }

  // 标签列表：float-left whitespace-nowrap !bg-transparent flex
  .work-tab__list {
    display: flex;
    float: left;
    white-space: nowrap;
    background: transparent !important;

    // tab-google: pl-1
    &--google {
      padding-left: 0.25rem; // pl-1
    }
  }

  // ==================== 标签项 ====================
  // art-card-xs inline-flex flex-cc h-8 mr-1.5 text-xs c-p hover:text-theme group
  // 保留全局工具类 flex-cc c-p art-card-xs
  .work-tab__item {
    display: inline-flex;
    height: 2rem; // h-8
    margin-right: 0.375rem; // mr-1.5
    font-size: 0.75rem; // text-xs
    line-height: 1rem;

    // hover:text-theme + group-hover:text-theme（作用于 icon）
    &:hover {
      color: var(--theme-color);

      .work-tab__item-icon {
        color: var(--theme-color);
      }
    }

    // 激活状态：!text-theme
    &--active {
      color: var(--theme-color) !important;

      .work-tab__item-icon {
        color: var(--theme-color);
      }
    }

    // 非激活状态：text-g-600 dark:text-g-800
    &--inactive {
      color: var(--art-gray-600);

      .work-tab__item-icon {
        color: var(--art-gray-600);
      }

      // 暗黑模式
      .dark & {
        color: var(--art-gray-800);

        .work-tab__item-icon {
          color: var(--art-gray-800);
        }
      }
    }
  }

  // 标签图标：text-base mr-1
  .work-tab__item-icon {
    margin-right: 0.25rem; // mr-1
    font-size: 1rem; // text-base
    line-height: 1.5rem;
  }

  // 关闭按钮：inline-flex flex-cc relative ml-0.5 p-1 rounded-full hover:bg-g-200
  // 保留全局工具类 flex-cc tad-200
  .work-tab__close {
    position: relative;
    display: inline-flex;
    margin-left: 0.125rem; // ml-0.5
    padding: 0.25rem; // p-1
    border-radius: 9999px; // rounded-full

    &:hover {
      background: var(--art-gray-200); // hover:bg-g-200
    }
  }

  // 关闭图标：text-[10px] text-g-600
  .work-tab__close-icon {
    font-size: 10px; // text-[10px]
    color: var(--art-gray-600);
  }

  // ==================== 装饰线（google-tab 内） ====================
  // absolute top-0 bottom-0 left-0 w-px h-4 my-auto bg-g-400 transition-opacity duration-150
  .work-tab .line {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 1px; // w-px
    height: 1rem; // h-4
    margin-top: auto; // my-auto
    margin-bottom: auto;
    background: var(--art-gray-400); // bg-g-400
    transition-property: opacity; // transition-opacity
    transition-duration: 150ms; // duration-150
  }

  // ==================== 右侧操作区 ====================
  // flex
  .work-tab__actions {
    display: flex;
  }

  // 菜单按钮：flex-cc art-card-xs relative top-0 size-8 leading-8 text-center hover:!bg-hover-color
  // 保留全局工具类 flex-cc c-p tad-200 art-card-xs
  .work-tab__menu-btn {
    position: relative;
    top: 0;
    width: 2rem; // size-8
    height: 2rem; // size-8
    line-height: 2rem; // leading-8
    text-align: center;

    &:hover {
      background: var(--art-hover-color) !important; // hover:!bg-hover-color
    }
  }

  // 菜单图标：text-2xl text-g-700
  .work-tab__menu-icon {
    font-size: 1.5rem; // text-2xl
    line-height: 2rem;
    color: var(--art-gray-700); // text-g-700
  }

  // ==================== Google 风格标签 ====================
  // google-tab relative !h-8 !leading-8 !border-none
  .google-tab {
    position: relative;
    height: 2rem !important; // !h-8
    line-height: 2rem !important; // !leading-8
    border: none !important; // !border-none

    // 激活状态
    &.activ-tab {
      color: var(--theme-color) !important;
      background-color: var(--el-color-primary-light-9) !important;
      border-bottom: 0 !important;
      border-bottom-right-radius: 0 !important;
      border-bottom-left-radius: 0 !important;

      &::before,
      &::after {
        position: absolute;
        bottom: 0;
        width: 20px;
        height: 20px;
        content: '';
        border-radius: 50%;
        box-shadow: 0 0 0 30px var(--el-color-primary-light-9);
      }

      &::before {
        left: -20px;
        clip-path: inset(50% -10px 0 50%);
      }

      &::after {
        right: -20px;
        clip-path: inset(50% 50% 0 -10px);
      }
    }

    // 非激活 hover 状态
    &:not(.activ-tab):hover {
      box-sizing: border-box;
      color: var(--art-gray-600) !important;
      background-color: var(--art-gray-200) !important;
      border-bottom: 1px solid var(--default-box-color) !important;
      border-radius: calc(var(--custom-radius) / 2.5 + 4px) !important;
    }

    // 装饰线显隐
    &:hover .line,
    &.activ-tab .line,
    &:first-child .line {
      opacity: 0;
    }

    &:hover + .google-tab .line,
    &.activ-tab + .google-tab .line {
      opacity: 0;
    }

    // 伪元素基础样式
    &::before,
    &::after {
      position: absolute;
      bottom: 0;
      width: 20px;
      height: 20px;
      content: '';
      border-radius: 50%;
      box-shadow: 0 0 0 30px transparent;
    }

    &::before {
      left: -20px;
      clip-path: inset(50% -10px 0 50%);
    }

    &::after {
      right: -20px;
      clip-path: inset(50% 50% 0 -10px);
    }

    // 图标 hover
    i:hover {
      color: var(--art-gray-700);
      background: var(--art-gray-300);
    }
  }

  // 暗黑模式下 google-tab 激活状态
  .dark .google-tab.activ-tab {
    color: var(--art-gray-800) !important;
    background-color: var(--art-hover-color) !important;

    &::before,
    &::after {
      box-shadow: 0 0 0 30px var(--art-hover-color);
    }
  }

  // 暗黑模式下 google-tab 非激活 hover 状态
  .dark .google-tab:not(.activ-tab):hover {
    background-color: var(--art-hover-color) !important;
  }

  // ==================== 响应式 ====================
  @media only screen and (width <= 768px) {
    .work-tab {
      padding-right: 0.625rem;
      padding-left: 0.625rem;
    }
  }

  @media only screen and (width <= 640px) {
    .work-tab {
      padding-right: 0.9375rem;
      padding-left: 0.9375rem;
    }
  }
</style>
