<!-- 面包屑导航 -->
<template>
  <nav class="breadcrumb" aria-label="breadcrumb">
    <ul class="breadcrumb__list flex-c">
      <li v-for="(item, index) in breadcrumbItems" :key="item.path" class="breadcrumb__item flex-c">
        <div
          :class="isClickable(item, index) ? 'breadcrumb__link c-p tad-200' : ''"
          @click="handleBreadcrumbClick(item, index)"
        >
          <span class="breadcrumb__text">{{ formatMenuTitle(item.meta?.title as string) }}</span>
        </div>
        <div
          v-if="!isLastItem(index) && item.meta?.title"
          class="breadcrumb__separator"
          aria-hidden="true"
        >
          /
        </div>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import type { RouteLocationMatched, RouteRecordRaw } from 'vue-router'
  import { formatMenuTitle } from '@/utils/router'

  defineOptions({ name: 'AoBreadcrumb' })

  export interface BreadcrumbItem {
    path: string
    meta: RouteRecordRaw['meta']
  }

  const route = useRoute()
  const router = useRouter()

  // 使用computed替代watch，提高性能
  const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
    const { matched } = route
    const matchedLength = matched.length

    // 处理首页情况
    if (!matchedLength || isHomeRoute(matched[0])) {
      return []
    }

    // 处理一级菜单和普通路由
    const firstRoute = matched[0]
    const isFirstLevel = firstRoute.meta?.isFirstLevel
    const lastIndex = matchedLength - 1
    const currentRoute = matched[lastIndex]
    const currentRouteMeta = currentRoute.meta

    let items = isFirstLevel
      ? [createBreadcrumbItem(currentRoute)]
      : matched.map(createBreadcrumbItem)

    // 过滤包裹容器：如果有多个项目且第一个是容器路由（如 /outside），则移除它
    if (items.length > 1 && isWrapperContainer(items[0])) {
      items = items.slice(1)
    }

    // IFrame 页面特殊处理：如果过滤后只剩一个 iframe 页面，或者所有项都是包裹容器，则仅展示当前页
    if (currentRouteMeta?.isIframe && (items.length === 1 || items.every(isWrapperContainer))) {
      return [createBreadcrumbItem(currentRoute)]
    }

    return items
  })

  // 辅助函数：判断是否为包裹容器路由
  const isWrapperContainer = (item: BreadcrumbItem): boolean =>
    item.path === '/outside' && !!item.meta?.isIframe

  // 辅助函数：创建面包屑项目
  const createBreadcrumbItem = (route: RouteLocationMatched): BreadcrumbItem => ({
    path: route.path,
    meta: route.meta
  })

  // 辅助函数：判断是否为首页
  const isHomeRoute = (route: RouteLocationMatched): boolean => route.name === '/'

  // 辅助函数：判断是否为最后一项
  const isLastItem = (index: number): boolean => {
    const itemsLength = breadcrumbItems.value.length
    return index === itemsLength - 1
  }

  // 辅助函数：判断是否可点击
  const isClickable = (item: BreadcrumbItem, index: number): boolean =>
    item.path !== '/outside' && !isLastItem(index)

  // 辅助函数：查找路由的第一个有效子路由
  const findFirstValidChild = (route: RouteRecordRaw) =>
    route.children?.find((child) => !child.redirect && !child.meta?.isHide)

  // 辅助函数：构建完整路径
  const buildFullPath = (childPath: string): string => `/${childPath}`.replace('//', '/')

  // 处理面包屑点击事件
  async function handleBreadcrumbClick(item: BreadcrumbItem, index: number): Promise<void> {
    // 如果是最后一项或外部链接，不处理
    if (isLastItem(index) || item.path === '/outside') {
      return
    }

    try {
      // 缓存路由表查找结果
      const routes = router.getRoutes()
      const targetRoute = routes.find((route) => route.path === item.path)

      if (!targetRoute?.children?.length) {
        await router.push(item.path)
        return
      }

      const firstValidChild = findFirstValidChild(targetRoute)
      if (firstValidChild) {
        await router.push(buildFullPath(firstValidChild.path))
      } else {
        await router.push(item.path)
      }
    } catch (error) {
      console.error('导航失败:', error)
    }
  }
</script>

<style scoped lang="scss">
  // 面包屑容器
  .breadcrumb {
    margin-left: 0.625rem;

    @media (width <= 63.99rem) {
      display: none !important;
    }
  }

  .breadcrumb__list {
    height: 100%; // h-full
  }

  .breadcrumb__item {
    box-sizing: border-box;
    height: 1.75rem;
    font-size: 0.875rem;
    line-height: 1.75rem;
  }

  // 可点击区域
  .breadcrumb__link {
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    border-radius: 0.25rem;

    &:hover {
      background: var(--ao-active-color);

      .breadcrumb__text {
        color: var(--ao-gray-600);
      }
    }
  }

  // 文本
  .breadcrumb__text {
    display: block;
    max-width: 11.5rem;
    padding-right: 0.375rem;
    padding-left: 0.375rem;
    overflow: hidden;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: var(--ao-gray-600);
    text-overflow: ellipsis;
    white-space: nowrap;

    .dark & {
      color: var(--ao-gray-800);
    }
  }

  // 分隔符
  .breadcrumb__separator {
    margin-right: 0.25rem;
    margin-left: 0.25rem;
    font-size: 0.875rem;
    font-style: normal;
    line-height: 1.25rem;
    color: var(--ao-gray-500);
  }
</style>
