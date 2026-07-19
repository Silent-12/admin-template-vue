<!-- 返回顶部按钮 -->
<template>
  <Transition
    enter-active-class="backtop-enter-active"
    leave-active-class="backtop-leave-active"
    enter-from-class="backtop-enter-from"
    enter-to-class="backtop-enter-to"
    leave-from-class="backtop-leave-from"
    leave-to-class="backtop-leave-to"
  >
    <div v-show="showButton" class="back-to-top flex-cc c-p tad-300" @click="scrollToTop">
      <AoSvgIcon icon="ri:arrow-up-wide-line" class="back-to-top-icon" />
    </div>
  </Transition>
</template>

<script setup lang="ts">
  import { useCommon } from '@/hooks/core/useCommon'

  defineOptions({ name: 'AoBackToTop' })

  const { scrollToTop } = useCommon()

  const showButton = ref(false)
  const scrollThreshold = 300

  onMounted(() => {
    const scrollContainer = document.getElementById('app-main')
    if (scrollContainer) {
      const { y } = useScroll(scrollContainer)
      watch(y, (newY: number) => {
        showButton.value = newY > scrollThreshold
      })
    }
  })
</script>

<style scoped lang="scss">
  // 返回顶部按钮容器
  .back-to-top {
    position: fixed; // fixed
    right: 2.5rem; // right-10
    bottom: 3.75rem; // bottom-15
    width: 2.375rem; // size-9.5
    height: 2.375rem; // size-9.5
    border: 1px solid var(--ao-gray-300); // border border-g-300
    border-radius: 0.375rem; // rounded-md

    &:hover {
      background: var(--ao-gray-200); // hover:bg-g-200
    }
  }

  // 按钮内图标
  .back-to-top-icon {
    font-size: 1.125rem; // text-lg
    line-height: 1.75rem; // text-lg
    color: var(--ao-gray-500); // text-g-500
  }

  // 进入过渡（ease-out: cubic-bezier(0, 0, 0.2, 1)）
  .backtop-enter-active {
    transition: all 300ms cubic-bezier(0, 0, 0.2, 1);
  }

  // 离开过渡（ease-in: cubic-bezier(0.4, 0, 1, 1)）
  .backtop-leave-active {
    transition: all 200ms cubic-bezier(0.4, 0, 1, 1);
  }

  // 进入起点 / 离开终点（透明 + 下移 0.5rem）
  .backtop-enter-from,
  .backtop-leave-to {
    opacity: 0;
    transform: translateY(0.5rem); // translate-y-2
  }

  // 进入终点 / 离开起点（不透明 + 原位）
  .backtop-enter-to,
  .backtop-leave-from {
    opacity: 1;
    transform: translateY(0);
  }
</style>
