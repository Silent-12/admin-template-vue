<!-- 图标组件 -->
<template>
  <Icon v-if="icon" :icon="icon" v-bind="bindAttrs" class="ao-svg-icon" />
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue'

  defineOptions({ name: 'AoSvgIcon', inheritAttrs: false })

  interface Props {
    icon?: string
  }

  defineProps<Props>()

  const attrs = useAttrs()

  const bindAttrs = computed<{ class: string; style: string }>(() => ({
    class: (attrs.class as string) || '',
    style: (attrs.style as string) || ''
  }))
</script>

<style scoped lang="scss">
  // 图标默认内联显示（原 Tailwind inline 类）
  .ao-svg-icon {
    display: inline;
  }
</style>
