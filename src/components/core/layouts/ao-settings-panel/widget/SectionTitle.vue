<template>
  <p class="section-title" :style="style">
    {{ title }}
  </p>
</template>

<script setup lang="ts">
  interface Props {
    title: string
    style?: Record<string, any>
  }

  defineProps<Props>()
</script>

<style scoped lang="scss">
  // 设置面板小节标题（两侧带装饰横线）
  .section-title {
    position: relative; // relative
    margin-top: 1.875rem; // mt-7.5
    margin-bottom: 1.375rem; // mb-5.5
    font-size: 0.875rem; // text-sm
    line-height: 1.25rem; // text-sm
    color: var(--ao-gray-800); // text-g-800
    text-align: center; // text-center

    // 前置装饰横线（左侧）
    &::before {
      position: absolute; // before:absolute
      top: 10px; // before:top-[10px]
      left: 0; // before:left-0
      width: 50px; // before:w-[50px]
      margin: auto; // before:m-auto
      content: ''; // before:content-['']
      border-bottom: 1px solid var(--ao-gray-300); // before:border-b before:border-[var(--ao-gray-300)]
    }

    // 后置装饰横线（右侧）
    &::after {
      position: absolute; // after:absolute
      top: 10px; // after:top-[10px]
      right: 0; // after:right-0
      width: 50px; // after:w-[50px]
      margin: auto; // after:m-auto
      content: ''; // after:content-['']
      border-bottom: 1px solid var(--ao-gray-300); // after:border-b after:border-g-300
    }
  }
</style>
