<template>
  <div class="ao-card dynamic-stats">
    <div class="ao-card-header">
      <div class="title">
        <h4>动态</h4>
        <p>新增<span class="dynamic-stats-success">+6</span></p>
      </div>
    </div>

    <div class="dynamic-stats-scroll">
      <ElScrollbar>
        <div class="dynamic-stats-item" v-for="(item, index) in list" :key="index">
          <span class="dynamic-stats-username">{{ item.username }}</span>
          <span class="dynamic-stats-type">{{ item.type }}</span>
          <span class="dynamic-stats-target">{{ item.target }}</span>
        </div>
      </ElScrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface DynamicItem {
    username: string
    type: string
    target: string
  }

  /**
   * 用户动态列表
   * 记录用户的关注、发文、提问、兑换等各类活动
   */
  const list = reactive<DynamicItem[]>([
    {
      username: '中小鱼',
      type: '关注了',
      target: '誶誶淰'
    },
    {
      username: '何小荷',
      type: '发表文章',
      target: 'Vue3 + Typescript + Vite 项目实战笔记'
    },
    {
      username: '中小鱼',
      type: '关注了',
      target: '誶誶淰'
    },
    {
      username: '何小荷',
      type: '发表文章',
      target: 'Vue3 + Typescript + Vite 项目实战笔记'
    },
    {
      username: '誶誶淰',
      type: '提出问题',
      target: '主题可以配置吗'
    },
    {
      username: '发呆草',
      type: '兑换了物品',
      target: '《奇特的一生》'
    },
    {
      username: '甜筒',
      type: '关闭了问题',
      target: '发呆草'
    },
    {
      username: '冷月呆呆',
      type: '兑换了物品',
      target: '《高效人士的七个习惯》'
    }
  ])
</script>

<style scoped lang="scss">
  // 动态卡片容器（h-128 p-5 mb-5 max-sm:mb-4）
  .dynamic-stats {
    height: 32rem; // h-128
    padding: 1.25rem; // p-5
    margin-bottom: 1.25rem; // mb-5

    @media (width <= 39.99rem) {
      // max-sm:mb-4
      margin-bottom: 1rem;
    }
  }

  // 新增数（text-success）
  .dynamic-stats-success {
    color: var(--ao-success);
  }

  // 滚动区域（h-9/10 mt-2 overflow-hidden）
  .dynamic-stats-scroll {
    height: 90%; // h-9/10
    margin-top: 0.5rem; // mt-2
    overflow: hidden; // overflow-hidden
  }

  // 单条动态（h-17.5 leading-17.5 border-b border-g-300 text-sm overflow-hidden last:border-b-0）
  // 说明：原 leading-17.5 与容器等高，使单行文字垂直居中；line-height 取 4.375rem
  .dynamic-stats-item {
    height: 4.375rem; // h-17.5
    overflow: hidden; // overflow-hidden
    font-size: 0.875rem; // text-sm
    line-height: 4.375rem; // leading-17.5（与高度一致，实现垂直居中）
    border-bottom: 1px solid var(--ao-gray-300); // border-b border-g-300

    &:last-child {
      // last:border-b-0
      border-bottom: 0;
    }
  }

  // 用户名（text-g-800 font-medium）
  .dynamic-stats-username {
    font-weight: 500; // font-medium
    color: var(--ao-gray-800); // text-g-800
  }

  // 动态类型（mx-2 text-g-600）
  .dynamic-stats-type {
    margin-right: 0.5rem; // mx-2
    margin-left: 0.5rem; // mx-2
    color: var(--ao-gray-600); // text-g-600
  }

  // 目标对象（text-theme）
  .dynamic-stats-target {
    color: var(--theme-color); // text-theme
  }
</style>
