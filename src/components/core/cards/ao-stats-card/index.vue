<!-- 统计卡片 -->
<template>
  <div class="ao-card stats-card flex-c" :class="boxStyle">
    <div v-if="icon" class="icon-wrapper flex-cc" :class="iconStyle">
      <AoSvgIcon :icon="icon"></AoSvgIcon>
    </div>
    <div class="text-container">
      <p class="card-title" :style="{ color: textColor }" v-if="title">
        {{ title }}
      </p>
      <AoCountTo
        class="card-count"
        v-if="count !== undefined"
        :target="count"
        :duration="2000"
        :decimals="decimals"
        :separator="separator"
      />
      <p class="card-description" :style="{ color: textColor }" v-if="description">{{
        description
      }}</p>
    </div>
    <div v-if="showArrow">
      <AoSvgIcon icon="ri:arrow-right-s-line" class="arrow-icon" />
    </div>
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'AoStatsCard' })

  interface StatsCardProps {
    /** 盒子样式 */
    boxStyle?: string
    /** 图标 */
    icon?: string
    /** 图标样式 */
    iconStyle?: string
    /** 标题 */
    title?: string
    /** 数值 */
    count?: number
    /** 小数位 */
    decimals?: number
    /** 分隔符 */
    separator?: string
    /** 描述 */
    description: string
    /** 文本颜色 */
    textColor?: string
    /** 是否显示箭头 */
    showArrow?: boolean
  }

  withDefaults(defineProps<StatsCardProps>(), {
    iconSize: 30,
    iconBgRadius: 50,
    decimals: 0,
    separator: ','
  })
</script>

<style scoped lang="scss">
  // 统计卡片容器（flex-c 提供了 display:flex; align-items:center）
  .stats-card {
    height: 8rem; // h-32 (32 * 0.25rem)
    padding-right: 1.25rem; // px-5
    padding-left: 1.25rem; // px-5
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); // 默认 ease
    transition-duration: 200ms; // duration-200
    transition-property: transform; // transition-transform

    // 鼠标悬停时上移
    &:hover {
      transform: translateY(-0.125rem); // hover:-translate-y-0.5 (-0.5 * 0.25rem)
    }
  }

  // 图标容器（flex-cc 提供了 display:flex; align-items:center; justify-content:center）
  .icon-wrapper {
    width: 2.75rem; // size-11 (11 * 0.25rem)
    height: 2.75rem; // size-11
    margin-right: 1rem; // mr-4
    font-size: 1.25rem; // text-xl
    line-height: 1.75rem; // text-xl
    color: #fff; // text-white
    border-radius: 0.5rem; // rounded-lg
  }

  // 文本容器
  .text-container {
    flex: 1 1 0%; // flex-1
  }

  // 标题
  .card-title {
    margin: 0; // m-0
    font-size: 1.125rem; // text-lg
    font-weight: 500; // font-medium
    line-height: 1.75rem; // text-lg
  }

  // 数值
  .card-count {
    margin: 0; // m-0
    font-size: 1.5rem; // text-2xl
    font-weight: 500; // font-medium
    line-height: 2rem; // text-2xl
  }

  // 描述
  .card-description {
    margin-top: 0.25rem; // mt-1
    font-size: 0.875rem; // text-sm
    line-height: 1.25rem; // text-sm
    color: var(--ao-gray-500); // text-g-500
    opacity: 0.9; // opacity-90
  }

  // 箭头图标
  .arrow-icon {
    font-size: 1.25rem; // text-xl
    line-height: 1.75rem; // text-xl
    color: var(--ao-gray-500); // text-g-500
  }
</style>
