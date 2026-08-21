/**
 * WGT 项目列表项
 * @description 定义 WGT 项目基础信息
 */
export interface WgtProjectItem {
  // 项目主键 ID
  id: number
  // 项目唯一 appid
  appid: string
  // 项目名称
  name: string
  // 项目描述
  description: string | null
  // 创建时间（Unix 时间戳）
  createdAt: number
  // 更新时间（Unix 时间戳）
  updatedAt: number
}

/**
 * 分页元数据
 * @description 定义后端返回的分页信息
 */
export interface PaginationMeta {
  // 当前页码
  page: number
  // 每页条数
  pageSize: number
  // 总条数
  total: number
  // 总页数
  totalPages: number
}

/**
 * WGT 项目分页列表响应
 * @description 定义 WGT 项目分页查询返回的数据结构
 */
export interface WgtProjectListResponse {
  // 项目列表
  list: WgtProjectItem[]
  // 分页信息
  pagination: PaginationMeta
}

/**
 * WGT 项目搜索参数
 * @description 定义 WGT 项目列表查询参数
 */
export interface WgtProjectSearchParams {
  // 当前页码
  page?: number
  // 每页条数
  pageSize?: number
  // 项目名称
  name?: string
}

/**
 * WGT 项目创建参数
 * @description 定义创建 WGT 项目所需的参数
 */
export interface CreateWgtProjectParams {
  // 项目名称
  name: string
  // 项目描述
  description?: string
}

/**
 * WGT 项目更新参数
 * @description 定义更新 WGT 项目所需的参数
 */
export interface UpdateWgtProjectParams {
  // 项目名称
  name?: string
  // 项目描述
  description?: string
}
