<!-- 文字滚动 -->
<template>
  <div
    ref="containerRef"
    class="text-scroll-container rounded-custom-sm flex-c"
    :class="themeClasses"
    :style="containerStyle"
  >
    <div class="text-scroll-icon-left flex-cc" :style="{ backgroundColor: bgColor }">
      <ArtSvgIcon icon="ri:volume-down-line" class="icon-volume" />
    </div>

    <div
      ref="contentRef"
      class="text-scroll-content"
      :class="[contentClass, { 'is-hidden': !isReady, 'is-visible': isReady }]"
      :style="contentStyle"
      @click="handleContentClick"
    >
      <!-- 原始内容 -->
      <span ref="textRef" class="text-scroll-text">
        <slot>
          <span v-html="text"></span>
        </slot>
      </span>
      <!-- 克隆内容用于无缝循环 -->
      <span v-if="shouldClone" class="text-scroll-text" :style="cloneSpacing">
        <slot>
          <span v-html="text"></span>
        </slot>
      </span>
    </div>

    <div
      v-if="showClose"
      class="text-scroll-close flex-cc c-p"
      :style="{ backgroundColor: bgColor }"
      @click="handleClose"
    >
      <ArtSvgIcon icon="ri:close-fill" class="icon-close" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    useElementSize,
    useRafFn,
    useElementHover,
    useDebounceFn,
    useTimeoutFn
  } from '@vueuse/core'
  import { useSettingStore } from '@/store/modules/setting'

  type ThemeType =
    'theme' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'danger'

  /**
   * 文本滚动组件属性接口
   */
  export interface TextScrollProps {
    /** 滚动文本内容 */
    text?: string
    /** 主题类型 */
    type?: ThemeType
    /** 滚动方向 */
    direction?: 'left' | 'right' | 'up' | 'down'
    /** 滚动速度，单位：像素/秒 */
    speed?: number
    /** 容器宽度 */
    width?: string
    /** 容器高度 */
    height?: string
    /** 鼠标悬停时是否暂停滚动 */
    pauseOnHover?: boolean
    /** 是否显示关闭按钮 */
    showClose?: boolean
    /** 始终滚动（即使文字未溢出） */
    alwaysScroll?: boolean
  }

  const props = withDefaults(defineProps<TextScrollProps>(), {
    text: '',
    direction: 'left',
    speed: 80,
    width: '100%',
    height: '36px',
    pauseOnHover: true,
    type: 'theme',
    showClose: false,
    alwaysScroll: true
  })

  const emit = defineEmits<{
    close: []
  }>()

  const handleClose = () => {
    emit('close')
  }

  const settingStore = useSettingStore()
  const { isDark } = storeToRefs(settingStore)

  const containerRef = ref<HTMLElement>()
  const contentRef = ref<HTMLElement>()
  const textRef = ref<HTMLElement>()
  const isReady = ref(false)

  const currentPosition = ref(0)
  const textSize = ref(0)
  const containerSize = ref(0)
  const shouldClone = ref(false)

  const isHorizontal = computed(() => props.direction === 'left' || props.direction === 'right')
  const isReverse = computed(() => props.direction === 'right' || props.direction === 'down')

  // 使用 VueUse 的 useElementSize 监听容器尺寸变化
  const { width: containerWidth, height: containerHeight } = useElementSize(containerRef)

  // 使用 VueUse 的 useElementHover 检测鼠标悬停
  const isHovered = useElementHover(containerRef)

  // 计算是否应该暂停动画
  const isPaused = computed(() => {
    // 如果未启用 alwaysScroll，且文字未超出容器，则暂停滚动
    if (!props.alwaysScroll && textSize.value <= containerSize.value) {
      return true
    }
    return props.pauseOnHover && isHovered.value
  })

  // 主题样式映射（语义化类名，对应样式在 scoped scss 中定义）
  const themeClasses = computed(() => {
    const themeMap: Record<ThemeType, string> = {
      theme: 'is-theme',
      primary: 'is-primary',
      secondary: 'is-secondary',
      error: 'is-error',
      info: 'is-info',
      success: 'is-success',
      warning: 'is-warning',
      danger: 'is-danger'
    }
    return themeMap[props.type] || themeMap.theme
  })

  // 背景色（根据主题类型映射到对应的 CSS 变量）
  const bgColor = computed(() => {
    const colorVarMap: Record<ThemeType, string> = {
      theme: 'var(--theme-color)',
      primary: 'var(--art-primary)',
      secondary: 'var(--art-secondary)',
      error: 'var(--art-error)',
      info: 'var(--art-info)',
      success: 'var(--art-success)',
      warning: 'var(--art-warning)',
      danger: 'var(--art-danger)'
    }
    return `color-mix(in oklch, ${colorVarMap[props.type]} ${isDark.value ? '25' : '10'}%, var(--art-color))`
  })

  const containerStyle = computed(() => ({
    width: props.width,
    height: props.height,
    backgroundColor: bgColor.value
  }))

  const contentClass = computed(() => {
    if (!isHorizontal.value) {
      return 'is-vertical'
    }
    return ''
  })

  const contentStyle = computed(() => {
    const transform = isHorizontal.value
      ? `translateX(${currentPosition.value}px)`
      : `translateY(${currentPosition.value}px)`

    return {
      transform,
      willChange: 'transform'
    }
  })

  // 克隆元素的间距
  const cloneSpacing = computed(() => {
    const spacing = '2em'
    return isHorizontal.value ? { marginLeft: spacing } : { marginTop: spacing }
  })

  const measureSizes = () => {
    if (!containerRef.value || !textRef.value) return

    const text = textRef.value

    if (isHorizontal.value) {
      containerSize.value = containerWidth.value
      textSize.value = text.offsetWidth
    } else {
      containerSize.value = containerHeight.value
      textSize.value = text.offsetHeight
    }

    const isOverflow = textSize.value > containerSize.value
    shouldClone.value = isOverflow

    // 居中显示
    currentPosition.value = (containerSize.value - textSize.value) / 2

    // 测量完成后才显示内容
    if (!isReady.value) {
      isReady.value = true
    }
  }

  // 使用 VueUse 的 useDebounceFn 防抖测量
  const debouncedMeasure = useDebounceFn(measureSizes, 150)

  let lastTimestamp = 0

  // 使用 VueUse 的 useRafFn 替代手动 requestAnimationFrame
  const { pause, resume } = useRafFn(
    ({ timestamp }) => {
      if (!lastTimestamp) lastTimestamp = timestamp

      if (!isPaused.value) {
        const delta = (timestamp - lastTimestamp) / 1000
        const distance = props.speed * delta
        const spacing = textSize.value * 0.1

        currentPosition.value += isReverse.value ? distance : -distance

        // 循环边界检测
        if (isReverse.value) {
          if (currentPosition.value > containerSize.value) {
            currentPosition.value = -(textSize.value + spacing)
          }
        } else {
          if (currentPosition.value < -(textSize.value + spacing)) {
            currentPosition.value = containerSize.value
          }
        }
      }

      lastTimestamp = timestamp
    },
    { immediate: false }
  )

  const handleContentClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.tagName === 'A') {
      e.stopPropagation()
    }
  }

  // 监听容器尺寸变化
  watch([containerWidth, containerHeight], () => {
    debouncedMeasure()
  })

  // 监听属性变化
  watch(
    () => [props.direction, props.speed, props.text],
    () => {
      measureSizes()
      lastTimestamp = 0
    }
  )

  // 使用 VueUse 的 useTimeoutFn 替代 setTimeout
  const { start: startMeasure } = useTimeoutFn(() => {
    measureSizes()
    // 测量完成后立即开始动画
    resume()
  }, 100)

  onMounted(() => {
    startMeasure()
  })

  onBeforeUnmount(() => {
    pause()
  })
