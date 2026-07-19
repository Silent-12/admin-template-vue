<template>
  <div class="ao-card active-user">
    <AoBarChart
      class="active-user-chart"
      barWidth="50%"
      height="13.7rem"
      :showAxisLine="false"
      :data="chartData"
      :xAxisData="xAxisLabels"
    />
    <div class="active-user-info">
      <h3 class="active-user-title">用户概述</h3>
      <p class="active-user-desc">比上周 <span class="active-user-up">+23%</span></p>
      <p class="active-user-desc"
        >我们为您创建了多个选项，可将它们组合在一起并定制为像素完美的页面</p
      >
    </div>
    <div class="active-user-stats flex-b">
      <div class="active-user-stat-item" v-for="(item, index) in list" :key="index">
        <p class="active-user-stat-num">{{ item.num }}</p>
        <p class="active-user-stat-name">{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface UserStatItem {
    name: string
    num: string
  }

  // 最近9个月
  const xAxisLabels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月']

  // 每月活跃用户数
  const chartData = [160, 100, 150, 80, 190, 100, 175, 120, 160]

  /**
   * 用户统计数据列表
   * 包含总用户量、总访问量、日访问量和周同比等关键指标
   */
  const list: UserStatItem[] = [
    { name: '总用户量', num: '32k' },
    { name: '总访问量', num: '128k' },
    { name: '日访问量', num: '1.2k' },
    { name: '周同比', num: '+5%' }
  ]
</script>

<style scoped lang="scss">
  // 活跃用户卡片容器（h-105 p-4 box-border mb-5 max-sm:mb-4）
  .active-user {
    box-sizing: border-box; // box-border
    height: 26.25rem; // h-105
    padding: 1rem; // p-4
    margin-bottom: 1.25rem; // mb-5

    @media (width <= 39.99rem) {
      // max-sm:mb-4
      margin-bottom: 1rem;
    }
  }

  // 柱状图（box-border p-2）
  .active-user-chart {
    box-sizing: border-box; // box-border
    padding: 0.5rem; // p-2
  }

  // 信息块（ml-1）
  .active-user-info {
    margin-left: 0.25rem; // ml-1
  }

  // 标题（mt-5 text-lg font-medium）
  .active-user-title {
    margin-top: 1.25rem; // mt-5
    font-size: 1.125rem; // text-lg
    font-weight: 500; // font-medium
    line-height: 1.75rem; // text-lg
  }

  // 描述文字（mt-1 text-sm）
  .active-user-desc {
    margin-top: 0.25rem; // mt-1
    font-size: 0.875rem; // text-sm
    line-height: 1.25rem; // text-sm
  }

  // 上升百分比（text-success font-medium）
  .active-user-up {
    font-weight: 500; // font-medium
    color: var(--ao-success); // text-success
  }

  // 统计数据行（mt-2）
  .active-user-stats {
    margin-top: 0.5rem; // mt-2
  }

  // 单个统计项（flex-1）
  .active-user-stat-item {
    flex: 1 1 0%; // flex-1
  }

  // 统计数值（text-2xl text-g-900）
  .active-user-stat-num {
    font-size: 1.5rem; // text-2xl
    line-height: 2rem; // text-2xl
    color: var(--ao-gray-900); // text-g-900
  }

  // 统计名称（text-xs text-g-500）
  .active-user-stat-name {
    font-size: 0.75rem; // text-xs
    line-height: 1rem; // text-xs
    color: var(--ao-gray-500); // text-g-500
  }
</style>
