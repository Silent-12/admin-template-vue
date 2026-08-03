<!-- 系统logo -->
<template>
  <div class="flex-cc">
    <img :style="logoStyle" src="@imgs/common/logo.webp" alt="logo" class="logo-img" />
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'AoLogo' })

  interface Props {
    /** logo 大小 */
    size?: number | string
  }

  const props = withDefaults(defineProps<Props>(), {
    size: 36
  })

  const logoStyle = computed(() => ({ width: `${props.size}px` }))
</script>

<style scoped lang="scss">
  // logo 图片（原 Tailwind w-full h-full）
  .logo-img {
    width: 100%;
    height: 100%;
  }
</style>
