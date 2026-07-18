<!-- 顶部快速入口面板 -->
<template>
  <ElPopover
    ref="popoverRef"
    :width="700"
    :offset="0"
    :show-arrow="false"
    trigger="hover"
    placement="bottom-start"
    popper-class="fast-enter-popover"
    :popper-style="{
      border: '1px solid var(--default-border)',
      borderRadius: 'calc(var(--custom-radius) / 2 + 4px)'
    }"
  >
    <template #reference>
      <div class="fast-enter__trigger flex-c">
        <slot />
      </div>
    </template>

    <div class="fast-enter__grid">
      <div>
        <div class="fast-enter__apps">
          <!-- 应用列表 -->
          <div
            v-for="application in enabledApplications"
            :key="application.name"
            class="fast-enter__app c-p flex-c"
            @click="handleApplicationClick(application)"
          >
            <div class="app-icon fast-enter__app-icon flex-cc">
              <ArtSvgIcon
                class="fast-enter__app-icon-svg"
                :icon="application.icon"
                :style="{ color: application.iconColor }"
              />
            </div>
            <div>
              <h3 class="fast-enter__app-name">{{ application.name }}</h3>
              <p class="fast-enter__app-desc">{{ application.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="fast-enter__links border-l-d">
        <h3 class="fast-enter__links-title">快速链接</h3>
        <ul>
          <li
            v-for="quickLink in enabledQuickLinks"
            :key="quickLink.name"
            class="fast-enter__link c-p"
            @click="handleQuickLinkClick(quickLink)"
          >
            <span class="fast-enter__link-text">{{ quickLink.name }}</span>
          </li>
        </ul>
      </div>
    </div>
  </ElPopover>
</template>

<script setup lang="ts">
  import { useFastEnter } from '@/hooks/core/useFastEnter'
  import type { FastEnterApplication, FastEnterQuickLink } from '@/types/config'

  defineOptions({ name: 'ArtFastEnter' })

  const router = useRouter()
  const popoverRef = ref()

  // 使用快速入口配置
  const { enabledApplications, enabledQuickLinks } = useFastEnter()

  /**
   * 处理导航跳转
   * @param routeName 路由名称
   * @param link 外部链接
   */
  const handleNavigate = (routeName?: string, link?: string): void => {
    const targetPath = routeName || link

    if (!targetPath) {
      console.warn('导航配置无效：缺少路由名称或链接')
      return
    }

    if (targetPath.startsWith('http')) {
      window.open(targetPath, '_blank')
    } else {
      router.push({ name: targetPath })
    }

    popoverRef.value?.hide()
  }

  /**
   * 处理应用项点击
   * @param application 应用配置对象
   */
  const handleApplicationClick = (application: FastEnterApplication): void => {
    handleNavigate(application.routeName, application.link)
  }

  /**
   * 处理快速链接点击
   * @param quickLink 快速链接配置对象
   */
  const handleQuickLinkClick = (quickLink: FastEnterQuickLink): void => {
    handleNavigate(quickLink.routeName, quickLink.link)
  }
</script>

<style scoped lang="scss">
  // ==================== 触发器 ====================
  // flex-c gap-2
  // 保留全局工具类 flex-c
  .fast-enter__trigger {
    gap: 0.5rem; // gap-2
  }

  // ==================== 主网格 ====================
  // grid grid-cols-[2fr_0.8fr]
  .fast-enter__grid {
    display: grid;
    grid-template-columns: 2fr 0.8fr; // grid-cols-[2fr_0.8fr]
  }

  // ==================== 应用列表 ====================
  // grid grid-cols-2 gap-1.5
  .fast-enter__apps {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr)); // grid-cols-2
    gap: 0.375rem; // gap-1.5
  }

  // 应用项：mr-3 c-p flex-c gap-3 rounded-lg p-2
  // hover:bg-g-200/70 dark:hover:bg-g-200/90 hover:[&_.app-icon]:!bg-transparent
  // 保留全局工具类 c-p flex-c
  .fast-enter__app {
    gap: 0.75rem; // gap-3
    margin-right: 0.75rem; // mr-3
    padding: 0.5rem; // p-2
    border-radius: 0.5rem; // rounded-lg

    &:hover {
      background: color-mix(in srgb, var(--art-gray-200) 70%, transparent); // hover:bg-g-200/70

      // hover:[&_.app-icon]:!bg-transparent
      .app-icon {
        background: transparent !important;
      }

      // dark:hover:bg-g-200/90
      .dark & {
        background: color-mix(in srgb, var(--art-gray-200) 90%, transparent);
      }
    }
  }

  // 应用图标容器：size-12 flex-cc rounded-lg bg-g-200/80 dark:bg-g-300/30
  // 保留全局工具类 flex-cc
  .fast-enter__app-icon {
    width: 3rem; // size-12
    height: 3rem;
    border-radius: 0.5rem; // rounded-lg
    background: color-mix(in srgb, var(--art-gray-200) 80%, transparent); // bg-g-200/80

    // dark:bg-g-300/30
    .dark & {
      background: color-mix(in srgb, var(--art-gray-300) 30%, transparent);
    }
  }

  // 应用图标：text-xl
  .fast-enter__app-icon-svg {
    font-size: 1.25rem; // text-xl
    line-height: 1.75rem;
  }

  // 应用名称：m-0 text-sm font-medium text-g-800
  .fast-enter__app-name {
    margin: 0; // m-0
    font-size: 0.875rem; // text-sm
    line-height: 1.25rem;
    font-weight: 500; // font-medium
    color: var(--art-gray-800);
  }

  // 应用描述：mt-1 text-xs text-g-600
  .fast-enter__app-desc {
    margin-top: 0.25rem; // mt-1
    font-size: 0.75rem; // text-xs
    line-height: 1rem;
    color: var(--art-gray-600);
  }

  // ==================== 快速链接 ====================
  // border-l-d pl-6 pt-2
  // 保留全局工具类 border-l-d
  .fast-enter__links {
    padding-left: 1.5rem; // pl-6
    padding-top: 0.5rem; // pt-2
  }

  // 标题：mb-2.5 text-base font-medium text-g-800
  .fast-enter__links-title {
    margin-bottom: 0.625rem; // mb-2.5
    font-size: 1rem; // text-base
    line-height: 1.5rem;
    font-weight: 500; // font-medium
    color: var(--art-gray-800);
  }

  // 链接项：c-p py-2 hover:[&_span]:text-theme
  // 保留全局工具类 c-p
  .fast-enter__link {
    padding-top: 0.5rem; // py-2
    padding-bottom: 0.5rem;

    &:hover {
      // hover:[&_span]:text-theme
      .fast-enter__link-text {
        color: var(--theme-color);
      }
    }
  }

  // 链接文字：text-g-600 no-underline
  .fast-enter__link-text {
    color: var(--art-gray-600);
    text-decoration-line: none; // no-underline
  }
</style>
