<!-- 折线图卡片 -->
<template>
  <div class="ao-card line-chart-card" :style="{ height: `${height}rem` }">
    <div class="card-header flex-b">
      <div>
        <p class="card-value">
          {{ value }}
        </p>
        <p class="card-label">{{ label }}</p>
      </div>
      <div
        class="card-percentage"
        :class="[percentage > 0 ? 'is-positive' : 'is-negative', isMiniChart ? 'is-mini' : '']"
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
  import { graphic, type EChartsOption } from '@/plugins/echarts'
  import { getCssVar, hexToRgba } from '@/utils/ui'
  import { useChartOps, useChartComponent } from '@/hooks/core/useChart'

  defineOptions({ name: 'AoLineChartCard' })

  interface Props {
    /** 数值 */
    value: number
    /** 标签 */
    label: string
    /** 百分比 */
    percentage: number
    /** 日期 */
    date?: string
    /** 高度 */
    height?: number
    /** 颜色 */
    color?: string
    /** 是否显示区域颜色 */
    showAreaColor?: boolean
    /** 图表数据 */
    chartData: number[]
    /** 是否为迷你图表 */
    isMiniChart?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    height: 11
  })

  // 使用新的图表组件抽象
  const { chartRef } = useChartComponent({
    props: {
      height: `${props.height}rem`,
      loading: false,
      isEmpty: !props.chartData?.length || props.chartData.every((val) => val === 0)
    },
    checkEmpty: () => !props.chartData?.length || props.chartData.every((val) => val === 0),
    watchSources: [() => props.chartData, () => props.color, () => props.showAreaColor],
    generateOptions: (): EChartsOption => {
      const computedColor = props.color || useChartOps().themeColor

      return {
        grid: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        xAxis: {
          type: 'category',
          show: false,
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          show: false
        },
        series: [
          {
            data: props.chartData,
            type: 'line',
            smooth: true,
            showSymbol: false,
            lineStyle: {
              width: 3,
              color: computedColor
            },
            areaStyle: props.showAreaColor
              ? {
                  color: new graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: props.color
                        ? hexToRgba(props.color, 0.2).rgba
                        : hexToRgba(getCssVar('--el-color-primary'), 0.2).rgba
                    },
                    {
                      offset: 1,
                      color: props.color
                        ? hexToRgba(props.color, 0.01).rgba
                        : hexToRgba(getCssVar('--el-color-primary'), 0.01).rgba
                    }
                  ])
                }
              : undefined
          }
        ]
      }
    }
  })
</script>

<style scoped lang="scss">
  // 折线图卡片容器
  .line-chart-card {
    position: relative; // relative
    overflow: hidden; // overflow-hidden
  }

  // 卡片头部（flex-b 提供了 display:flex; justify-content:space-between）
  .card-header {
    align-items: flex-start; // items-start
    padding: 1.25rem; // p-5
    margin-bottom: 0.625rem; // mb-2.5
  }

  // 数值文本
  .card-value {
    font-size: 1.5rem; // text-2xl
    font-weight: 500; // font-medium
    line-height: 1; // leading-none 覆盖 text-2xl 的 line-height
  }

  // 标签文本
  .card-label {
    margin-top: 0.25rem; // mt-1
    font-size: 0.875rem; // text-sm
    line-height: 1.25rem; // text-sm
    color: var(--ao-gray-500); // text-g-500
  }

  // 百分比文本
  .card-percentage {
    position: relative;
    font-size: 0.875rem; // text-sm
    font-weight: 500; // font-medium
    line-height: 1.25rem; // text-sm

    // 正数显示为成功色
    &.is-positive {
      color: var(--ao-success); // text-success
    }

    // 负数显示为危险色
    &.is-negative {
      color: var(--ao-danger); // text-danger
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
    right: 1.25rem; // right-5
    bottom: 1.25rem; // bottom-5
    font-size: 0.75rem; // text-xs
    line-height: 1rem; // text-xs
    color: var(--ao-gray-500); // text-g-500
  }

  // 图表容器
  .chart-container {
    position: absolute; // absolute
    right: 0; // right-0
    bottom: 0; // bottom-0
    left: 0; // left-0
    box-sizing: border-box; // box-border
    width: 100%; // w-full

    // 迷你图表定位（保留 !important 以覆盖默认定位）
    &.is-mini {
      position: absolute !important; // !absolute
      inset: 1.25rem 1.25rem auto auto !important; // !top-5 // !right-5 // !bottom-auto // !left-auto
      width: 40% !important; // !w-4/10
      height: 3.75rem !important; // !h-15 (15 * 0.25rem)
    }
  }
</style>
