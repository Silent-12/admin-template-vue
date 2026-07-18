<!-- 时间轴列表卡片 -->
<template>
  <div class="art-card timeline-list-card">
    <div class="card-header">
      <p class="card-title">{{ title }}</p>
      <p class="card-subtitle">{{ subtitle }}</p>
    </div>
    <ElScrollbar :style="{ height: maxHeight }">
      <ElTimeline class="timeline-custom">
        <ElTimelineItem
          v-for="item in list"
          :key="item.time"
          :timestamp="item.time"
          :placement="TIMELINE_PLACEMENT"
          :color="item.status"
          :center="true"
        >
          <div class="item-content flex-c">
            <div class="item-inner flex-c">
              <span class="item-text">{{ item.content }}</span>
              <span v-if="item.code" class="item-code"> #{{ item.code }} </span>
            </div>
          </div>
        </ElTimelineItem>
      </ElTimeline>
    </ElScrollbar>
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'ArtTimelineListCard' })

  // 常量配置
  const ITEM_HEIGHT = 65
  const TIMELINE_PLACEMENT = 'top'
  const DEFAULT_MAX_COUNT = 5

  interface TimelineItem {
    /** 时间 */
    time: string
    /** 状态颜色 */
    status: string
    /** 内容 */
    content: string
    /** 代码标识 */
    code?: string
  }

  interface Props {
    /** 时间轴列表数据 */
    list: TimelineItem[]
    /** 标题 */
    title: string
    /** 副标题 */
    subtitle?: string
    /** 最大显示数量 */
    maxCount?: number
  }

  // Props 定义和验证
  const props = withDefaults(defineProps<Props>(), {
    title: '',
    subtitle: '',
    maxCount: DEFAULT_MAX_COUNT
  })

  // 计算最大高度
  const maxHeight = computed(() => `${ITEM_HEIGHT * props.maxCount}px`)
</script>

<style scoped lang="scss">
  // 时间轴列表卡片容器
  .timeline-list-card {
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

  // ElTimeline 自定义内边距（保留 !important 以覆盖 el-timeline 默认 padding）
  .timeline-custom {
    padding-left: 0.125rem !important; // !pl-0.5 (0.5 * 0.25rem)
  }

  // 内容行（flex-c 提供了 display:flex; align-items:center）
  .item-content {
    gap: 0.75rem; // gap-3
  }

  // 内容内层（flex-c 提供了 display:flex; align-items:center）
  .item-inner {
    gap: 0.5rem; // gap-2
  }

  // 内容文本
  .item-text {
    font-size: 0.875rem; // text-sm
    line-height: 1.25rem; // text-sm
  }

  // 代码标识
  .item-code {
    font-size: 0.875rem; // text-sm
    line-height: 1.25rem; // text-sm
    color: var(--theme-color); // text-theme
  }
</style>
