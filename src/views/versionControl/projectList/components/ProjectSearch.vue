<template>
  <AoSearchBar
    v-model="formData"
    :items="formItems"
    :show-expand="false"
    @reset="handleReset"
    @search="handleSearch"
  />
</template>

<script setup lang="ts">
  import type { WgtProjectSearchParams } from '@/types/api/versionControl'

  defineOptions({ name: 'ProjectSearch' })

  const props = defineProps<{
    modelValue: WgtProjectSearchParams
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: WgtProjectSearchParams): void
    (e: 'search', value: WgtProjectSearchParams): void
    (e: 'reset'): void
  }>()

  /**
   * @description 维护搜索表单与页面查询参数之间的双向绑定。
   */
  const formData = computed({
    get: () => props.modelValue as Record<string, unknown>,
    set: (value) => emit('update:modelValue', value as WgtProjectSearchParams)
  })

  /** 搜索表单配置 */
  const formItems = [
    {
      label: '项目名称',
      key: 'name',
      type: 'input',
      placeholder: '请输入项目名称',
      props: { clearable: true }
    }
  ]

  /**
   * @description 转发搜索表单提交事件。
   * @param params 搜索表单参数。
   */
  const handleSearch = (params: Record<string, unknown>) => {
    emit('search', {
      name: typeof params.name === 'string' ? params.name : undefined
    })
  }

  /**
   * @description 转发搜索表单重置事件。
   */
  const handleReset = () => {
    emit('reset')
  }
</script>
