<!-- 工作台页面 -->
<template>
  <div>
    <BannerShowcase />
    <AboutProject />
  </div>
</template>

<script setup lang="ts">
  import AboutProject from './components/AboutProject.vue'
  import BannerShowcase from './components/BannerShowcase.vue'

  defineOptions({ name: 'Console' })
</script>
