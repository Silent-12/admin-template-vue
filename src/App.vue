<template>
  <ElConfigProvider size="default" :locale="locales[language]" :z-index="3000">
    <RouterView></RouterView>
  </ElConfigProvider>
</template>

<script setup lang="ts">
  import { useUserStore } from './store/modules/user'
  import zh from 'element-plus/es/locale/lang/zh-cn'
  import en from 'element-plus/es/locale/lang/en'
  import { systemUpgrade } from './utils/sys'
  import { toggleTransition } from './utils/ui/animation'
  import { checkStorageCompatibility } from './utils/storage'
  import { initializeTheme } from './hooks/core/useTheme'

  const userStore = useUserStore()
  const { language } = storeToRefs(userStore)

  const locales = {
    zh: zh,
    en: en
  }

  onBeforeMount(() => {
    // 禁用路由过渡动画（页面首次加载时避免闪烁）
    toggleTransition(true)
    // 根据 localStorage 中保存的主题偏好，初始化亮色/暗色模式
    initializeTheme()
  })

  onMounted(() => {
    // 校验 localStorage 是否可用、数据结构是否兼容
    checkStorageCompatibility()
    // 恢复路由过渡动画，后续页面切换正常显示动画
    toggleTransition(false)
    // 执行系统版本升级迁移逻辑
    systemUpgrade()
  })
</script>
