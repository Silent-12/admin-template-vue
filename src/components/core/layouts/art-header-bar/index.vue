<!-- 顶部栏 -->
<template>
  <div
    class="header-bar"
    :class="{
      'header-bar--card': tabStyle === 'tab-card' || tabStyle === 'tab-google'
    }"
  >
    <div
      class="header-bar__inner flex-b"
      :class="{
        'header-bar__inner--bordered': tabStyle === 'tab-card' || tabStyle === 'tab-google'
      }"
    >
      <div class="header-bar__left flex-c">
        <!-- 系统信息  -->
        <div class="header-bar__system flex-c c-p" @click="toHome" v-if="isTopMenu">
          <ArtLogo class="header-bar__logo" />
          <p v-if="width >= 1400" class="header-bar__system-name">{{ AppConfig.systemInfo.name }}</p>
        </div>

        <ArtLogo
          class="header-bar__logo-hidden"
          @click="toHome"
        />

        <!-- 菜单按钮 -->
        <ArtIconButton
          v-if="isLeftMenu && shouldShowMenuButton"
          icon="ri:menu-2-fill"
          class="header-bar__menu-btn"
          @click="visibleMenu"
        />

        <!-- 刷新按钮 -->
        <ArtIconButton
          v-if="shouldShowRefreshButton"
          icon="ri:refresh-line"
          class="refresh-btn header-bar__refresh-btn"
          :style="{ marginLeft: !isLeftMenu ? '10px' : '0' }"
          @click="reload"
        />

        <!-- 快速入口 -->
        <ArtFastEnter v-if="shouldShowFastEnter && width >= headerBarFastEnterMinWidth">
          <ArtIconButton icon="ri:function-line" class="header-bar__fast-enter-btn" />
        </ArtFastEnter>

        <!-- 面包屑 -->
        <ArtBreadcrumb
          v-if="(shouldShowBreadcrumb && isLeftMenu) || (shouldShowBreadcrumb && isDualMenu)"
        />

        <!-- 顶部菜单 -->
        <ArtHorizontalMenu v-if="isTopMenu" :list="menuList" />

        <!-- 混合菜单-顶部 -->
        <ArtMixedMenu v-if="isTopLeftMenu" :list="menuList" />
      </div>

      <div class="header-bar__right flex-c">
        <!-- 搜索 -->
        <div
          v-if="shouldShowGlobalSearch"
          class="search-box flex-cb c-p rounded-custom-sm"
          @click="openSearchDialog"
        >
          <div class="search-box__left flex-c">
            <ArtSvgIcon icon="ri:search-line" class="search-box__icon" />
            <span class="search-box__text">{{ $t('topBar.search.title') }}</span>
          </div>
          <div class="search-box__shortcut flex-c">
            <ArtSvgIcon v-if="isWindows" icon="vaadin:ctrl-a" class="search-box__shortcut-icon" />
            <ArtSvgIcon v-else icon="ri:command-fill" class="search-box__shortcut-icon-mac" />
            <span class="search-box__shortcut-key">k</span>
          </div>
        </div>

        <!-- 全屏按钮 -->
        <ArtIconButton
          v-if="shouldShowFullscreen"
          :icon="isFullscreen ? 'ri:fullscreen-exit-line' : 'ri:fullscreen-fill'"
          :class="[!isFullscreen ? 'full-screen-btn' : 'exit-full-screen-btn', 'header-bar__fullscreen-btn']"
          @click="toggleFullScreen"
        />

        <!-- 国际化按钮 -->
        <ElDropdown
          @command="changeLanguage"
          popper-class="langDropDownStyle"
          v-if="shouldShowLanguage"
        >
          <ArtIconButton icon="ri:translate-2" class="language-btn header-bar__language-btn" />
          <template #dropdown>
            <ElDropdownMenu>
              <div v-for="item in languageOptions" :key="item.value" class="lang-btn-item">
                <ElDropdownItem
                  :command="item.value"
                  :class="{ 'is-selected': locale === item.value }"
                >
                  <span class="menu-txt">{{ item.label }}</span>
                  <ArtSvgIcon icon="ri:check-fill" v-if="locale === item.value" />
                </ElDropdownItem>
              </div>
            </ElDropdownMenu>
          </template>
        </ElDropdown>

        <!-- 通知按钮 -->
        <ArtIconButton
          v-if="shouldShowNotification"
          icon="ri:notification-2-line"
          class="notice-button header-bar__notice-btn"
          @click="visibleNotice"
        >
          <div class="notice-dot"></div>
        </ArtIconButton>

        <!-- 聊天按钮 -->
        <ArtIconButton
          v-if="shouldShowChat"
          icon="ri:message-3-line"
          class="chat-button header-bar__chat-btn"
          @click="openChat"
        >
          <div class="breathing-dot chat-dot"></div>
        </ArtIconButton>

        <!-- 设置按钮 -->
        <div v-if="shouldShowSettings">
          <ElPopover :visible="showSettingGuide" placement="bottom-start" :width="190" :offset="0">
            <template #reference>
              <div class="flex-cc">
                <ArtIconButton icon="ri:settings-line" class="setting-btn" @click="openSetting" />
              </div>
            </template>
            <template #default>
              <p
                >{{ $t('topBar.guide.title')
                }}<span :style="{ color: systemThemeColor }"> {{ $t('topBar.guide.theme') }} </span
                >、 <span :style="{ color: systemThemeColor }"> {{ $t('topBar.guide.menu') }} </span
                >{{ $t('topBar.guide.description') }}
              </p>
            </template>
          </ElPopover>
        </div>

        <!-- 主题切换按钮 -->
        <ArtIconButton
          v-if="shouldShowThemeToggle"
          @click="themeAnimation"
          :icon="isDark ? 'ri:sun-fill' : 'ri:moon-line'"
        />

        <!-- 用户头像、菜单 -->
        <ArtUserMenu />
      </div>
    </div>

    <!-- 标签页 -->
    <ArtWorkTab />

    <!-- 通知 -->
    <ArtNotification v-model:value="showNotice" ref="notice" />
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { useFullscreen, useWindowSize } from '@vueuse/core'
  import { LanguageEnum, MenuTypeEnum } from '@/enums/appEnum'
  import { useSettingStore } from '@/store/modules/setting'
  import { useUserStore } from '@/store/modules/user'
  import { useMenuStore } from '@/store/modules/menu'
  import AppConfig from '@/config'
  import { languageOptions } from '@/locales'
  import { mittBus } from '@/utils/sys'
  import { themeAnimation } from '@/utils/ui/animation'
  import { useCommon } from '@/hooks/core/useCommon'
  import { useHeaderBar } from '@/hooks/core/useHeaderBar'
  import ArtUserMenu from './widget/ArtUserMenu.vue'

  defineOptions({ name: 'ArtHeaderBar' })

  // 检测操作系统类型
  const isWindows = navigator.userAgent.includes('Windows')

  const router = useRouter()
  const { locale } = useI18n()
  const { width } = useWindowSize()

  const settingStore = useSettingStore()
  const userStore = useUserStore()
  const menuStore = useMenuStore()

  // 顶部栏功能配置
  const {
    shouldShowMenuButton,
    shouldShowRefreshButton,
    shouldShowFastEnter,
    shouldShowBreadcrumb,
    shouldShowGlobalSearch,
    shouldShowFullscreen,
    shouldShowNotification,
    shouldShowChat,
    shouldShowLanguage,
    shouldShowSettings,
    shouldShowThemeToggle,
    fastEnterMinWidth: headerBarFastEnterMinWidth
  } = useHeaderBar()

  const { menuOpen, systemThemeColor, showSettingGuide, menuType, isDark, tabStyle } =
    storeToRefs(settingStore)

  const { language } = storeToRefs(userStore)
  const { menuList } = storeToRefs(menuStore)

  const showNotice = ref(false)
  const notice = ref(null)

  // 菜单类型判断
  const isLeftMenu = computed(() => menuType.value === MenuTypeEnum.LEFT)
  const isDualMenu = computed(() => menuType.value === MenuTypeEnum.DUAL_MENU)
  const isTopMenu = computed(() => menuType.value === MenuTypeEnum.TOP)
  const isTopLeftMenu = computed(() => menuType.value === MenuTypeEnum.TOP_LEFT)

  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()

  onMounted(() => {
    initLanguage()
    document.addEventListener('click', bodyCloseNotice)
  })

  onUnmounted(() => {
    document.removeEventListener('click', bodyCloseNotice)
  })

  /**
   * 切换全屏状态
   */
  const toggleFullScreen = (): void => {
    toggleFullscreen()
  }

  /**
   * 切换菜单显示/隐藏状态
   */
  const visibleMenu = (): void => {
    settingStore.setMenuOpen(!menuOpen.value)
  }

  const { homePath } = useCommon()
  const { refresh } = useCommon()

  /**
   * 跳转到首页
   */
  const toHome = (): void => {
    router.push(homePath.value)
  }

  /**
   * 刷新页面
   * @param {number} time - 延迟时间，默认为0毫秒
   */
  const reload = (time: number = 0): void => {
    setTimeout(() => {
      refresh()
    }, time)
  }

  /**
   * 初始化语言设置
   */
  const initLanguage = (): void => {
    locale.value = language.value
  }

  /**
   * 切换系统语言
   * @param {LanguageEnum} lang - 目标语言类型
   */
  const changeLanguage = (lang: LanguageEnum): void => {
    if (locale.value === lang) return
    locale.value = lang
    userStore.setLanguage(lang)
    reload(50)
  }

  /**
   * 打开设置面板
   */
  const openSetting = (): void => {
    mittBus.emit('openSetting')

    // 隐藏设置引导提示
    if (showSettingGuide.value) {
      settingStore.hideSettingGuide()
    }
  }

  /**
   * 打开全局搜索对话框
   */
  const openSearchDialog = (): void => {
    mittBus.emit('openSearchDialog')
  }

  /**
   * 点击页面其他区域关闭通知面板
   * @param {Event} e - 点击事件对象
   */
  const bodyCloseNotice = (e: any): void => {
    if (!showNotice.value) return

    const target = e.target as HTMLElement

    // 检查是否点击了通知按钮或通知面板内部
    const isNoticeButton = target.closest('.notice-button')
    const isNoticePanel = target.closest('.art-notification-panel')

    if (!isNoticeButton && !isNoticePanel) {
      showNotice.value = false
    }
  }

  /**
   * 切换通知面板显示状态
   */
  const visibleNotice = (): void => {
    showNotice.value = !showNotice.value
  }

  /**
   * 打开聊天窗口
   */
  const openChat = (): void => {
    mittBus.emit('openChat')
  }
