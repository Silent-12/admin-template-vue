<!-- 工作台页面 -->
<template>
  <div>
    <BannerShowcase />
    <AboutProject />
  </div>
</template>

<script setup lang="ts">
  import AboutProject from './modules/about-project.vue'
  import BannerShowcase from './modules/banner-showcase.vue'

  defineOptions({ name: 'Console' })
</script>
