<!-- 卡片横幅组件 -->
<template>
  <div class="art-card-sm flex-c card-banner" :style="{ height: height }">
    <div class="flex-c card-banner-inner">
      <div class="banner-image-wrap">
        <img :src="image" :alt="title" class="banner-image" />
      </div>
      <div class="banner-text">
        <p class="banner-title">{{ title }}</p>
        <p class="banner-desc">{{ description }}</p>
      </div>
      <div class="flex-c banner-actions">
        <div
          v-if="cancelButton?.show"
          class="banner-btn banner-btn-cancel c-p"
          :style="{
            backgroundColor: cancelButton?.color,
            color: cancelButton?.textColor
          }"
          @click="handleCancel"
        >
          {{ cancelButton?.text }}
        </div>
        <div
          v-if="button?.show"
          class="banner-btn banner-btn-primary c-p"
          :style="{ backgroundColor: button?.color, color: button?.textColor }"
          @click="handleClick"
        >
          {{ button?.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  // 导入默认图标
  import defaultIcon from '@imgs/3d/icon1.webp'

  defineOptions({ name: 'ArtCardBanner' })

  // 定义卡片横幅组件的属性接口
  interface CardBannerProps {
    /** 高度 */
    height?: string
    /** 图片路径 */
    image?: string
    /** 标题文本 */
    title: string
    /** 描述文本 */
    description: string
    /** 主按钮配置 */
    button?: {
      /** 是否显示 */
      show?: boolean
      /** 按钮文本 */
      text?: string
      /** 背景颜色 */
      color?: string
      /** 文字颜色 */
      textColor?: string
    }
    /** 取消按钮配置 */
    cancelButton?: {
      /** 是否显示 */
      show?: boolean
      /** 按钮文本 */
      text?: string
      /** 背景颜色 */
      color?: string
      /** 文字颜色 */
      textColor?: string
    }
  }

  // 定义组件属性默认值
  withDefaults(defineProps<CardBannerProps>(), {
    height: '24rem',
    image: defaultIcon,
    title: '',
    description: '',
    // 主按钮默认配置
    button: () => ({
      show: true,
      text: '查看详情',
      color: 'var(--theme-color)',
      textColor: '#fff'
    }),
    // 取消按钮默认配置
    cancelButton: () => ({
      show: false,
      text: '取消',
      color: '#f5f5f5',
      textColor: '#666'
    })
  })

  // 定义组件事件
  const emit = defineEmits<{
    (e: 'click'): void // 主按钮点击事件
    (e: 'cancel'): void // 取消按钮点击事件
  }>()

  // 主按钮点击处理函数
  const handleClick = () => {
    emit('click')
  }

  // 取消按钮点击处理函数
  const handleCancel = () => {
    emit('cancel')
  }
</script>

<style scoped lang="scss">
  // 卡片横幅容器
  .card-banner {
    flex-direction: column; // flex-col
    padding-bottom: 1.5rem; // pb-6
  }

  // 内部布局容器
  .card-banner-inner {
    flex-direction: column; // flex-col
    gap: 1rem; // gap-4
    text-align: center; // text-center
  }

  // 图片容器
  .banner-image-wrap {
    width: 11.25rem; // w-45
  }

  // 图片元素
  .banner-image {
    width: 100%; // w-full
    height: 100%; // h-full
    object-fit: contain; // object-contain
  }

  // 文本区域
  .banner-text {
    box-sizing: border-box; // box-border
    padding-left: 1rem; // px-4
    padding-right: 1rem; // px-4
  }

  // 标题文本
  .banner-title {
    margin-bottom: 0.5rem; // mb-2
    font-size: 1.125rem; // text-lg
    line-height: 1.75rem; // text-lg
    font-weight: 600; // font-semibold
    color: var(--art-gray-800); // text-g-800
  }

  // 描述文本
  .banner-desc {
    margin: 0; // m-0
    font-size: 0.875rem; // text-sm
    line-height: 1.25rem; // text-sm
    color: var(--art-gray-600); // text-g-600
  }

  // 操作按钮容器
  .banner-actions {
    gap: 0.75rem; // gap-3
  }

  // 按钮通用样式
  .banner-btn {
    display: inline-block; // inline-block
    height: 2.25rem; // h-9
    padding-left: 0.75rem; // px-3
    padding-right: 0.75rem; // px-3
    font-size: 0.875rem; // text-sm/9
    line-height: 2.25rem; // text-sm/9
    user-select: none; // select-none
    border-radius: 0.375rem; // rounded-md
  }

  // 取消按钮（带边框）
  .banner-btn-cancel {
    border-width: 1px; // border
    border-color: var(--art-gray-300); // border-g-300
  }
</style>
