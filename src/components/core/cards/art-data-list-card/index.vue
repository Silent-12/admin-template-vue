<!-- 数据列表卡片 -->
<template>
  <div class="art-card data-list-card">
    <div class="card-header">
      <p class="card-title">{{ title }}</p>
      <p class="card-subtitle">{{ subtitle }}</p>
    </div>
    <ElScrollbar :style="{ height: maxHeight }">
      <div v-for="(item, index) in list" :key="index" class="list-item flex-c">
        <div v-if="item.icon" class="item-icon flex-cc" :class="item.class">
          <ArtSvgIcon :icon="item.icon" class="item-icon-svg" />
        </div>
        <div class="item-text">
          <div class="item-title">{{ item.title }}</div>
          <div class="item-status">{{ item.status }}</div>
        </div>
        <div class="item-time">{{ item.time }}</div>
      </div>
    </ElScrollbar>
    <ElButton
      class="more-button"
      v-if="showMoreButton"
      v-ripple
      @click="handleMore"
      >查看更多</ElButton
    >
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'ArtDataListCard' })

  interface Props {
    /** 数据列表 */
    list: Activity[]
    /** 标题 */
    title: string
    /** 副标题 */
    subtitle?: string
    /** 最大显示数量 */
    maxCount?: number
    /** 是否显示更多按钮 */
    showMoreButton?: boolean
  }

  interface Activity {
    /** 标题 */
    title: string
    /** 状态 */
    status: string
    /** 时间 */
    time: string
    /** 样式类名 */
    class: string
    /** 图标 */
    icon: string
  }

  const ITEM_HEIGHT = 66
  const DEFAULT_MAX_COUNT = 5

  const props = withDefaults(defineProps<Props>(), {
    maxCount: DEFAULT_MAX_COUNT
  })

  const maxHeight = computed(() => `${ITEM_HEIGHT * props.maxCount}px`)

  const emit = defineEmits<{
    /** 点击更多按钮事件 */
    (e: 'more'): void
  }>()

  const handleMore = () => emit('more')
</script>

<style scoped lang="scss">
// 数据列表卡片容器
.data-list-card {
  padding: 1.25rem; // p-5
}

// 卡片头部
.card-header {
  padding-bottom: 0.875rem; // pb-3.5
}

// 标题
.card-title {
  font-size: 1.125rem; // text-lg
  line-height: 1.75rem; // text-lg
  font-weight: 500; // font-medium
}

// 副标题
.card-subtitle {
  font-size: 0.875rem; // text-sm
  line-height: 1.25rem; // text-sm
  color: var(--art-gray-600); // text-g-600
}

// 列表项（flex-c 提供了 display:flex; align-items:center）
.list-item {
  padding-top: 0.75rem; // py-3
  padding-bottom: 0.75rem; // py-3
}

// 图标容器（flex-cc 提供了 display:flex; align-items:center; justify-content:center）
.item-icon {
  margin-right: 0.75rem; // mr-3
  width: 2.5rem; // size-10 (10 * 0.25rem)
  height: 2.5rem; // size-10
  border-radius: 0.5rem; // rounded-lg
}

// 图标 svg
.item-icon-svg {
  font-size: 1.25rem; // text-xl
  line-height: 1.75rem; // text-xl
}

// 文本区域
.item-text {
  flex: 1 1 0%; // flex-1
}

// 列表项标题
.item-title {
  margin-bottom: 0.25rem; // mb-1
  font-size: 0.875rem; // text-sm
  line-height: 1.25rem; // text-sm
}

// 列表项状态
.item-status {
  font-size: 0.75rem; // text-xs
  line-height: 1rem; // text-xs
  color: var(--art-gray-500); // text-g-500
}

// 列表项时间
.item-time {
  margin-left: 0.75rem; // ml-3
  font-size: 0.75rem; // text-xs
  line-height: 1rem; // text-xs
  color: var(--art-gray-500); // text-g-500
}

// 更多按钮
.more-button {
  margin-top: 25px; // mt-[25px]
  width: 100%; // w-full
  text-align: center; // text-center
}
</style>
