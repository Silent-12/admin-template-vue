/** 用户管理页私有类型定义 */

import type { UserListItem as ApiUserListItem, UserSearchParams } from '@/types/api/system-manage'

/**
 * 用户弹窗类型
 * @description 定义用户新增和编辑弹窗的业务模式。
 */
export type DialogType = 'add' | 'edit'

/** 用户列表项类型别名 */
export type UserListItem = ApiUserListItem

/** 用户搜索组件 Props */
export interface UserSearchProps {
  /** 搜索表单双向绑定值 */
  modelValue: UserSearchParams
}

/** 用户搜索组件 Emits */
export interface UserSearchEmits {
  (e: 'update:modelValue', value: UserSearchParams): void
  (e: 'search', params: UserSearchParams): void
  (e: 'reset'): void
}

/** 用户弹窗组件 Props */
export interface UserDialogProps {
  /** 弹窗是否可见（支持 v-model 双向绑定） */
  modelValue: boolean
  /** 弹窗类型 */
  type: DialogType
  /** 用户数据（编辑时传入） */
  userData?: Partial<ApiUserListItem>
}

/** 用户弹窗组件 Emits */
export interface UserDialogEmits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit'): void
}
