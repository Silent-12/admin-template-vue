<template>
  <AoSearchBar
    ref="searchBarRef"
    v-model="formData"
    :items="formItems"
    :rules="rules"
    @reset="handleReset"
    @search="handleSearch"
  >
  </AoSearchBar>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import type { RoleSearchProps, RoleSearchEmits, RoleSearchFormParams } from '../types'

  const props = defineProps<RoleSearchProps>()
  const emit = defineEmits<RoleSearchEmits>()

  const searchBarRef = ref()

  /**
   * @description 表单数据双向绑定
   */
  const formData = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
  })

  /**
   * @description 表单校验规则
   */
  const rules = {}

  /**
   * @description 角色状态选项
   */
  const statusOptions = ref([
    { label: '启用', value: true },
    { label: '禁用', value: false }
  ])

  /**
   * @description 搜索表单配置项
   */
  const formItems = computed(() => [
    {
      label: '角色名称',
      key: 'roleName',
      type: 'input',
      placeholder: '请输入角色名称',
      clearable: true
    },
    {
      label: '角色编码',
      key: 'roleCode',
      type: 'input',
      placeholder: '请输入角色编码',
      clearable: true
    },
    {
      label: '角色描述',
      key: 'description',
      type: 'input',
      placeholder: '请输入角色描述',
      clearable: true
    },
    {
      label: '角色状态',
      key: 'enabled',
      type: 'select',
      props: {
        placeholder: '请选择状态',
        options: statusOptions.value,
        clearable: true
      }
    },
    {
      label: '创建日期',
      key: 'daterange',
      type: 'datetime',
      props: {
        style: { width: '100%' },
        placeholder: '请选择日期范围',
        type: 'daterange',
        rangeSeparator: '至',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        valueFormat: 'YYYY-MM-DD',
        shortcuts: [
          { text: '今日', value: [new Date(), new Date()] },
          { text: '最近一周', value: [new Date(Date.now() - 604800000), new Date()] },
          { text: '最近一个月', value: [new Date(Date.now() - 2592000000), new Date()] }
        ]
      }
    }
  ])

  /**
   * @description 处理重置事件
   */
  const handleReset = (): void => {
    emit('reset')
  }

  /**
   * @description 处理搜索事件
   * @param params 搜索参数
   */
  const handleSearch = async (params: RoleSearchFormParams): Promise<void> => {
    await searchBarRef.value.validate()
    emit('search', params)
  }
</script>
