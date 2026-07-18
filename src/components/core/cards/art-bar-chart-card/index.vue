<!-- 柱状图卡片 -->
<template>
  <div class="art-card bar-chart-card" :style="{ height: `${height}rem` }">
    <div class="card-header flex-b">
      <div>
        <p class="card-value">
          {{ value }}
        </p>
        <p class="card-label">{{ label }}</p>
      </div>
      <div
        class="card-percentage"
        :class="[percentage > 0 ? 'is-positive' : '', isMiniChart ? 'is-mini' : '']"
      >
        {{ percentage > 0 ? '+' : '' }}{{ percentage }}%
      </div>
      <div v-if="date" class="card-date">
        {{ date }}
      </div>
    </div>
    <div
      ref="chartRef"
      class="chart-container"
      :class="isMiniChart ? 'is-mini' : ''"
      :style="{ height: isMiniChart ? '60px' : `calc(${height}rem - 5rem)` }"
    ></div>
  </div>
</template>

<script setup lang="ts">
  import { useChartOps, useChartComponent } from '@/hooks/core/useChart'
  import { type EChartsOption } from '@/plugins/echarts'

  defineOptions({ name: 'ArtBarChartCard' })

  interface Props {
    /** 数值 */
    value: number
    /** 标签 */
    label: string
    /** 百分比 +（绿色）-（红色） */
    percentage: number
    /** 日期 */
    date?: string
    /** 高度 */
    height?: number
    /** 颜色 */
    color?: string
    /** 图表数据 */
    chartData: number[]
    /** 柱状图宽度 */
    barWidth?: string
    /** 是否为迷你图表 */
    isMiniChart?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    height: 11,
    barWidth: '26%'
  })

  // 使用新的图表组件抽象
  const { chartRef } = useChartComponent({
    props: {
      height: `${props.height}rem`,
      loading: false,
      isEmpty: !props.chartData?.length || props.chartData.every((val) => val === 0)
    },
    checkEmpty: () => !props.chartData?.length || props.chartData.every((val) => val === 0),
    watchSources: [() => props.chartData, () => props.color, () => props.barWidth],
    generateOptions: (): EChartsOption => {
      const computedColor = props.color || useChartOps().themeColor

      return {
        grid: {
          top: 0,
          right: 0,
          bottom: 15,
          left: 0
        },
        xAxis: {
          type: 'category',
          show: false
        },
        yAxis: {
          type: 'value',
          show: false
        },
        series: [
          {
            data: props.chartData,
            type: 'bar',
            barWidth: props.barWidth,
            itemStyle: {
              color: computedColor,
              borderRadius: 2
            }
          }
        ]
      }
    }
  })
</script>

<style scoped lang="scss">
  // 柱状图卡片容器（保留全局 art-card 样式）
  .bar-chart-card {
    position: relative; // relative
    overflow: hidden; // overflow-hidden
  }

  // 卡片头部（flex-b 提供了 display:flex; justify-content:space-between）
  .card-header {
    align-items: flex-start; // items-start
    margin-bottom: 1.25rem; // mb-5
    padding-left: 1.25rem; // px-5
    padding-right: 1.25rem; // px-5
    padding-top: 1.25rem; // pt-5
  }

  // 数值文本
  .card-value {
    margin: 0; // m-0
    font-size: 1.5rem; // text-2xl
    line-height: 1.25; // leading-tight 覆盖 text-2xl 的 line-height
    font-weight: 500; // font-medium
    color: var(--art-gray-900); // text-g-900
  }

  // 标签文本
  .card-label {
    margin-top: 0.25rem; // mt-1
    font-size: 0.875rem; // text-sm
    line-height: 1.25rem; // text-sm
    color: var(--art-gray-600); // text-g-600
  }

  // 百分比文本
  .card-percentage {
    position: relative;
    font-size: 0.875rem; // text-sm
    line-height: 1.25rem; // text-sm
    font-weight: 500; // font-medium
    color: var(--art-danger); // text-danger

    // 正数显示为成功色
    &.is-positive {
      color: var(--art-success); // text-success
    }

    // 迷你图表时的定位
    &.is-mini {
      position: absolute; // absolute
      bottom: 1.25rem; // bottom-5
    }
  }

  // 日期
  .card-date {
    position: absolute; // absolute
    bottom: 1.25rem; // bottom-5
    right: 1.25rem; // right-5
    font-size: 0.75rem; // text-xs
    line-height: 1rem; // text-xs
    color: var(--art-gray-600); // text-g-600
  }

  // 图表容器
  .chart-container {
    position: absolute; // absolute
    bottom: 0; // bottom-0
    left: 0; // left-0
    right: 0; // right-0
    margin-left: auto; // mx-auto
    margin-right: auto; // mx-auto

    // 迷你图表定位（保留 !important 以覆盖默认定位）
    &.is-mini {
      position: absolute !important; // !absolute
      top: 1.25rem !important; // !top-5
      right: 1.25rem !important; // !right-5
      bottom: auto !important; // !bottom-auto
      left: auto !important; // !left-auto
      height: 3.75rem !important; // !h-15 (15 * 0.25rem)
      width: 40% !important; // !w-4/10
    }
  }
</style>
