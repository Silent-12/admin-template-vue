<!-- 授权页右上角组件 -->
<template>
  <div class="auth-top-bar flex-cb flex-c">
    <div class="logo-section flex-cc">
      <ArtLogo class="icon" size="46" />
      <h1 class="logo-title">{{ AppConfig.systemInfo.name }}</h1>
    </div>

    <div class="actions flex-cc">
      <div class="color-picker-expandable flex-c">
        <div class="color-dots flex-c">
          <div
            v-for="(color, index) in mainColors"
            :key="color"
            class="color-dot c-p flex-cc"
            :class="{ active: color === systemThemeColor }"
            :style="{ background: color, '--index': index }"
            @click="changeThemeColor(color)"
          >
            <ArtSvgIcon v-if="color === systemThemeColor" icon="ri:check-fill" class="check-icon" />
          </div>
        </div>
        <div class="btn palette-btn c-p flex-cc tad-300">
          <ArtSvgIcon icon="ri:palette-line" class="palette-icon" />
        </div>
      </div>
      <ElDropdown
        v-if="shouldShowLanguage"
        @command="changeLanguage"
        popper-class="langDropDownStyle"
      >
        <div class="btn language-btn c-p flex-cc tad-300">
          <ArtSvgIcon icon="ri:translate-2" class="translate-icon" />
        </div>
        <template #dropdown>
          <ElDropdownMenu>
            <div v-for="lang in languageOptions" :key="lang.value" class="lang-btn-item">
              <ElDropdownItem
                :command="lang.value"
                :class="{ 'is-selected': locale === lang.value }"
              >
                <span class="menu-txt">{{ lang.label }}</span>
                <ArtSvgIcon
                  icon="ri:check-fill"
                  class="lang-check-icon"
                  v-if="locale === lang.value"
                />
              </ElDropdownItem>
            </div>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
      <div
        v-if="shouldShowThemeToggle"
        class="btn theme-btn c-p flex-cc tad-300"
        @click="themeAnimation"
      >
        <ArtSvgIcon :icon="isDark ? 'ri:sun-fill' : 'ri:moon-line'" class="theme-icon" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { useSettingStore } from '@/store/modules/setting'
  import { useUserStore } from '@/store/modules/user'
  import { useHeaderBar } from '@/hooks/core/useHeaderBar'
  import { themeAnimation } from '@/utils/ui/animation'
  import { languageOptions } from '@/locales'
  import { LanguageEnum } from '@/enums/appEnum'
  import AppConfig from '@/config'

  defineOptions({ name: 'AuthTopBar' })

  const settingStore = useSettingStore()
  const userStore = useUserStore()
  const { isDark, systemThemeColor } = storeToRefs(settingStore)
  const { shouldShowThemeToggle, shouldShowLanguage } = useHeaderBar()
  const { locale } = useI18n()

  const mainColors = AppConfig.systemMainColor
  const color = systemThemeColor // css v-bind 使用

  const changeLanguage = (lang: LanguageEnum) => {
    if (locale.value === lang) return
    locale.value = lang
    userStore.setLanguage(lang)
  }

  const changeThemeColor = (color: string) => {
    if (systemThemeColor.value === color) return
    settingStore.setElementTheme(color)
    settingStore.reload()
  }
</script>

