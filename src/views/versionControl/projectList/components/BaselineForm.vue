<template>
  <AoDialog
    title="新增基线"
    v-model="visible"
    width="450px"
    :close-on-click-modal="false"
    @closed="handleClosed"
    append-to-body
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="120px"
      v-loading="loading"
      class="baseline-form"
    >
      <el-form-item label="Version Code" prop="versionCode">
        <el-input-number
          v-model="formData.versionCode"
          :min="1"
          :step="1"
          :precision="0"
          style="width: 100%"
          placeholder="请输入数字版本号"
        />
        <div class="tip">基线的数字版本号，如 100</div>
      </el-form-item>

      <el-form-item label="Version Name" prop="versionName">
        <el-input
          v-model="formData.versionName"
          placeholder="请输入展示版本号"
          maxlength="64"
          show-word-limit
        />
        <div class="tip">基线的展示版本号，如 1.0.0</div>
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
  import type { CreateWgtBaselineParams } from '@/types/api/versionControl'
  import { fetchCreateWgtBaseline } from '@/api/versionControl/wgtProject'

  defineOptions({
    name: 'BaselineForm'
  })

  const emit = defineEmits<{
    (e: 'success'): void
  }>()

  // 弹窗与提交状态
  const visible = ref(false)
  const loading = ref(false)
  const submitLoading = ref(false)
  // 当前项目上下文
  const currentAppid = ref('')
  // 表单实例
  const formRef = ref<FormInstance>()
  // 表单数据
  const formData = reactive<{
    versionCode: number | undefined
    versionName: string
  }>({
    versionCode: undefined,
    versionName: ''
  })

  // 表单校验规则
  const rules = reactive<FormRules>({
    versionCode: [
      { required: true, message: '请输入 Version Code', trigger: 'blur' },
      { type: 'number', message: '必须为数字', trigger: 'blur' }
    ],
    versionName: [
      { required: true, message: '请输入 Version Name', trigger: 'blur' },
      { max: 64, message: '长度不能超过64个字符', trigger: 'blur' }
    ]
  })

  /**
   * @description 打开新增基线弹窗，并初始化当前项目上下文与表单默认值
   * @param {string} appid 项目唯一标识
   * @return {void} 无返回值
   */
  const open = (appid: string) => {
    currentAppid.value = appid
    formData.versionCode = undefined
    formData.versionName = ''
    visible.value = true
  }

  /**
   * @description 校验基线表单并提交新增请求，成功后关闭弹窗并通知父组件刷新
   * @return {Promise<void>} 表单提交流程执行完成
   */
  const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
      if (!valid) return

      try {
        submitLoading.value = true
        const params: CreateWgtBaselineParams = {
          versionCode: formData.versionCode as number,
          versionName: formData.versionName
        }
        await fetchCreateWgtBaseline(currentAppid.value, params)

        visible.value = false
        emit('success')
      } catch (error) {
        console.error('新增基线失败:', error)
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

<style lang="scss" scoped>
  .baseline-form {
    .tip {
      margin-top: 4px;
      font-size: 12px;
      line-height: 1.2;
      color: var(--ao-gray-500);
    }
  }
</style>