</script>

<style scoped lang="scss">
// 文字滚动容器（relative overflow-hidden border box-border text-sm）
.text-scroll-container {
  position: relative; // relative
  overflow: hidden; // overflow-hidden
  border-width: 1px; // border
  box-sizing: border-box; // box-border
  font-size: 0.875rem; // text-sm
  line-height: 1.25rem; // text-sm
}

// 左侧音量图标容器（absolute left-0 h-full w-9 z-10）
.text-scroll-icon-left {
  position: absolute; // absolute
  left: 0; // left-0
  top: 0;
  height: 100%; // h-full
  width: 2.25rem; // w-9
  z-index: 10; // z-10
}

// 音量图标（text-lg）
.icon-volume {
  font-size: 1.125rem; // text-lg
  line-height: 1.75rem; // text-lg
}

// 文字内容容器（whitespace-nowrap inline-block transition-opacity duration-600 px-9）
.text-scroll-content {
  white-space: nowrap; // whitespace-nowrap
  display: inline-block; // inline-block
  transition-property: opacity; // transition-opacity
  transition-duration: 600ms; // duration-600
  padding-left: 2.25rem; // px-9
  padding-right: 2.25rem; // px-9

  // [&_a]:text-danger
  a {
    color: var(--art-danger);

    // [&_a:hover]:underline [&_a:hover]:text-danger/80
    &:hover {
      text-decoration: underline;
      color: color-mix(in srgb, var(--art-danger) 80%, transparent);
    }
  }
}

