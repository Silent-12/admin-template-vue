<!-- 表单组件 -->
<!-- 支持常用表单组件、自定义组件、插槽、校验、隐藏表单项 -->
<!-- 写法同 ElementPlus 官方文档组件，把属性写在 props 里面就可以了 -->
<!-- 与 AoSearchBar 的契约差异：本组件直接对 v-model 对象做受控变更（就地修改，不整体替换）；AoSearchBar 内部持有状态并整体上报 -->
<!-- 对外 API：ref 可调用 validate / reset / getOutput；getOutput 允许外部在不触发提交事件时读取清洗后的表单输出，sanitizeOutput 可按业务覆盖清洗策略 -->
<template>
  <section class="form-section">
    <ElForm
      ref="formRef"
      :model="modelValue"
      :label-position="labelPosition"
      v-bind="{ ...$attrs }"
    >
      <ElRow class="form-row" :gutter="gutter">
        <ElCol
          v-for="item in visibleFormItems"
          :key="item.key"
          :xs="getColSpan(item.span, 'xs')"
          :sm="getColSpan(item.span, 'sm')"
          :md="getColSpan(item.span, 'md')"
          :lg="getColSpan(item.span, 'lg')"
          :xl="getColSpan(item.span, 'xl')"
        >
          <ElFormItem
            :prop="item.key"
            :label-width="item.label ? item.labelWidth || labelWidth : undefined"
          >
            <template #label v-if="item.label">
              <component v-if="typeof item.label !== 'string'" :is="item.label" />
              <span v-else>{{ item.label }}</span>
            </template>
            <slot :name="item.key" :item="item" :modelValue="modelValue">
              <component
                :is="getRenderComponent(item)"
                :model-value="getFieldValue(item.key)"
                @update:model-value="setFieldValue(item.key, $event)"
                v-bind="getItemProps(item)"
              >
                <!-- 下拉选择 -->
                <template v-if="item.type === 'select' && getOptions(item).length">
                  <ElOption
                    v-for="option in getOptions(item)"
                    v-bind="option"
                    :key="String(option.value)"
                  />
                </template>

                <!-- 复选框组 -->
                <template v-if="item.type === 'checkboxgroup' && getOptions(item).length">
                  <ElCheckbox
                    v-for="option in getOptions(item)"
                    v-bind="option"
                    :key="String(option.value)"
                  />
                </template>

                <!-- 单选框组 -->
                <template v-if="item.type === 'radiogroup' && getOptions(item).length">
                  <ElRadio
                    v-for="option in getOptions(item)"
                    v-bind="option"
                    :key="String(option.value)"
                  />
                </template>

                <!-- 动态插槽支持 -->
                <template
                  v-for="(slotFn, slotName) in getValidSlots(item)"
                  :key="slotName"
                  #[slotName]
                >
                  <component :is="slotFn" />
                </template>
              </component>
            </slot>
          </ElFormItem>
        </ElCol>
        <ElCol :xs="24" :sm="24" :md="span" :lg="span" :xl="span" class="form-action-col">
          <div class="form-action-buttons" :style="actionButtonsStyle">
            <div class="form-button-group">
              <ElButton v-if="showReset" class="reset-button" @click="handleReset" v-ripple>
                {{ t('table.form.reset') }}
              </ElButton>
              <ElButton
                v-if="showSubmit"
                type="primary"
                class="submit-button"
                @click="handleSubmit"
                v-ripple
                :disabled="disabledSubmit"
              >
                {{ t('table.form.submit') }}
              </ElButton>
            </div>
          </div>
        </ElCol>
      </ElRow>
    </ElForm>
  </section>
</template>

