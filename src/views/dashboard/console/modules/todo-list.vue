<template>
  <div class="ao-card todo-list">
    <div class="ao-card-header">
      <div class="title">
        <h4>代办事项</h4>
        <p>待处理<span class="todo-list-danger">3</span></p>
      </div>
    </div>

    <div class="todo-list-scroll">
      <ElScrollbar>
        <div class="todo-list-item flex-cb" v-for="(item, index) in list" :key="index">
          <div>
            <p class="todo-list-username">{{ item.username }}</p>
            <p class="todo-list-date">{{ item.date }}</p>
          </div>
          <ElCheckbox v-model="item.complate" />
        </div>
      </ElScrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface TodoItem {
    username: string
    date: string
    complate: boolean
  }

  /**
   * 待办事项列表
   * 记录每日工作任务及完成状态
   */
  const list = reactive<TodoItem[]>([
    {
      username: '查看今天工作内容',
      date: '上午 09:30',
      complate: true
    },
    {
      username: '回复邮件',
      date: '上午 10:30',
      complate: true
    },
    {
      username: '工作汇报整理',
      date: '上午 11:00',
      complate: true
    },
    {
      username: '产品需求会议',
      date: '下午 02:00',
      complate: false
    },
    {
      username: '整理会议内容',
      date: '下午 03:30',
      complate: false
    },
    {
      username: '明天工作计划',
      date: '下午 06:30',
      complate: false
    }
  ])
</script>

<style scoped lang="scss">
  // 待办列表容器（h-128 p-5 mb-5 max-sm:mb-4）
  .todo-list {
    height: 32rem; // h-128
    padding: 1.25rem; // p-5
    margin-bottom: 1.25rem; // mb-5

    @media (width <= 39.99rem) {
      // max-sm:mb-4
      margin-bottom: 1rem;
    }
  }

  // 待处理数字（text-danger）
  .todo-list-danger {
    color: var(--ao-danger);
  }

  // 可滚动区域（h-[calc(100%-40px)] overflow-auto）
  .todo-list-scroll {
    height: calc(100% - 40px);
    overflow: auto;
  }

  // 单个待办项（flex-cb h-17.5 border-b border-g-300 text-sm last:border-b-0）
  .todo-list-item {
    height: 4.375rem; // h-17.5
    font-size: 0.875rem; // text-sm
    line-height: 1.25rem; // text-sm
    border-bottom: 1px solid var(--ao-gray-300); // border-b border-g-300

    &:last-child {
      // last:border-b-0
      border-bottom: 0;
    }
  }

  // 待办用户名（text-sm）
  .todo-list-username {
    font-size: 0.875rem; // text-sm
    line-height: 1.25rem; // text-sm
  }

  // 待办日期（text-g-500 mt-1）
  .todo-list-date {
    margin-top: 0.25rem; // mt-1
    color: var(--ao-gray-500); // text-g-500
  }
</style>
