<template>
  <el-dialog v-bind="$attrs" :align-center="alignCenter" :draggable="draggable">
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  /**
   * @description 基础弹窗组件，基于 el-dialog 封装，默认垂直居中、可拖拽
   */
  defineOptions({
    name: 'AoDialog',
    inheritAttrs: false
  })

  export interface AoDialogProps {
    // 是否水平垂直对齐对话框，默认为 true
    alignCenter?: boolean
    // 为 Dialog 启用可拖拽功能，默认为 true
    draggable?: boolean
  }

  withDefaults(defineProps<AoDialogProps>(), {
    alignCenter: true,
    draggable: true
  })
</script>
