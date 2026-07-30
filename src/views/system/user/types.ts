/** 用户管理页私有类型定义 */

import type { DialogType } from '@/types'

/** 用户列表项类型别名 */
export type UserListItem = Api.SystemManage.UserListItem

/** 用户搜索组件 Props */
export interface UserSearchProps {
  /** 搜索表单双向绑定值 */
  modelValue: Api.SystemManage.UserSearchParams
}

/** 用户搜索组件 Emits */
export interface UserSearchEmits {
  (e: 'update:modelValue', value: Api.SystemManage.UserSearchParams): void
  (e: 'search', params: Api.SystemManage.UserSearchParams): void
  (e: 'reset'): void
}

/** 用户弹窗组件 Props */
export interface UserDialogProps {
  /** 弹窗是否可见（支持 v-model 双向绑定） */
  modelValue: boolean
  /** 弹窗类型 */
  type: DialogType
  /** 用户数据（编辑时传入） */
  userData?: Partial<Api.SystemManage.UserListItem>
}

/** 用户弹窗组件 Emits */
export interface UserDialogEmits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit'): void
}
