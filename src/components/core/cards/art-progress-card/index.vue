<!-- 进度条卡片 -->
<template>
  <div class="art-card progress-card">
    <div
      class="card-header flex-c"
      :style="{ justifyContent: icon ? 'space-between' : 'flex-start' }"
    >
      <div v-if="icon" class="icon-wrapper flex-cc" :class="iconStyle">
        <ArtSvgIcon :icon="icon" class="icon-svg"></ArtSvgIcon>
      </div>
      <div>
        <ArtCountTo
          class="card-value"
          :target="percentage"
          :duration="2000"
          suffix="%"
          :style="{ textAlign: icon ? 'right' : 'left' }"
        />
        <p class="card-title">{{ title }}</p>
      </div>
    </div>
    <ElProgress
      :percentage="currentPercentage"
      :stroke-width="strokeWidth"
      :show-text="false"
      :color="color"
      class="progress-bar"
    />
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'ArtProgressCard' })

  interface Props {
    /** 进度百分比 */
    percentage: number
    /** 标题 */
    title: string
    /** 颜色 */
    color?: string
    /** 图标 */
    icon?: string
    /** 图标样式 */
    iconStyle?: string
    /** 进度条宽度 */
    strokeWidth?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    strokeWidth: 5,
    color: '#67C23A'
  })

  const animationDuration = 500
  const currentPercentage = ref(0)

  const animateProgress = () => {
    const startTime = Date.now()
    const startValue = currentPercentage.value
    const endValue = props.percentage

    const animate = () => {
      const currentTime = Date.now()
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / animationDuration, 1)

      currentPercentage.value = startValue + (endValue - startValue) * progress

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }

  onMounted(() => {
    animateProgress()
  })

  // 当 percentage 属性变化时重新执行动画
  watch(
    () => props.percentage,
    () => {
      animateProgress()
    }
  )
</script>

<style scoped lang="scss">
  // 进度条卡片容器
  .progress-card {
    height: 8rem; // h-32 (32 * 0.25rem)
    display: flex; // flex
    flex-direction: column; // flex-col
    justify-content: center; // justify-center
    padding-left: 1.25rem; // px-5
    padding-right: 1.25rem; // px-5
  }

  // 头部（flex-c 提供了 display:flex; align-items:center）
  .card-header {
    margin-bottom: 0.875rem; // mb-3.5
  }

  // 图标容器（flex-cc 提供了 display:flex; align-items:center; justify-content:center）
  .icon-wrapper {
    width: 2.75rem; // size-11 (11 * 0.25rem)
    height: 2.75rem; // size-11
    background: var(--art-gray-300); // bg-g-300
    font-size: 1.25rem; // text-xl
    line-height: 1.75rem; // text-xl
    border-radius: 0.5rem; // rounded-lg
  }

  // 图标 svg
  .icon-svg {
    font-size: 1.5rem; // text-2xl
    line-height: 2rem; // text-2xl
  }

  // 数值文本
  .card-value {
    display: block; // block
    margin-bottom: 0.25rem; // mb-1
    font-size: 1.5rem; // text-2xl
    line-height: 2rem; // text-2xl
    font-weight: 600; // font-semibold
  }

  // 标题
  .card-title {
    font-size: 0.875rem; // text-sm
    line-height: 1.25rem; // text-sm
    color: var(--art-gray-500); // text-g-500
  }

  // ElProgress 进度条外层背景色（穿透到子组件）
  .progress-bar :deep(.el-progress-bar__outer) {
    background: rgb(240 240 240); // [&_.el-progress-bar__outer]:bg-[rgb(240_240_240)]
  }
</style>
