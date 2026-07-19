<template>
  <div>
    <SectionTitle :title="$t('setting.container.title')" class="container-section-title" />
    <div class="container-list">
      <div
        v-for="option in containerWidthOptions"
        :key="option.value"
        class="container-option flex-cc c-p"
        :class="{
          'is-active': containerWidth === option.value,
          'border-full-d': containerWidth !== option.value
        }"
        @click="containerHandlers.setWidth(option.value)"
      >
        <AoSvgIcon :icon="option.icon" class="container-option-icon" />
        <span class="container-option-label">{{ option.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import SectionTitle from './SectionTitle.vue'
  import { useSettingStore } from '@/store/modules/setting'
  import { useSettingsConfig } from '../composables/useSettingsConfig'
  import { useSettingsHandlers } from '../composables/useSettingsHandlers'
  import { storeToRefs } from 'pinia'

  const settingStore = useSettingStore()
  const { containerWidth } = storeToRefs(settingStore)
  const { containerWidthOptions } = useSettingsConfig()
  const { containerHandlers } = useSettingsHandlers()
</script>

<style scoped lang="scss">
  // 小节标题间距（覆盖 SectionTitle 默认 mt-7.5）
  .container-section-title {
    margin-top: 3.125rem; // mt-12.5
  }

  // 容器宽度选项列表
  .container-list {
    display: flex; // flex
  }

  // 单个容器选项
  .container-option {
    flex: 1 1 0%; // flex-1
    height: 4rem; // h-16
    margin-top: 1.25rem; // mt-5
    margin-right: 0.875rem; // mr-3.5
    margin-bottom: 0.875rem; // mb-3.5
    color: var(--ao-gray-800) !important; // !text-g-800
    cursor: pointer; // cursor-pointer
    border-style: solid; // 确保 active 态有边框样式
    border-width: 2px !important; // !border-2（覆盖 border-full-d 的 1px）
    border-radius: 0.5rem; // rounded-lg

    &:last-child {
      margin-right: 0; // last:mr-0
    }

    // 激活态：边框与图标使用主题色
    &.is-active {
      border-color: var(--theme-color); // border-theme

      // [&_i]:!text-theme（图标颜色跟随主题色）
      :deep(i) {
        color: var(--theme-color) !important;
      }
    }
  }

  // 容器选项图标
  .container-option-icon {
    margin-right: 0.5rem; // mr-2
    font-size: 1.125rem; // text-lg
    line-height: 1.75rem; // text-lg
  }

  // 容器选项文本
  .container-option-label {
    font-size: 0.875rem; // text-sm
    line-height: 1.25rem; // text-sm
  }
</style>
