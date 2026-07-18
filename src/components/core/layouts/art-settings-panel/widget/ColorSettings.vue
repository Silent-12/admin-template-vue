<template>
  <div>
    <SectionTitle :title="$t('setting.color.title')" class="color-section-title" />
    <div class="color-list-wrapper">
      <div class="color-list">
        <div
          v-for="color in configOptions.mainColors"
          :key="color"
          class="color-item"
          :style="{ background: `${color} !important` }"
          @click="colorHandlers.selectColor(color)"
        >
          <ArtSvgIcon
            icon="ri:check-fill"
            class="color-check-icon"
            v-show="color === systemThemeColor"
          />
        </div>
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
  const { systemThemeColor } = storeToRefs(settingStore)
  const { configOptions } = useSettingsConfig()
  const { colorHandlers } = useSettingsHandlers()
</script>

<style scoped lang="scss">
// 小节标题间距（覆盖 SectionTitle 默认 mt-7.5）
.color-section-title {
  margin-top: 2.5rem; // mt-10
}

// 颜色列表外层（负右外边距，溢出容器）
.color-list-wrapper {
  margin-right: -1rem; // -mr-4
}

// 颜色列表（自动换行）
.color-list {
  display: flex; // flex
  flex-wrap: wrap; // flex-wrap
}

// 单个颜色块
.color-item {
  display: flex; // flex
  align-items: center; // items-center
  justify-content: center; // justify-center
  width: 23px; // size-[23px]
  height: 23px; // size-[23px]
  margin-right: 1rem; // mr-4
  margin-bottom: 0.625rem; // mb-2.5
  cursor: pointer; // cursor-pointer
  border-radius: 9999px; // rounded-full
  transition-property: all; // transition-all
  transition-duration: 200ms; // duration-200

  &:hover {
    opacity: 0.85; // hover:opacity-85
  }
}

// 选中态对勾图标
.color-check-icon {
  font-size: 1rem; // text-base
  line-height: 1.5rem; // text-base
  color: #fff !important; // !text-white
}
</style>
