<template>
  <div class="ao-card new-user-card">
    <div class="ao-card-header">
      <div class="title">
        <h4>新用户</h4>
        <p>这个月增长<span class="new-user-success">+20%</span></p>
      </div>
      <ElRadioGroup v-model="radio2">
        <ElRadioButton value="本月" label="本月"></ElRadioButton>
        <ElRadioButton value="上月" label="上月"></ElRadioButton>
        <ElRadioButton value="今年" label="今年"></ElRadioButton>
      </ElRadioGroup>
    </div>
    <AoTable
      class="new-user-table"
      :data="tableData"
      style="width: 100%"
      size="large"
      :border="false"
      :stripe="false"
      :header-cell-style="{ background: 'transparent' }"
    >
      <template #default>
        <ElTableColumn label="头像" prop="avatar" width="150px">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <img class="new-user-avatar" :src="scope.row.avatar" alt="avatar" />
              <span class="new-user-username">{{ scope.row.username }}</span>
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn label="地区" prop="province" />
        <ElTableColumn label="性别" prop="avatar">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span style="margin-left: 10px">{{ scope.row.sex === 1 ? '男' : '女' }}</span>
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn label="进度" width="240">
          <template #default="scope">
            <ElProgress
              :percentage="scope.row.pro"
              :color="scope.row.color"
              :stroke-width="4"
              :aria-label="`${scope.row.username}的完成进度: ${scope.row.pro}%`"
            />
          </template>
        </ElTableColumn>
      </template>
    </AoTable>
  </div>
</template>

<script setup lang="ts">
  import avatar1 from '@/assets/images/avatar/avatar1.webp'
  import avatar2 from '@/assets/images/avatar/avatar2.webp'
  import avatar3 from '@/assets/images/avatar/avatar3.webp'
  import avatar4 from '@/assets/images/avatar/avatar4.webp'
  import avatar5 from '@/assets/images/avatar/avatar5.webp'
  import avatar6 from '@/assets/images/avatar/avatar6.webp'

  interface UserTableItem {
    username: string
    province: string
    sex: 0 | 1
    age: number
    percentage: number
    pro: number
    color: string
    avatar: string
  }

  const ANIMATION_DELAY = 100

  const radio2 = ref('本月')

  /**
   * 新用户表格数据
   * 包含用户基本信息和完成进度
   */
  const tableData = reactive<UserTableItem[]>([
    {
      username: '中小鱼',
      province: '北京',
      sex: 0,
      age: 22,
      percentage: 60,
      pro: 0,
      color: 'var(--ao-primary)',
      avatar: avatar1
    },
    {
      username: '何小荷',
      province: '深圳',
      sex: 1,
      age: 21,
      percentage: 20,
      pro: 0,
      color: 'var(--ao-secondary)',
      avatar: avatar2
    },
    {
      username: '誶誶淰',
      province: '上海',
      sex: 1,
      age: 23,
      percentage: 60,
      pro: 0,
      color: 'var(--ao-warning)',
      avatar: avatar3
    },
    {
      username: '发呆草',
      province: '长沙',
      sex: 0,
      age: 28,
      percentage: 50,
      pro: 0,
      color: 'var(--ao-info)',
      avatar: avatar4
    },
    {
      username: '甜筒',
      province: '浙江',
      sex: 1,
      age: 26,
      percentage: 70,
      pro: 0,
      color: 'var(--ao-error)',
      avatar: avatar5
    },
    {
      username: '冷月呆呆',
      province: '湖北',
      sex: 1,
      age: 25,
      percentage: 90,
      pro: 0,
      color: 'var(--ao-success)',
      avatar: avatar6
    }
  ])

  /**
   * 添加进度条动画效果
   * 延迟后将进度值从 0 更新到目标百分比，触发动画
   */
  const addAnimation = (): void => {
    setTimeout(() => {
      tableData.forEach((item) => {
        item.pro = item.percentage
      })
    }, ANIMATION_DELAY)
  }

  onMounted(() => {
    addAnimation()
  })
</script>

<style lang="scss" scoped>
  // 新用户卡片容器（p-5 h-128 overflow-hidden mb-5 max-sm:mb-4）
  .new-user-card {
    height: 32rem; // h-128
    padding: 1.25rem; // p-5
    margin-bottom: 1.25rem; // mb-5
    overflow: hidden; // overflow-hidden

    @media (width <= 39.99rem) {
      // max-sm:mb-4
      margin-bottom: 1rem;
    }

    // 单选按钮选中态（保留原有 :deep 规则）
    :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
      color: var(--el-color-primary) !important;
      background: transparent !important;
    }
  }

  // 增长率文字（text-success）
  .new-user-success {
    color: var(--ao-success);
  }

  // 表格（w-full）
  .new-user-table {
    width: 100%;
  }

  // 头像（size-9 rounded-lg）
  .new-user-avatar {
    width: 2.25rem; // size-9
    height: 2.25rem; // size-9
    border-radius: 0.5rem; // rounded-lg
  }

  // 用户名（ml-2）
  .new-user-username {
    margin-left: 0.5rem; // ml-2
  }
</style>
