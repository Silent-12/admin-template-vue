<template>
  <AoDialog
    :title="isEdit ? '编辑项目' : '新增项目'"
    v-model="visible"
    width="500px"
    :close-on-click-modal="false"
    @closed="handleClosed"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px" v-loading="loading">
      <el-form-item label="项目名称" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="请输入项目名称"
          maxlength="255"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="项目描述" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="4"
          placeholder="请输入项目描述"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
      </div>
    </template>
  </AoDialog>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import type {
    WgtProjectItem,
    CreateWgtProjectParams,
    UpdateWgtProjectParams
  } from '@/types/api/versionControl'
  import { fetchCreateWgtProject, fetchUpdateWgtProject } from '@/api/versionControl/wgtProject'

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
  const currentAppid = ref('')
  // 表单实例
  const formRef = ref<FormInstance>()
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

  /**
   * @description 打开项目弹窗，并根据是否传入项目数据初始化新增或编辑态
   * @param {WgtProjectItem} [row] 选中的项目数据，不传则为新增
   * @return {void} 无返回值
   */
  const open = (row?: WgtProjectItem) => {
    isEdit.value = !!row
    visible.value = true

    if (row) {
      currentAppid.value = row.appid
      formData.name = row.name
      formData.description = row.description || ''
    } else {
      currentAppid.value = ''
      formData.name = ''
      formData.description = ''
    }
  }

  /**
   * @description 校验项目表单并提交新增或编辑请求，成功后关闭弹窗并通知父组件刷新
   * @return {Promise<void>} 表单提交流程执行完成
   */
  const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
      if (!valid) return

      try {
        submitLoading.value = true
        if (isEdit.value) {
          const params: UpdateWgtProjectParams = {
            name: formData.name,
            description: formData.description
          }
          await fetchUpdateWgtProject(currentAppid.value, params)
        } else {
          const params: CreateWgtProjectParams = {
            name: formData.name,
            description: formData.description
          }
          await fetchCreateWgtProject(params)
        }
        visible.value = false
        emit('success')
      } catch (error) {
        console.error('提交失败:', error)
      } finally {
        submitLoading.value = false
      }
    })
  }

  /**
   * @description 在弹窗关闭后重置表单校验状态与字段值
   * @return {void} 无返回值
   */
  const handleClosed = () => {
    formRef.value?.resetFields()
  }

  defineExpose({
    open
  })
</script>