<script setup lang="ts">
  import { computed, ref, toRefs, useTemplateRef, watch } from 'vue'
  import type { Component, VNode } from 'vue'
  import {
    ElButton,
    ElCheckbox,
    ElCol,
    ElForm,
    ElFormItem,
    ElOption,
    ElRadio,
    ElRow
  } from 'element-plus'
  import type { FormInstance } from 'element-plus'
  import { useWindowSize } from '@vueuse/core'
  import { useI18n } from 'vue-i18n'
  import type { FormItemBase, ResponsiveBreakpoint, SanitizeOutputOptions } from '@/types/component'
  import {
    DEFAULT_SANITIZE_OPTIONS,
    FORM_MOBILE_BREAKPOINT,
    calculateResponsiveSpan,
    cloneModelValue,
    getOptions,
    getRenderComponent,
    getValidSlots,
    getItemProps,
    getValueByPath,
    resolveActionButtonsAlign,
    sanitizeFormOutput,
    setValueByPath
  } from './form-shared'

  defineOptions({ name: 'AoForm' })

  // 表单项配置
  export interface FormItem extends FormItemBase {
    /** 表单项的标签文本或自定义渲染函数 */
    label: string | (() => VNode) | Component
  }

  // 表单配置
  interface FormProps {
    /** 表单数据 */
    items: FormItem[]
    /** 每列的宽度（基于 24 格布局） */
    span?: number
    /** 表单控件间隙 */
    gutter?: number
    /** 表单域标签的位置 */
    labelPosition?: 'left' | 'right' | 'top'
    /** 文字宽度 */
    labelWidth?: string | number
    /** 按钮靠左对齐限制（表单项小于等于该值时） */
    buttonLeftLimit?: number
    /** 是否显示重置按钮 */
    showReset?: boolean
    /** 是否显示提交按钮 */
    showSubmit?: boolean
    /** 是否禁用提交按钮 */
    disabledSubmit?: boolean
    /** 提交时是否清洗空值 */
    sanitizeOutput?: Partial<SanitizeOutputOptions>
  }

  const props = withDefaults(defineProps<FormProps>(), {
    items: () => [],
    span: 6,
    gutter: 12,
    labelPosition: 'right',
    labelWidth: '70px',
    buttonLeftLimit: 2,
    showReset: true,
    showSubmit: true,
    disabledSubmit: false,
    sanitizeOutput: () => ({})
  })

  interface FormEmits {
    reset: []
    submit: [Record<string, any>]
  }

  const emit = defineEmits<FormEmits>()

  const modelValue = defineModel<Record<string, any>>({
    default: () => ({}) as Record<string, any>
  })

  const { width } = useWindowSize()
  const { t } = useI18n()
  const isMobile = computed(() => width.value < FORM_MOBILE_BREAKPOINT)

  const formInstance = useTemplateRef<FormInstance>('formRef')

  // 表单快照：保存组件初始化时的表单值，用于 reset 时恢复默认值
  const initialModelValue = ref<Record<string, any>>({})

  initialModelValue.value = cloneModelValue(modelValue.value)

  /**
   * @description 父级整体替换 v-model 对象时重新快照；就地修改（如编辑回填）不触发，保持重置恢复挂载时初始值的契约
   */
  watch(modelValue, (value) => {
    initialModelValue.value = cloneModelValue(value)
  })

  // 输出时的清洗策略默认偏“接口友好”，但允许按业务覆盖。
  const sanitizeOutputOptions = computed<SanitizeOutputOptions>(() => ({
    ...DEFAULT_SANITIZE_OPTIONS,
    ...props.sanitizeOutput
  }))

  /**
   * @description 读取表单项当前值（key 支持点路径）
   * @param key 表单项唯一标识
   * @return 表单项当前值
   */
  const getFieldValue = (key: string): unknown => getValueByPath(modelValue.value, key)

  /**
   * @description 写入表单项值，清空输入时不保留空字符串
   * @param key 表单项唯一标识
   * @param value 待写入的值
   */
  const setFieldValue = (key: string, value: unknown): void => {
    setValueByPath(modelValue.value, key, value)
  }

  /**
   * 获取列宽 span 值
   * 根据屏幕尺寸智能降级，避免小屏幕上表单项被压缩过小
   */
  const getColSpan = (itemSpan: number | undefined, breakpoint: ResponsiveBreakpoint): number => {
    return calculateResponsiveSpan(itemSpan, span.value, breakpoint)
  }

  /**
   * 可见的表单项
   */
  const visibleFormItems = computed(() => {
    return props.items.filter((item) => !item.hidden)
  })

  /**
   * 操作按钮样式
   */
  const actionButtonsStyle = computed(() => ({
    'justify-content': resolveActionButtonsAlign(
      isMobile.value,
      props.items.filter((item) => !item.hidden).length,
      props.buttonLeftLimit
    )
  }))

  /**
   * @description 获取清洗后的表单输出，供外部在不触发提交事件时主动读取
   * @return 清洗后的表单输出
   */
  const getSanitizedOutput = (): Record<string, any> => {
    return sanitizeFormOutput<Record<string, any>>(modelValue.value, sanitizeOutputOptions.value)
  }

  /**
   * @description 处理重置事件：重置表单字段并恢复初始表单值（保留默认值而不是简单清空），最后上报页面
   */
  const handleReset = () => {
    // 重置表单字段（UI 层）
    formInstance.value?.resetFields()

    // 恢复初始表单值，保留默认值而不是简单清空。
    Object.keys(modelValue.value).forEach((key) => {
      delete modelValue.value[key]
    })
    Object.assign(modelValue.value, cloneModelValue(initialModelValue.value))

    // 触发 reset 事件
    emit('reset')
  }

  /**
   * @description 处理提交事件，先执行表单校验，未通过则不触发提交
   */
  const handleSubmit = async (): Promise<void> => {
    try {
      await formInstance.value?.validate()
    } catch {
      return
    }

    // 对外只抛出清洗后的结果，避免业务层重复过滤空值。
    emit('submit', getSanitizedOutput())
  }

  defineExpose({
    validate: (
      ...args: Parameters<FormInstance['validate']>
    ): ReturnType<FormInstance['validate']> => formInstance.value!.validate(...args),
    reset: handleReset,
    // 允许外部在不触发提交事件时主动获取清洗后的输出。
    getOutput: getSanitizedOutput
  })

  // 解构 props 以便在模板中直接使用
  const { span, gutter, labelPosition, labelWidth } = toRefs(props)
</script>

<style scoped lang="scss">
  // 表单容器
  .form-section {
    padding: 1rem 1rem 0;
    @media (width >= 48rem) {
      padding-top: 1rem;
      padding-right: 1rem;
      padding-left: 1rem;
    }
  }

  // 表单行
  .form-row {
    display: flex;
    flex-wrap: wrap;
  }

  // 操作按钮列
  .form-action-col {
    flex: 1 1 0%;
    max-width: 100%;
  }

  // 操作按钮容器
  .form-action-buttons {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 0.75rem;
    @media (width >= 48rem) {
      flex-direction: row;
      gap: 0.5rem;
      align-items: stretch;
    }
  }

  // 按钮组
  .form-button-group {
    display: flex;
    gap: 0.5rem;
    @media (width >= 48rem) {
      justify-content: center;
    }
  }
</style>