// 纵向滚动模式（flex flex-col）
.text-scroll-content.is-vertical {
  display: flex; // flex
  flex-direction: column; // flex-col
}

// 文本片段（inline-block）
.text-scroll-text {
  display: inline-block; // inline-block
}

// 隐藏状态（opacity-0）
.text-scroll-content.is-hidden {
  opacity: 0; // opacity-0
}

// 可见状态（opacity-100）
.text-scroll-content.is-visible {
  opacity: 1; // opacity-100
}

// 右侧关闭按钮容器（absolute right-0 h-full w-9）
.text-scroll-close {
  position: absolute; // absolute
  right: 0; // right-0
  top: 0;
  height: 100%; // h-full
  width: 2.25rem; // w-9
}

// 关闭图标（text-lg）
.icon-close {
  font-size: 1.125rem; // text-lg
  line-height: 1.75rem; // text-lg
}

// 主题颜色变体（90% 文字色 + 50% 边框色）
.is-theme {
  color: color-mix(in srgb, var(--theme-color) 90%, transparent);
  border-color: color-mix(in srgb, var(--theme-color) 50%, transparent) !important;
}

.is-primary {
  color: color-mix(in srgb, var(--art-primary) 90%, transparent);
  border-color: color-mix(in srgb, var(--art-primary) 50%, transparent) !important;
}

.is-secondary {
  color: color-mix(in srgb, var(--art-secondary) 90%, transparent);
  border-color: color-mix(in srgb, var(--art-secondary) 50%, transparent) !important;
}

.is-error {
  color: color-mix(in srgb, var(--art-error) 90%, transparent);
  border-color: color-mix(in srgb, var(--art-error) 50%, transparent) !important;
}

.is-info {
  color: color-mix(in srgb, var(--art-info) 90%, transparent);
  border-color: color-mix(in srgb, var(--art-info) 50%, transparent) !important;
}

.is-success {
  color: color-mix(in srgb, var(--art-success) 90%, transparent);
  border-color: color-mix(in srgb, var(--art-success) 50%, transparent) !important;
}

.is-warning {
  color: color-mix(in srgb, var(--art-warning) 90%, transparent);
  border-color: color-mix(in srgb, var(--art-warning) 50%, transparent) !important;
}

.is-danger {
  color: color-mix(in srgb, var(--art-danger) 90%, transparent);
  border-color: color-mix(in srgb, var(--art-danger) 50%, transparent) !important;
}
</style>
