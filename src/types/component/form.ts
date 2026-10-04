/**
 * 表单类型定义模块
 * @description 提供 AoForm 与 AoSearchBar 共享的表单项配置、组件映射与输出清洗类型
 */

import type { Component, VNode } from 'vue'

/**
 * 表单选项数据结构
 * @description 用于 select、checkboxgroup、radiogroup 等选项类表单项
 */
export interface FormOption {
  // 选项值
  value: string | number | boolean
  // 其他属性透传给 ElOption / ElCheckbox / ElRadio（如 label、disabled）
  [key: string]: unknown
}

/**
 * 表单项插槽渲染函数
 * @description 表单项 slots 配置中单个具名插槽的渲染函数签名
 */
export type FormSlotFn = () => VNode

/**
 * 预定义表单组件类型
 * @description 与 form-shared.ts 中 componentMap 的键一一对应，新增组件时由 satisfies 约束同步维护
 */
export type FormComponentType =
  | 'input'
  | 'inputtag'
  | 'number'
  | 'select'
  | 'switch'
  | 'checkbox'
  | 'checkboxgroup'
  | 'radiogroup'
  | 'date'
  | 'daterange'
  | 'datetime'
  | 'datetimerange'
  | 'rate'
  | 'slider'
  | 'cascader'
  | 'timepicker'
  | 'timeselect'
  | 'treeselect'

/**
 * 表单项配置的基础结构
 * @description AoForm 与 AoSearchBar 在此之上扩展各自的字段约束
 */
export interface FormItemBase {
  // 表单项的唯一标识，支持 a.b、a.0.b 这类点路径
  key: string
  // 可选的表单项标签文本或自定义渲染函数
  label?: string | (() => VNode) | Component
  // 可选的标签宽度，会覆盖 Form 的 labelWidth
  labelWidth?: string | number
  // 可选的表单项类型，未命中预定义映射时回退为输入框
  type?: FormComponentType | string
  // 可选的自定义渲染函数或组件，优先级高于 type
  render?: (() => VNode) | Component
  // 是否隐藏该表单项
  hidden?: boolean
  // 可选的列宽，基于 24 格栅格系统
  span?: number
  // 可选的选项数据，也可通过 props.options 传入
  options?: FormOption[]
  // 传递给表单项组件的属性，支持 Element Plus 官方文档中的组件属性
  props?: Record<string, unknown>
  // 可选的插槽配置
  slots?: Record<string, FormSlotFn | undefined>
  // 可选的占位符文本
  placeholder?: string
}

/**
 * 输出清洗策略
 * @description 控制表单输出时空值的移除范围，同时保留 0 与 false 这类有效值
 */
export interface SanitizeOutputOptions {
  // 移除空字符串
  removeEmptyString: boolean
  // 移除空数组
  removeEmptyArray: boolean
  // 移除清洗后为空的对象
  removeEmptyObject: boolean
  // 移除空富文本占位内容，如 <p><br></p>
  removeEmptyRichText: boolean
  // 保留数字 0 这类有效值
  keepZero: boolean
  // 保留 false 这类有效值
  keepFalse: boolean
}

/**
 * 响应式断点
 * @description 基于 Element Plus Grid 24 栅格系统的断点标识，用于表单项列宽降级计算
 */
export type ResponsiveBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
