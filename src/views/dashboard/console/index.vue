<!-- 工作台页面 -->
<template>
  <div>
    <BannerShowcase />
    <ExcelShowcase />
    <AboutProject />
  </div>
</template>

<script setup lang="ts">
  import AboutProject from './components/AboutProject.vue'
  import BannerShowcase from './components/BannerShowcase.vue'
  import ExcelShowcase from './components/ExcelShowcase.vue'

  defineOptions({ name: 'Console' })
</script>
