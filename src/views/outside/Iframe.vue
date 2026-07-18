<template>
  <div class="iframe-container" v-loading="isLoading">
    <iframe
      ref="iframeRef"
      :src="iframeUrl"
      frameborder="0"
      class="iframe-view"
      @load="handleIframeLoad"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
  import { IframeRouteManager } from '@/router/core'

  defineOptions({ name: 'IframeView' })

  const route = useRoute()
  const isLoading = ref(true)
  const iframeUrl = ref('')
  const iframeRef = ref<HTMLIFrameElement | null>(null)

  /**
   * 初始化 iframe URL
   * 从路由配置中获取对应的外部链接地址
   */
  onMounted(() => {
    const iframeRoute = IframeRouteManager.getInstance().findByPath(route.path)

    if (iframeRoute?.meta) {
      iframeUrl.value = iframeRoute.meta.link || ''
    }
  })

  /**
   * 处理 iframe 加载完成事件
   * 隐藏加载状态
   */
  const handleIframeLoad = (): void => {
    isLoading.value = false
  }
</script>

<style scoped lang="scss">
  /* iframe 外层容器 */
  .iframe-container {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }

  /* iframe 元素：铺满容器并保留底部留白 */
  .iframe-view {
    width: 100%;
    height: 100%;
    min-height: calc(100vh - 120px);
    border: none;
  }
</style>
