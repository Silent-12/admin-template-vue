<template>
  <AoDialog
    :title="isEdit ? '编辑项目' : '新增项目'"
    v-model="visible"
    width="500px"
    :close-on-click-modal="false"
    @closed="handleClosed"
  >
    <AoForm
      ref="formRef"
      v-model="formData"
      :items="formItems"
      :rules="rules"
      label-width="100px"
      :span="24"
      :gutter="0"
      :show-reset="false"
      :show-submit="false"
      v-loading="loading"
    />

    <template #footer>
      <div>
        <ElButton @click="visible = false">取消</ElButton>
        <ElButton type="primary" :loading="submitLoading" @click="handleSubmit">确定</ElButton>
      </div>
    </template>
  </AoDialog>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { ElButton } from 'element-plus'
  import type { FormRules } from 'element-plus'
  import AoForm, { type FormItem } from '@/components/forms/AoForm.vue'
  import type {
    ReleaseProjectItem,
    CreateReleaseProjectParams,
    UpdateReleaseProjectParams
  } from '@/types/api/versionControl'
  import { fetchCreateReleaseProject, fetchUpdateReleaseProject } from '@/api/versionControl/releaseProject'

  defineOptions({
    name: 'ProjectForm'
  })

  const emit = defineEmits<{
    (e: 'success'): void
  }>()

  // 弹窗与提交状态
  const visible = ref(false)
  const loading = ref(false)
  const submitLoading = ref(false)
  // 当前操作上下文
  const isEdit = ref(false)
  const currentAppId = ref('')
  // 表单实例
  const formRef = ref<InstanceType<typeof AoForm>>()
  // 表单数据
  const formData = reactive<{
    name: string
    description: string
  }>({
    name: '',
    description: ''
  })
  // 表单校验规则
  const rules = reactive<FormRules>({
    name: [
      { required: true, message: '请输入项目名称', trigger: 'blur' },
      { max: 255, message: '长度不能超过255个字符', trigger: 'blur' }
    ],
    description: [{ max: 500, message: '长度不能超过500个字符', trigger: 'blur' }]
  })

  // 表单项配置
  const formItems: FormItem[] = [
    {
      label: '项目名称',
      key: 'name',
      type: 'input',
      props: {
        placeholder: '请输入项目名称',
        maxlength: 255,
        showWordLimit: true
      }
    },
    {
      label: '项目描述',
      key: 'description',
      type: 'input',
      props: {
        type: 'textarea',
        rows: 4,
        placeholder: '请输入项目描述',
        maxlength: 500,
        showWordLimit: true
      }
    }
  ]

  /**
   * @description 打开项目弹窗，并根据是否传入项目数据初始化新增或编辑态
   * @param {ReleaseProjectItem} [row] 选中的项目数据，不传则为新增
   * @return {void} 无返回值
   */
  const open = (row?: ReleaseProjectItem) => {
    isEdit.value = !!row
    visible.value = true

    if (row) {
      currentAppId.value = row.appId
      formData.name = row.name
      formData.description = row.description || ''
    } else {
      currentAppId.value = ''
      formData.name = ''
      formData.description = ''
    }
  }

  /**
   * @description 校验项目表单并提交新增或编辑请求，成功后关闭弹窗并通知父组件刷新
   * @return {Promise<void>} 表单提交流程执行完成
   */
  const handleSubmit = async () => {
    const form = formRef.value
    if (!form) return

    const valid = (await form.validate()?.catch(() => false)) ?? false
    if (!valid || !formData.name?.trim()) return

    try {
      submitLoading.value = true
      if (isEdit.value) {
        const params: UpdateReleaseProjectParams = {
          name: formData.name,
          description: formData.description
        }
        await fetchUpdateReleaseProject(currentAppId.value, params)
      } else {
        const params: CreateReleaseProjectParams = {
          name: formData.name,
          description: formData.description
        }
        await fetchCreateReleaseProject(params)
      }
      visible.value = false
      emit('success')
    } catch (error) {
      console.error('提交失败:', error)
    } finally {
      submitLoading.value = false
    }
  }

  /**
   * @description 在弹窗关闭后重置表单校验状态与字段值
   * @return {void} 无返回值
   */
  const handleClosed = () => {
    formRef.value?.reset()
  }

  defineExpose({
    open
  })
</script>
