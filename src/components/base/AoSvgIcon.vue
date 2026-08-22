<!-- 图标组件 -->
<template>
  <img v-if="localSvgUrl" :src="localSvgUrl" v-bind="bindAttrs" class="ao-svg-icon" alt="" />
  <Icon v-else-if="props.icon" :icon="props.icon" v-bind="bindAttrs" class="ao-svg-icon" />
</template>

<script setup lang="ts">
  import { computed, useAttrs } from 'vue'
  import { Icon } from '@iconify/vue'

  defineOptions({ name: 'AoSvgIcon', inheritAttrs: false })

  /** 图标组件属性
   * @description 定义图标名称和显示尺寸。
   */
  interface Props {
    // 图标名称
    icon?: string
    // 图标尺寸
    size?: string | number
  }

  const props = withDefaults(defineProps<Props>(), {
    size: '1em'
  })

  const localSvgModules = import.meta.glob('@/assets/svg/**/*.svg', {
    eager: true,
    query: '?url',
    import: 'default'
  }) as Record<string, string>

  /**
   * @description 根据图标名称查找本地 SVG URL。
   * @param icon 图标名称，使用连字符表示 SVG 目录层级。
   * @return 本地 SVG URL，未找到时返回 undefined。
   */
  function resolveLocalSvgUrl(icon?: string): string | undefined {
    if (!icon || icon.includes(':')) {
      return undefined
    }

    const relativePath = `${icon.split('-').join('/')}.svg`
    const module = Object.entries(localSvgModules).find(([path]) =>
      path.endsWith(`/assets/svg/${relativePath}`)
    )

    return module?.[1]
  }

  const attrs = useAttrs()

  const localSvgUrl = computed(() => resolveLocalSvgUrl(props.icon))

  const bindAttrs = computed(() => ({
    class: (attrs.class as string) || '',
    style: [attrs.style, { width: props.size, height: props.size }]
  }))
</script>

<style scoped lang="scss">
  // 图标默认内联显示
  .ao-svg-icon {
    display: inline;
  }
</style>
