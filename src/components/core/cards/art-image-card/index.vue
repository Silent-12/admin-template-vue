<!-- 图片卡片 -->
<template>
  <div class="image-card-wrapper c-p" @click="handleClick">
    <div class="art-card image-card">
      <div class="image-wrapper">
        <ElImage
          :src="props.imageUrl"
          fit="cover"
          loading="lazy"
          class="image-element"
        >
          <template #placeholder>
            <div class="image-placeholder flex-cc">
              <ElIcon><Picture /></ElIcon>
            </div>
          </template>
        </ElImage>
        <div class="read-time" v-if="props.readTime">
          {{ props.readTime }} 阅读
        </div>
      </div>

      <div class="card-body">
        <div class="card-category" v-if="props.category">
          {{ props.category }}
        </div>
        <p class="card-title">{{ props.title }}</p>
        <div class="card-meta flex-c">
          <span class="meta-item flex-c" v-if="props.views">
            <ElIcon class="meta-icon"><View /></ElIcon>
            {{ props.views }}
          </span>
          <span class="meta-item flex-c" v-if="props.comments">
            <ElIcon class="meta-icon"><ChatLineRound /></ElIcon>
            {{ props.comments }}
          </span>
          <span>{{ props.date }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Picture, View, ChatLineRound } from '@element-plus/icons-vue'

  defineOptions({ name: 'ArtImageCard' })

  interface Props {
    /** 图片地址 */
    imageUrl: string
    /** 标题 */
    title: string
    /** 分类 */
    category?: string
    /** 阅读时间 */
    readTime?: string
    /** 浏览量 */
    views?: number
    /** 评论数 */
    comments?: number
    /** 日期 */
    date?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    imageUrl: '',
    title: '',
    category: '',
    readTime: '',
    views: 0,
    comments: 0,
    date: ''
  })

  const emit = defineEmits<{
    (e: 'click', card: Props): void
  }>()

  const handleClick = () => {
    emit('click', props)
  }
</script>

<style scoped lang="scss">
// 外层容器（c-p 提供了 cursor:pointer）
.image-card-wrapper {
  width: 100%; // w-full
}

// 图片卡片
.image-card {
  overflow: hidden; // overflow-hidden
}

// 图片区域
.image-wrapper {
  position: relative; // relative
  width: 100%; // w-full
  aspect-ratio: 16 / 10; // aspect-[16/10]
  overflow: hidden; // overflow-hidden
}

// ElImage 根元素
.image-element {
  width: 100%; // w-full
  height: 100%; // h-full
  transition-property: transform; // transition-transform
  transition-duration: 300ms; // duration-300
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); // ease-in-out

  // 鼠标悬停时放大
  &:hover {
    transform: scale(1.05); // hover:scale-105
  }
}

// 图片占位符（flex-cc 提供了 display:flex; align-items:center; justify-content:center）
.image-placeholder {
  width: 100%; // w-full
  height: 100%; // h-full
  background: #f5f7fa; // bg-[#f5f7fa]
}

// 阅读时间标签
.read-time {
  position: absolute; // absolute
  right: 0.875rem; // right-3.5 (3.5 * 0.25rem)
  bottom: 0.875rem; // bottom-3.5
  padding-top: 0.25rem; // py-1
  padding-bottom: 0.25rem; // py-1
  padding-left: 0.5rem; // px-2
  padding-right: 0.5rem; // px-2
  font-size: 0.75rem; // text-xs
  line-height: 1rem; // text-xs
  background: var(--art-gray-200); // bg-g-200
  border-radius: 0.25rem; // rounded
}

// 内容区域
.card-body {
  padding: 1rem; // p-4
}

// 分类标签
.card-category {
  display: inline-block; // inline-block
  padding-top: 0.125rem; // py-0.5
  padding-bottom: 0.125rem; // py-0.5
  padding-left: 0.5rem; // px-2
  padding-right: 0.5rem; // px-2
  margin-bottom: 0.5rem; // mb-2
  font-size: 0.75rem; // text-xs
  line-height: 1rem; // text-xs
  // bg-g-300/70 表示 70% 不透明度
  background: color-mix(in oklab, var(--art-gray-300) 70%, transparent);
  border-radius: 0.25rem; // rounded
}

// 标题
.card-title {
  margin: 0; // m-0
  margin-bottom: 0.75rem; // mb-3
  font-size: 1rem; // text-base
  line-height: 1.5rem; // text-base
  font-weight: 500; // font-medium
}

// 元信息行（flex-c 提供了 display:flex; align-items:center）
.card-meta {
  gap: 1rem; // gap-4
  font-size: 0.75rem; // text-xs
  line-height: 1rem; // text-xs
  color: var(--art-gray-600); // text-g-600
}

// 元信息项（flex-c 提供了 display:flex; align-items:center）
.meta-item {
  gap: 0.25rem; // gap-1
}

// 元信息图标
.meta-icon {
  font-size: 1rem; // text-base
  line-height: 1.5rem; // text-base
}
</style>
