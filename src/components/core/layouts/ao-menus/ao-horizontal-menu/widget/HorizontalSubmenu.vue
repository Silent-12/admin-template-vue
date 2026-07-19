<template>
  <ElSubMenu v-if="hasChildren" :index="item.path || item.meta.title" class="horizontal-submenu">
    <template #title>
      <AoSvgIcon :icon="item.meta.icon" :color="theme?.iconColor" class="submenu-icon" />
      <span class="submenu-title">{{ formatMenuTitle(item.meta.title) }}</span>
      <div v-if="item.meta.showBadge" class="ao-badge ao-badge-horizontal" />
      <div v-if="item.meta.showTextBadge" class="ao-text-badge">
        {{ item.meta.showTextBadge }}
      </div>
    </template>

    <!-- 递归调用自身处理子菜单 -->
    <HorizontalSubmenu
      v-for="child in filteredChildren"
      :key="child.path"
      :item="child"
      :theme="theme"
      :is-mobile="isMobile"
      :level="level + 1"
      @close="closeMenu"
    />
  </ElSubMenu>

  <ElMenuItem
    v-else-if="isNavigableRoute"
    :index="item.path || item.meta.title"
    @click="goPage(item)"
  >
    <AoSvgIcon
      :icon="item.meta.icon"
      :color="theme?.iconColor"
      class="submenu-icon"
      :style="{ color: theme.iconColor }"
    />
    <span class="submenu-title">{{ formatMenuTitle(item.meta.title) }}</span>
    <div
      v-if="item.meta.showBadge"
      class="ao-badge"
      :style="{ right: level === 0 ? '10px' : '20px' }"
    />
    <div v-if="item.meta.showTextBadge && level !== 0" class="ao-text-badge">
      {{ item.meta.showTextBadge }}
    </div>
  </ElMenuItem>
</template>

<script lang="ts" setup>
  import { computed, type PropType } from 'vue'
  import { AppRouteRecord } from '@/types/router'
  import { handleMenuJump } from '@/utils/navigation'
  import { formatMenuTitle } from '@/utils/router'

  const props = defineProps({
    item: {
      type: Object as PropType<AppRouteRecord>,
      required: true
    },
    theme: {
      type: Object,
      default: () => ({})
    },
    isMobile: Boolean,
    level: {
      type: Number,
      default: 0
    }
  })

  const emit = defineEmits(['close'])

  // 过滤后的子菜单项（不包含隐藏的）
  const filteredChildren = computed(() => {
    return props.item.children?.filter((child) => !child.meta.isHide) || []
  })

  // 父菜单如果本身就是页面，则即使没有可见子菜单也应该保留为菜单项。
  const isNavigableRoute = computed(() => {
    return !!(
      !props.item.meta.isHide &&
      ((props.item.path && props.item.path.trim()) ||
        props.item.meta.link ||
        props.item.meta.isIframe === true) &&
      (props.item.component || props.item.meta.link || props.item.meta.isIframe === true)
    )
  })

  // 计算当前项是否有可见的子菜单
  const hasChildren = computed(() => {
    return filteredChildren.value.length > 0
  })

  const goPage = (item: AppRouteRecord) => {
    closeMenu()
    handleMenuJump(item)
  }

  const closeMenu = () => {
    emit('close')
  }
</script>

<style scoped lang="scss">
  // 子菜单容器：!p-0
  .horizontal-submenu {
    padding: 0 !important;
  }

  // 子菜单/菜单项图标：mr-1 text-lg
  .submenu-icon {
    margin-right: 0.25rem; // mr-1
    font-size: 1.125rem; // text-lg
    line-height: 1.75rem; // text-lg
  }

  // 子菜单/菜单项标题：text-md
  .submenu-title {
    font-size: 1rem; // text-md
    line-height: 1.5rem; // text-md
  }

  :deep(.el-sub-menu__title .el-sub-menu__icon-arrow) {
    right: 10px !important;
  }
</style>
