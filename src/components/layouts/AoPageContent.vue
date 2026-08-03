<!-- 布局内容 -->
<template>
  <div class="layout-content" :class="{ 'layout-content--full-page': isFullPage }">
    <div id="app-content-header">
      <!-- 路由信息调试 -->
      <div v-if="isOpenRouteInfo === 'true'" class="route-info-debug border-full-d">
        router meta：{{ route.meta }}
      </div>
    </div>

    <RouterView v-if="isRefresh" v-slot="{ Component, route }" :style="contentStyle">
      <!-- 缓存路由动画 -->
      <Transition :name="showTransitionMask ? '' : actualTransition" mode="out-in" appear>
        <KeepAlive :max="10" :exclude="keepAliveExclude">
          <component
            class="ao-page-view"
            :is="Component"
            :key="route.path"
            v-if="route.meta.keepAlive"
          />
        </KeepAlive>
      </Transition>

      <!-- 非缓存路由动画 -->
      <Transition :name="showTransitionMask ? '' : actualTransition" mode="out-in" appear>
        <component
          class="ao-page-view"
          :is="Component"
          :key="route.path"
          v-if="!route.meta.keepAlive"
        />
      </Transition>
    </RouterView>

    <!-- 全屏页面切换过渡遮罩（用于提升页面切换视觉体验） -->
    <Teleport to="body">
      <div v-show="showTransitionMask" class="transition-mask" />
    </Teleport>
  </div>
</template>
<script setup lang="ts">
  import type { CSSProperties } from 'vue'
  import { useRoute } from 'vue-router'
  import { useAutoLayoutHeight } from '@/hooks/core/useLayoutHeight'
  import { useSettingStore } from '@/store/modules/setting'
  import { useWorktabStore } from '@/store/modules/worktab'

  defineOptions({ name: 'AoPageContent' })

  const route = useRoute()
  const { containerMinHeight } = useAutoLayoutHeight()
  const { refresh } = storeToRefs(useSettingStore())
  const { keepAliveExclude } = storeToRefs(useWorktabStore())

  const isRefresh = shallowRef(true)
  const isOpenRouteInfo = import.meta.env.VITE_OPEN_ROUTE_INFO
  const showTransitionMask = ref(false)

  // 标记是否是首次加载（浏览器刷新）
  const isFirstLoad = ref(true)

  // 检查当前路由是否需要使用无基础布局模式
  const isFullPage = computed(() => route.matched.some((r) => r.meta?.isFullPage))
  const prevIsFullPage = ref(isFullPage.value)

  // 切换动画名称：固定为 slide-left，首次加载、从全屏返回时不使用动画
  const actualTransition = computed(() => {
    if (isFirstLoad.value) return ''
    if (prevIsFullPage.value && !isFullPage.value) return ''
    return 'slide-left'
  })

  // 监听全屏状态变化，显示过渡遮罩
  watch(isFullPage, (val, oldVal) => {
    if (val !== oldVal) {
      showTransitionMask.value = true
      // 延迟隐藏遮罩，给足时间让页面完成切换
      setTimeout(() => {
        showTransitionMask.value = false
      }, 50)
    }

    nextTick(() => {
      prevIsFullPage.value = val
    })
  })

  const contentStyle = computed((): CSSProperties => ({
    minHeight: containerMinHeight.value
  }))

  const reload = () => {
    isRefresh.value = false
    nextTick(() => {
      isRefresh.value = true
    })
  }

  watch(refresh, reload, { flush: 'post' })

  // 组件挂载后标记首次加载完成
  onMounted(() => {
    // 延迟一帧，确保首次渲染完成
    nextTick(() => {
      isFirstLoad.value = false
    })
  })
</script>

<style scoped lang="scss">
  // 全屏页面模式
  .layout-content {
    &--full-page {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 2500;
      width: 100%;
      height: 100vh;
      overflow: auto;
      background: var(--default-bg-color);
    }
  }

  // 路由信息调试条
  .route-info-debug {
    padding: 0.375rem 0.5rem;
    margin-bottom: 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: var(--ao-gray-500);
    background: var(--ao-gray-200);
    border-radius: 0.375rem;
  }

  // 全屏切换过渡遮罩
  .transition-mask {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2000;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    background: var(--default-box-color);
  }
</style>
