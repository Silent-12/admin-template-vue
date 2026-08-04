<!-- 顶部业务系统切换器 -->
<template>
  <ElPopover
    ref="popoverRef"
    :width="200"
    :offset="0"
    :show-arrow="false"
    trigger="click"
    placement="bottom-start"
    popper-class="fast-enter-popover"
    :popper-style="{
      border: '1px solid var(--default-border)',
      borderRadius: 'calc(var(--custom-radius) / 2 + 4px)',
      padding: '6px'
    }"
  >
    <!-- 快速入口 -->
    <template #reference>
      <div class="fast-enter__trigger flex-c">
        <slot />
      </div>
    </template>

    <!-- 系统列表 -->
    <div class="fast-enter__apps">
      <button
        v-for="item in applicationList"
        :key="item.path"
        type="button"
        class="fast-enter__app flex-c"
        :class="{ 'fast-enter__app--active': item.path === currentApplication?.path }"
        @click="openApplication(item)"
      >
        <span class="fast-enter__app-icon flex-cc">
          <AoSvgIcon class="fast-enter__app-icon-svg" :icon="item.meta.icon" />
        </span>
        <span class="fast-enter__app-content">
          <span class="fast-enter__app-name">{{ formatMenuTitle(item.meta.title) }}</span>
          <span v-if="item.path === currentApplication?.path" class="fast-enter__app-status">
            {{ $t('topBar.system.current') }}
          </span>
        </span>
      </button>
    </div>
  </ElPopover>
</template>

<script setup lang="ts">
  import type { AppRouteRecord } from '@/types/router'
  import { useMenuStore } from '@/store/modules/menu'
  import { getFirstMenuPath } from '@/utils/navigation/route'
  import { formatMenuTitle } from '@/utils/router'

  defineOptions({ name: 'AoFastEnter' })

  const router = useRouter()
  const popoverRef = ref<{ hide: () => void }>()
  const { applicationList, currentApplication } = storeToRefs(useMenuStore())

  /**
   * @description 在新浏览器标签中打开目标业务系统首页。
   * @param application 目标业务系统路由。
   * @return 无返回值。
   */
  const openApplication = (application: AppRouteRecord): void => {
    const homePath = getFirstMenuPath(application.children || [])
    if (!homePath || application.path === currentApplication.value?.path) {
      popoverRef.value?.hide()
      return
    }

    const targetUrl = router.resolve({ path: homePath }).href
    window.open(targetUrl, '_blank', 'noopener')
    popoverRef.value?.hide()
  }
</script>

<style scoped lang="scss">
  .fast-enter {
    &__trigger {
      gap: 0.5rem;
    }

    &__apps {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    &__app {
      gap: 0.75rem;
      width: 100%;
      padding: 0.5rem;
      color: inherit;
      text-align: left;
      cursor: pointer;
      background: transparent;
      border: 0;
      border-radius: 0.5rem;

      &:hover,
      &--active {
        background: color-mix(in srgb, var(--ao-gray-200) 100%, transparent);
      }

      .dark &:hover,
      .dark &--active {
        background: color-mix(in srgb, var(--ao-gray-300) 100%, transparent);
      }
    }

    &__app-icon {
      flex: 0 0 auto;
      width: 2.5rem;
      height: 2.5rem;
      color: var(--ao-primary);
      background: color-mix(in srgb, var(--ao-gray-200) 80%, transparent);
      border-radius: 0.5rem;
    }

    &__app-icon-svg {
      font-size: 1.25rem;
    }

    &__app-content {
      display: grid;
      gap: 0.125rem;
      min-width: 0;
    }

    &__app-name {
      font-size: 0.875rem;
      font-weight: 500;
      line-height: 1.25rem;
      color: var(--ao-gray-800);
    }

    &__app-status {
      font-size: 0.75rem;
      line-height: 1rem;
      color: var(--ao-primary);
    }
  }
</style>
