<!-- 布局容器 -->
<template>
  <div class="app-layout">
    <aside id="app-sidebar">
      <AoSidebarMenu />
    </aside>

    <main id="app-main">
      <div id="app-header">
        <AoHeaderBar />
      </div>
      <div id="app-content">
        <AoPageContent />
      </div>
    </main>

    <div id="app-global">
      <AoGlobalComponent />
    </div>
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'AppLayout' })
</script>

<style lang="scss" scoped>
  @use './style';
</style>
