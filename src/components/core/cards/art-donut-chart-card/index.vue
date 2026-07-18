<!-- 环型图卡片 -->
<template>
  <div class="art-card donut-chart-card" :style="{ height: `${height}rem` }">
    <div class="card-inner">
      <div class="card-content">
        <div class="left-column flex-b">
          <p class="card-title">
            {{ title }}
          </p>
          <div>
            <p class="card-value">
              {{ formatNumber(value) }}
            </p>
            <div class="card-percentage" :class="percentage > 0 ? 'is-positive' : 'is-negative'">
              {{ percentage > 0 ? '+' : '' }}{{ percentage }}%
              <span v-if="percentageLabel">{{ percentageLabel }}</span>
            </div>
          </div>
          <div class="card-legend">
            <div v-if="currentValue" class="legend-item flex-cc">
              <div class="legend-dot is-current"></div>
              {{ currentValue }}
            </div>
            <div v-if="previousValue" class="legend-item flex-cc">
              <div class="legend-dot is-previous"></div>
              {{ previousValue }}
            </div>
          </div>
        </div>
        <div class="right-column flex-c">
          <div ref="chartRef" class="chart-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { type EChartsOption } from '@/plugins/echarts'
  import { useChartOps, useChartComponent } from '@/hooks/core/useChart'

  defineOptions({ name: 'ArtDonutChartCard' })

  interface Props {
    /** 数值 */
    value: number
    /** 标题 */
    title: string
    /** 百分比 */
    percentage: number
    /** 百分比标签 */
    percentageLabel?: string
    /** 当前年份 */
    currentValue?: string
    /** 去年年份 */
    previousValue?: string
    /** 高度 */
    height?: number
    /** 颜色 */
    color?: string
    /** 半径 */
    radius?: [string, string]
    /** 数据 */
    data: [number, number]
  }

  const props = withDefaults(defineProps<Props>(), {
    height: 9,
    radius: () => ['70%', '90%'],
    data: () => [0, 0]
  })

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  // 使用新的图表组件抽象
  const { chartRef } = useChartComponent({
    props: {
      height: `${props.height}rem`,
      loading: false,
      isEmpty: props.data.every((val) => val === 0)
    },
    checkEmpty: () => props.data.every((val) => val === 0),
    watchSources: [
      () => props.data,
      () => props.color,
      () => props.radius,
      () => props.currentValue,
      () => props.previousValue
    ],
    generateOptions: (): EChartsOption => {
      const computedColor = props.color || useChartOps().themeColor

      return {
        series: [
          {
            type: 'pie',
            radius: props.radius,
            avoidLabelOverlap: false,
            label: {
              show: false
            },
            data: [
              {
                value: props.data[0],
                name: props.currentValue,
                itemStyle: { color: computedColor }
              },
              {
                value: props.data[1],
                name: props.previousValue,
                itemStyle: { color: '#e6e8f7' }
              }
            ]
          }
        ]
      }
    }
  })
</script>

<style scoped lang="scss">
  // 环型图卡片容器
  .donut-chart-card {
    overflow: hidden; // overflow-hidden
  }

  // 内层容器
  .card-inner {
    display: flex; // flex
    box-sizing: border-box; // box-border
    height: 100%; // h-full
    padding: 1.25rem; // p-5
    padding-right: 0.5rem; // pr-2
  }

  // 内容行
  .card-content {
    display: flex; // flex
    width: 100%; // w-full
    align-items: flex-start; // items-start
    gap: 1.25rem; // gap-5
  }

  // 左侧文本列（flex-b 提供了 display:flex; justify-content:space-between）
  .left-column {
    flex-direction: column; // flex-col
    height: 100%; // h-full
    flex: 1 1 0%; // flex-1
  }

  // 标题
  .card-title {
    margin: 0; // m-0
    font-size: 1.25rem; // text-xl
    line-height: 1.25; // leading-tight 覆盖 text-xl 的 line-height
    font-weight: 500; // font-medium
    color: var(--art-gray-900); // text-g-900
  }

  // 数值
  .card-value {
    margin: 0; // m-0
    margin-top: 0.625rem; // mt-2.5
    font-size: 1.25rem; // text-xl
    line-height: 1.25; // leading-tight
    font-weight: 500; // font-medium
    color: var(--art-gray-900); // text-g-900
  }

  // 百分比
  .card-percentage {
    margin-top: 0.375rem; // mt-1.5
    font-size: 0.75rem; // text-xs
    line-height: 1rem; // text-xs
    font-weight: 500; // font-medium

    // 正数显示为成功色
    &.is-positive {
      color: var(--art-success); // text-success
    }

    // 负数显示为危险色
    &.is-negative {
      color: var(--art-danger); // text-danger
    }
  }

  // 图例容器
  .card-legend {
    margin-top: 0.5rem; // mt-2
    display: flex; // flex
    gap: 1rem; // gap-4
    font-size: 0.75rem; // text-xs
    line-height: 1rem; // text-xs
    color: var(--art-gray-600); // text-g-600
  }

  // 图例项（flex-cc 提供了 display:flex; align-items:center; justify-content:center）
  .legend-item {
    // 依赖全局 flex-cc
  }

  // 图例圆点
  .legend-dot {
    width: 0.5rem; // size-2 (2 * 0.25rem)
    height: 0.5rem; // size-2
    margin-right: 0.5rem; // mr-2
    border-radius: 0.25rem; // rounded

    // 当前值使用主题色（bg-theme/100 表示 100% 不透明）
    &.is-current {
      background: var(--theme-color); // bg-theme/100
    }

    // 上期值使用灰色
    &.is-previous {
      background: var(--art-gray-400); // bg-g-400
    }
  }

  // 右侧图表列（flex-c 提供了 display:flex; align-items:center）
  .right-column {
    height: 100%; // h-full
    max-width: 10rem; // max-w-40 (40 * 0.25rem)
    flex: 1 1 0%; // flex-1
  }

  // 图表容器
  .chart-container {
    height: 7.5rem; // h-30 (30 * 0.25rem)
    width: 100%; // w-full
  }
</style>