</script>

<style lang="scss" scoped>
  /* Custom animations */
  @keyframes rotate180 {
    0% {
      transform: rotate(0);
    }

    100% {
      transform: rotate(180deg);
    }
  }

  @keyframes shake {
    0% {
      transform: rotate(0);
    }

    25% {
      transform: rotate(-5deg);
    }

    50% {
      transform: rotate(5deg);
    }

    75% {
      transform: rotate(-5deg);
    }

    100% {
      transform: rotate(0);
    }
  }

  @keyframes expand {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.1);
    }

    100% {
      transform: scale(1);
    }
  }

  @keyframes shrink {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(0.9);
    }

    100% {
      transform: scale(1);
    }
  }

  @keyframes moveUp {
    0% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-3px);
    }

    100% {
      transform: translateY(0);
    }
  }

  @keyframes breathing {
    0% {
      opacity: 0.4;
      transform: scale(0.9);
    }

    50% {
      opacity: 1;
      transform: scale(1.1);
    }

    100% {
      opacity: 0.4;
      transform: scale(0.9);
    }
  }

  /* Hover animation classes */
  .refresh-btn:hover :deep(.art-svg-icon) {
    animation: rotate180 0.5s;
  }

  .language-btn:hover :deep(.art-svg-icon) {
    animation: moveUp 0.4s;
  }

  .setting-btn:hover :deep(.art-svg-icon) {
    animation: rotate180 0.5s;
  }

  .full-screen-btn:hover :deep(.art-svg-icon) {
    animation: expand 0.6s forwards;
  }

  .exit-full-screen-btn:hover :deep(.art-svg-icon) {
    animation: shrink 0.6s forwards;
  }

  .notice-button:hover :deep(.art-svg-icon) {
    animation: shake 0.5s ease-in-out;
  }

  .chat-button:hover :deep(.art-svg-icon) {
    animation: shake 0.5s ease-in-out;
  }

  /* Breathing animation for chat dot */
  .breathing-dot {
    animation: breathing 1.5s ease-in-out infinite;
  }

  /* iPad breakpoint adjustments */
  @media screen and (width <= 768px) {
    .logo2 {
      display: block !important;
    }
  }

  @media screen and (width <= 640px) {
    .btn-box {
      width: 40px;
    }
  }

  // ==================== 顶部栏容器 ====================
  // w-full bg-[var(--default-bg-color)]
  .header-bar {
    width: 100%;
    background: var(--default-bg-color);

    // tab-card / tab-google 模式下：mb-5 max-sm:mb-3 !bg-box
    &--card {
      margin-bottom: 1.25rem;
      background: var(--default-box-color) !important;

      @media (max-width: 39.99rem) {
        margin-bottom: 0.75rem;
      }
    }
  }

  // relative box-border flex-b h-15 leading-15 select-none
  // 保留全局工具类 flex-b
  .header-bar__inner {
    position: relative;
    box-sizing: border-box;
    height: 3.75rem;
    line-height: 3.75rem;
    user-select: none;

    // tab-card / tab-google 模式下：border-b border-[var(--art-card-border)]
    &--bordered {
      border-bottom: 1px solid var(--art-card-border);
    }
  }

  // flex-c flex-1 min-w-0 leading-15
  // 保留全局工具类 flex-c
  .header-bar__left {
    flex: 1 1 0%;
    min-width: 0;
    line-height: 3.75rem;
  }

  // 系统信息区
  .header-bar__system {
    // 保留全局工具类 flex-c c-p
  }

  // 系统名称 my-0 mx-2 ml-2 text-lg
  .header-bar__system-name {
    margin-top: 0;
    margin-right: 0.5rem;
    margin-bottom: 0;
    margin-left: 0.5rem;
    font-size: 1.125rem; // text-lg
    line-height: 1.75rem; // text-lg
  }

  // 主 Logo（系统信息区） pl-4.5
  .header-bar__logo {
    padding-left: 1.125rem; // pl-4.5
  }

  // 隐藏的备用 Logo：!hidden pl-3.5 overflow-hidden align-[-0.15em] fill-current
  .header-bar__logo-hidden {
    display: none !important;
    padding-left: 0.875rem; // pl-3.5
    overflow: hidden;
    vertical-align: -0.15em;
    fill: currentColor;
  }

  // 菜单按钮：ml-3 max-sm:ml-[7px]
  .header-bar__menu-btn {
    margin-left: 0.75rem;

    @media (max-width: 39.99rem) {
      margin-left: 7px;
    }
  }

  // 刷新按钮：!ml-3 refresh-btn max-sm:!hidden
  .header-bar__refresh-btn {
    margin-left: 0.75rem !important;

    @media (max-width: 39.99rem) {
      display: none !important;
    }
  }

  // 快速入口按钮：ml-3
  .header-bar__fast-enter-btn {
    margin-left: 0.75rem;
  }

  // ==================== 右侧操作区 ====================
  // flex-c gap-2.5
  // 保留全局工具类 flex-c
  .header-bar__right {
    gap: 0.625rem; // gap-2.5
  }

  // 全屏按钮：ml-3 max-md:!hidden
  .header-bar__fullscreen-btn {
    margin-left: 0.75rem;

    @media (max-width: 47.99rem) {
      display: none !important;
    }
  }

  // 国际化按钮：text-[19px]
  .header-bar__language-btn {
    font-size: 19px;
  }

  // 通知按钮与聊天按钮：relative
  .header-bar__notice-btn,
  .header-bar__chat-btn {
    position: relative;
  }

  // 通知红点：absolute top-2 right-2 size-1.5 !bg-danger rounded-full
  .notice-dot {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 0.375rem; // size-1.5
    height: 0.375rem;
    border-radius: 9999px; // rounded-full
    background: var(--art-danger) !important;
  }

  // 聊天绿点：absolute top-2 right-2 size-1.5 !bg-success rounded-full
  .chat-dot {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 9999px;
    background: var(--art-success) !important;
  }

  // ==================== 搜索框 ====================
  // flex-cb w-40 h-9 px-2.5 c-p border border-g-400 rounded-custom-sm max-md:!hidden
  // 保留全局工具类 flex-cb c-p rounded-custom-sm
  .search-box {
    width: 10rem; // w-40
    height: 2.25rem; // h-9
    padding-left: 0.625rem; // px-2.5
    padding-right: 0.625rem;
    border: 1px solid var(--art-gray-400); // border border-g-400

    @media (max-width: 47.99rem) {
      display: none !important;
    }

    // 搜索图标 text-sm text-g-500
    &__icon {
      font-size: 0.875rem; // text-sm
      line-height: 1.25rem;
      color: var(--art-gray-500);
    }

    // 搜索文字 ml-1 text-xs font-normal text-g-500
    &__text {
      margin-left: 0.25rem; // ml-1
      font-size: 0.75rem; // text-xs
      line-height: 1rem;
      font-weight: 400; // font-normal
      color: var(--art-gray-500);
    }

    // 快捷键容器 flex-c h-5 px-1.5 text-g-500/80 border border-g-400 rounded
    &__shortcut {
      height: 1.25rem; // h-5
      padding-left: 0.375rem; // px-1.5
      padding-right: 0.375rem;
      border: 1px solid var(--art-gray-400);
      border-radius: 0.25rem; // rounded
      color: color-mix(in srgb, var(--art-gray-500) 80%, transparent); // text-g-500/80
    }

    // Windows 快捷键图标 text-sm
    &__shortcut-icon {
      font-size: 0.875rem;
      line-height: 1.25rem;
    }

    // Mac 快捷键图标 text-xs
    &__shortcut-icon-mac {
      font-size: 0.75rem;
      line-height: 1rem;
    }

    // 快捷键文字 ml-0.5 text-xs
    &__shortcut-key {
      margin-left: 0.125rem; // ml-0.5
      font-size: 0.75rem;
      line-height: 1rem;
    }
  }
</style>
