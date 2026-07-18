<template>
  <ElRow :gutter="20" class="card-list-row">
    <ElCol v-for="(item, index) in dataList" :key="index" :sm="12" :md="6" :lg="6">
      <div class="card-list-item art-card">
        <span class="card-list-des">{{ item.des }}</span>
        <ArtCountTo class="card-list-num" :target="item.num" :duration="1300" />
        <div class="card-list-change flex-c">
          <span class="card-list-change-label">较上周</span>
          <span
            class="card-list-change-value"
            :class="[item.change.indexOf('+') === -1 ? 'card-list-change-down' : 'card-list-change-up']"
          >
            {{ item.change }}
          </span>
        </div>
        <div class="card-list-icon-wrapper flex-cc">
          <ArtSvgIcon :icon="item.icon" class="card-list-icon" />
        </div>
      </div>
    </ElCol>
  </ElRow>
</template>

<script setup lang="ts">
  interface CardDataItem {
    des: string
    icon: string
    startVal: number
    duration: number
    num: number
    change: string
  }

  /**
   * 卡片统计数据列表
   * 展示总访问次数、在线访客数、点击量和新用户等核心数据指标
   */
  const dataList = reactive<CardDataItem[]>([
    {
      des: '总访问次数',
      icon: 'ri:pie-chart-line',
      startVal: 0,
      duration: 1000,
      num: 9120,
      change: '+20%'
    },
    {
      des: '在线访客数',
      icon: 'ri:group-line',
      startVal: 0,
      duration: 1000,
      num: 182,
      change: '+10%'
    },
    {
      des: '点击量',
      icon: 'ri:fire-line',
      startVal: 0,
      duration: 1000,
      num: 9520,
      change: '-12%'
    },
    {
      des: '新用户',
      icon: 'ri:progress-2-line',
      startVal: 0,
      duration: 1000,
      num: 156,
      change: '+30%'
    }
  ])
</script>

<style scoped lang="scss">
// 行容器（flex）
.card-list-row {
  display: flex; // flex
}

// 卡片项（relative flex flex-col justify-center h-35 px-5 mb-5 max-sm:mb-4）
.card-list-item {
  position: relative; // relative
  display: flex; // flex
  flex-direction: column; // flex-col
  justify-content: center; // justify-center
  height: 8.75rem; // h-35
  padding-left: 1.25rem; // px-5
  padding-right: 1.25rem; // px-5
  margin-bottom: 1.25rem; // mb-5

  @media (max-width: 39.99rem) {
    // max-sm:mb-4
    margin-bottom: 1rem;
  }
}

// 描述文字（text-g-700 text-sm）
.card-list-des {
  color: var(--art-gray-700); // text-g-700
  font-size: 0.875rem; // text-sm
  line-height: 1.25rem; // text-sm
}

// 数字（text-[26px] font-medium mt-2）
.card-list-num {
  margin-top: 0.5rem; // mt-2
  font-size: 26px; // text-[26px]
  font-weight: 500; // font-medium
}

// 变化信息行（mt-1）
.card-list-change {
  margin-top: 0.25rem; // mt-1
}

// "较上周" 标签（text-xs text-g-600）
.card-list-change-label {
  font-size: 0.75rem; // text-xs
  line-height: 1rem; // text-xs
  color: var(--art-gray-600); // text-g-600
}

// 变化数值（ml-1 text-xs font-semibold）
.card-list-change-value {
  margin-left: 0.25rem; // ml-1
  font-size: 0.75rem; // text-xs
  line-height: 1rem; // text-xs
  font-weight: 600; // font-semibold
}

// 上升（text-success）
.card-list-change-up {
  color: var(--art-success);
}

// 下降（text-danger）
.card-list-change-down {
  color: var(--art-danger);
}

// 图标外层容器（absolute top-0 bottom-0 right-5 m-auto size-12.5 rounded-xl bg-theme/10）
.card-list-icon-wrapper {
  position: absolute; // absolute
  top: 0; // top-0
  bottom: 0; // bottom-0
  right: 1.25rem; // right-5
  margin: auto; // m-auto
  width: 3.125rem; // size-12.5
  height: 3.125rem; // size-12.5
  border-radius: 0.75rem; // rounded-xl
  // bg-theme/10：主题色 10% 透明度
  background: color-mix(in srgb, var(--theme-color) 10%, transparent);
}

// 图标（text-xl text-theme）
.card-list-icon {
  font-size: 1.25rem; // text-xl
  line-height: 1.75rem; // text-xl
  color: var(--theme-color); // text-theme
}
</style>
