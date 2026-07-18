<!-- 按钮组件 -->
<template>
  <div
    class="icon-button flex-cc c-p tad-300"
    :class="{ 'is-circle': circle }"
  >
    <ArtSvgIcon :icon="icon"></ArtSvgIcon>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
  defineOptions({ name: 'ArtIconButton' })

  interface Props {
    /** 图标名称 */
    icon: string
    /** 圆角按钮 */
    circle?: boolean
  }

  withDefaults(defineProps<Props>(), {})
</script>

<style scoped lang="scss">
// 图标按钮（size-8.5 inline-flex text-g-600 dark:text-g-800 text-xl rounded hover:bg-hover-color）
.icon-button {
  width: 2.125rem; // size-8.5
  height: 2.125rem; // size-8.5
  display: inline-flex; // inline-flex
  font-size: 1.25rem; // text-xl
  line-height: 1.75rem; // text-xl
  border-radius: 0.25rem; // rounded
  color: var(--art-gray-600); // text-g-600

  // hover:bg-hover-color
  &:hover {
    background: var(--art-hover-color);
  }

  // dark:text-g-800
  .dark & {
    color: var(--art-gray-800);
  }
}

// 圆形按钮（rounded-full）
.icon-button.is-circle {
  border-radius: 9999px; // rounded-full
}
</style>
