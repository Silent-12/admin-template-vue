<template>
  <div>
    <SectionTitle :title="$t('setting.box.title')" class="box-section-title" />
    <div class="box-style-container flex-cb">
      <div
        v-for="option in boxStyleOptions"
        :key="option.value"
        class="box-style-option c-p"
        :class="{ 'is-active': isActive(option.type) }"
        @click="boxStyleHandlers.setBoxMode(option.type)"
      >
        {{ option.label }}
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
  const { boxBorderMode } = storeToRefs(settingStore)
  const { boxStyleOptions } = useSettingsConfig()
  const { boxStyleHandlers } = useSettingsHandlers()

  // 判断当前选项是否激活
  const isActive = (type: 'border-mode' | 'shadow-mode') => {
    return type === 'border-mode' ? boxBorderMode.value : !boxBorderMode.value
  }
</script>

<style scoped lang="scss">
  // 小节标题间距（覆盖 SectionTitle 默认 mt-7.5）
  .box-section-title {
    margin-top: 2.5rem; // mt-10
  }

  // 盒子样式切换容器
  .box-style-container {
    box-sizing: border-box; // box-border
    padding: 0.25rem; // p-1
    margin-top: 1.25rem; // mt-5
    background: var(--ao-gray-200); // bg-g-200
    border-radius: 0.5rem; // rounded-lg
  }

  // 单个盒子样式选项
  .box-style-option {
    width: calc(50% - 3px); // w-[calc(50%-3px)]
    height: 2.125rem; // h-8.5
    font-size: 0.875rem; // text-sm
    line-height: 2.125rem; // leading-8.5（与高度一致，垂直居中）
    text-align: center; // text-center
    user-select: none; // select-none
    border-radius: 0.375rem; // rounded-md
    transition-duration: 200ms; // duration-200
    transition-property: all; // transition-all

    // 未激活态：悬停高亮
    &:not(.is-active) {
      &:hover {
        color: var(--ao-gray-800); // hover:text-g-800
        background: rgb(0 0 0 / 4%); // hover:bg-black/[0.04]
      }
    }

    // 激活态
    &.is-active {
      color: var(--ao-gray-800); // text-g-800
      background: var(--default-box-color); // bg-[var(--default-box-color)]
    }
  }

  // 暗黑模式样式覆盖
  .dark {
    .box-style-option {
      &.is-active {
        color: #fff !important; // dark:!text-white
        background: var(--ao-gray-300); // dark:bg-g-300
      }

      &:not(.is-active) {
        &:hover {
          background: rgb(0 0 0 / 20%); // dark:hover:bg-black/20
        }
      }
    }
  }
</style>
