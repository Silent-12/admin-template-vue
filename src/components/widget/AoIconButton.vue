<!-- 按钮组件 -->
<template>
  <div class="icon-button flex-cc c-p tad-300" :class="{ 'is-circle': circle }">
    <AoSvgIcon :icon="icon"></AoSvgIcon>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
  defineOptions({ name: 'AoIconButton' })

  interface Props {
    /** 图标名称 */
    icon: string
    /** 圆角按钮 */
    circle?: boolean
  }

  withDefaults(defineProps<Props>(), {})
</script>

<style scoped lang="scss">
  .icon-button {
    display: inline-flex;
    width: 2.125rem;
    height: 2.125rem;
    font-size: 1.25rem;
    line-height: 1.75rem;
    color: var(--ao-gray-600);
    border-radius: 0.25rem;
    &:hover {
      background: var(--ao-hover-color);
    }
    .dark & {
      color: var(--ao-gray-800);
    }
  }

  .icon-button.is-circle {
    border-radius: 9999px;
  }
</style>
