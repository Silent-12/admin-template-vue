<template>
  <div class="project-details ao-full-height">
    <ElCard class="ao-table-card">
      <ElTabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <ElTabPane label="User" name="first">User</ElTabPane>
        <ElTabPane label="Config" name="second">Config</ElTabPane>
        <ElTabPane label="Role" name="third">Role</ElTabPane>
        <ElTabPane label="Task" name="fourth">Task</ElTabPane>
      </ElTabs>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import type { TabsPaneContext } from 'element-plus'

  defineOptions({ name: 'ProjectDetails' })

  const activeName = ref('first')

  const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event)
  }
</script>

<style lang="scss" scoped>
  .project-details {
    .ao-table-card {
      margin-top: 0;
    }
  }
</style>
