/**
 * 组件类型定义模块
 *
 * 提供项目组件的类型定义
 *
 * ## 主要功能
 *
 * - 表格列配置类型
 * - 表单配置类型（见 ./form）
 *
 * ## 使用场景
 *
 * - 组件 Props 类型约束
 * - 组件配置类型定义
 * - 组件事件参数类型
 */

import type { PaginationProps, TableColumnCtx } from 'element-plus'

/**
 * 表格列配置接口
 * @description 沿用原生列属性和 formatter，slotName 指定 AoTable 上的自定义插槽。
 */
export interface ColumnOption<T extends Record<string, any> = any> {
  // 列类型
  type?: 'selection' | 'expand' | 'index' | 'globalIndex'
  // 可选的数据字段名，沿用 Element Plus 原生点路径取值，例如 meta.title
  prop?: string
  // 可选的列唯一标识，用于无数据字段或多列使用同一字段的场景
  columnKey?: string
  // 列标题
  label?: string
  // 列宽度
  width?: string | number
  // 最小列宽度
  minWidth?: string | number
  // 固定列
  fixed?: boolean | 'left' | 'right'
  // 是否可排序
  sortable?: boolean | 'custom'
  // 过滤器选项
  filters?: any[]
  // 过滤方法
  filterMethod?: (value: any, row: T) => boolean
  // 过滤器位置
  filterPlacement?: string
  // 是否禁用
  disabled?: boolean
  // 是否显示列
  visible?: boolean
  // 是否选中显示
  checked?: boolean
  // 可选的原生单元格格式化函数
  formatter?: TableColumnCtx<T>['formatter']
  // 可选的 AoTable 命名插槽，填写即启用，不默认取 prop
  slotName?: string
  // 其他属性
  [key: string]: any
}

/**
 * 表格分页状态
 * @description 由页面持有；AoTable 通过原生 size-change/current-change 事件上报交互。
 */
export interface TablePaginationState {
  // 当前页码
  currentPage: number
  // 每页条数
  pageSize: number
  // 总条数
  total: number
}

/**
 * 分页器外观配置
 * @description 复用 Element Plus 原生属性类型，分页器在表格底部固定靠右。
 */
export type TablePaginationOptions = Pick<
  PaginationProps,
  'pageSizes' | 'layout' | 'background' | 'hideOnSinglePage' | 'size' | 'pagerCount'
>

export * from './form'