<style scoped lang="scss">
  // 顶部条根容器（absolute w-full top-4.5 z-10 !justify-end max-[1180px]:!justify-between）
  .auth-top-bar {
    position: absolute; // absolute
    width: 100%; // w-full
    top: 1.125rem; // top-4.5
    z-index: 10; // z-10
    justify-content: flex-end !important; // !justify-end

    @media (max-width: 1180px) {
      // max-[1180px]:!justify-between
      justify-content: space-between !important;
    }
  }

  // Logo 区域（!hidden max-[1180px]:!flex ml-2 max-sm:ml-6）
  .logo-section {
    display: none !important; // !hidden
    margin-left: 0.5rem; // ml-2

    @media (max-width: 1180px) {
      // max-[1180px]:!flex
      display: flex !important;
    }

    @media (max-width: 39.99rem) {
      // max-sm:ml-6
      margin-left: 1.5rem;
    }
  }

  // Logo 标题（text-xl ont-mediumf ml-2，保留原 ont-mediumf typo 不修复）
  .logo-title {
    font-size: 1.25rem; // text-xl
    line-height: 1.75rem; // text-xl
    margin-left: 0.5rem; // ml-2
  }

  // 操作区容器（gap-1.5 mr-2 max-sm:mr-5）
  .actions {
    gap: 0.375rem; // gap-1.5
    margin-right: 0.5rem; // mr-2

    @media (max-width: 39.99rem) {
      // max-sm:mr-5
      margin-right: 1.25rem;
    }
  }

  // 颜色选择器外层（relative max-sm:!hidden）
  .color-picker-expandable {
    position: relative; // relative

    @media (max-width: 39.99rem) {
      // max-sm:!hidden
      display: none !important;
    }
  }

  // 颜色点容器（absolute right-0 rounded-full gap-2 rounded-5 px-2.5 py-2 pr-9 pl-2.5 opacity-0）
  .color-dots {
    position: absolute; // absolute
    right: 0; // right-0
    top: 0;
    border-radius: 9999px; // rounded-full
    gap: 0.5rem; // gap-2
    padding-left: 0.625rem; // pl-2.5
    padding-right: 2.25rem; // pr-9
    padding-top: 0.5rem; // py-2
    padding-bottom: 0.5rem; // py-2
    opacity: 0; // opacity-0
    pointer-events: none;
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 12px var(--art-gray-300);
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
    transform: translateX(10px);
  }

  // 颜色点（relative size-5 rounded-full opacity-0）
  .color-dot {
    position: relative; // relative
    width: 1.25rem; // size-5
    height: 1.25rem; // size-5
    border-radius: 9999px; // rounded-full
    opacity: 0; // opacity-0
    box-shadow: 0 2px 4px rgb(0 0 0 / 15%);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transition-delay: calc(var(--index) * 0.05s);
    transform: translateX(20px) scale(0.8);
  }

  .color-dot:hover {
    box-shadow: 0 4px 8px rgb(0 0 0 / 20%);
    transform: translateX(0) scale(1.1);
  }

  .color-picker-expandable:hover .color-dots {
    pointer-events: auto;
    opacity: 1;
    transform: translateX(0);
  }

  .color-picker-expandable:hover .color-dot {
    opacity: 1;
    transform: translateX(0) scale(1);
  }

  .dark .color-dots {
    background-color: var(--art-gray-200);
    box-shadow: none;
  }

  // 选中颜色勾选图标（text-white）
  .check-icon {
    color: #fff; // text-white
  }

  // 按钮（palette-btn relative z-[2] h-8 w-8）
  .palette-btn {
    position: relative; // relative
    z-index: 2; // z-[2]
    width: 2rem; // h-8 w-8
    height: 2rem; // h-8 w-8
  }

  // 语言按钮（h-8 w-8）
  .language-btn {
    width: 2rem; // h-8 w-8
    height: 2rem; // h-8 w-8
  }

  // 主题按钮（h-8 w-8）
  .theme-btn {
    width: 2rem; // h-8 w-8
    height: 2rem; // h-8 w-8
  }

  // 调色板图标（text-xl text-g-800 transition-colors duration-300）
  .palette-icon {
    font-size: 1.25rem; // text-xl
    line-height: 1.75rem; // text-xl
    color: var(--art-gray-800); // text-g-800
    transition-property:
      color, background-color, border-color, outline-color, text-decoration-color, fill, stroke; // transition-colors
    transition-duration: 300ms; // duration-300
  }

  // 翻译图标（text-[19px] text-g-800 transition-colors duration-300）
  .translate-icon {
    font-size: 19px; // text-[19px]
    color: var(--art-gray-800); // text-g-800
    transition-property:
      color, background-color, border-color, outline-color, text-decoration-color, fill, stroke; // transition-colors
    transition-duration: 300ms; // duration-300
  }

  // 语言勾选图标（text-base）
  .lang-check-icon {
    font-size: 1rem; // text-base
    line-height: 1.5rem; // text-base
  }

  // 主题切换图标（text-xl text-g-800 transition-colors duration-300）
  .theme-icon {
    font-size: 1.25rem; // text-xl
    line-height: 1.75rem; // text-xl
    color: var(--art-gray-800); // text-g-800
    transition-property:
      color, background-color, border-color, outline-color, text-decoration-color, fill, stroke; // transition-colors
    transition-duration: 300ms; // duration-300
  }

  // 调色板按钮 hover 时图标颜色（v-bind 主题色）
  .color-picker-expandable:hover .palette-btn :deep(.art-svg-icon) {
    color: v-bind(color);
  }
</style>
