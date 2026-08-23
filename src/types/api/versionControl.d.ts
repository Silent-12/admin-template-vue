/**
 * 版本发布项目列表项
 * @description 定义版本发布项目基础信息
 */
export interface ReleaseProjectItem {
  // 项目主键 ID
  id: number
  // 项目唯一 appId
  appId: string
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
 * 版本发布项目分页列表响应
 * @description 定义版本发布项目分页查询返回的数据结构
 */
export interface ReleaseProjectListResponse {
  // 项目列表
  list: ReleaseProjectItem[]
  // 分页信息
  pagination: PaginationMeta
}

/**
 * 版本发布项目搜索参数
 * @description 定义版本发布项目列表查询参数
 */
export interface ReleaseProjectSearchParams {
  // 当前页码
  page?: number
  // 每页条数
  pageSize?: number
  // 项目名称
  name?: string
}

/**
 * 版本发布项目创建参数
 * @description 定义创建版本发布项目所需的参数
 */
export interface CreateReleaseProjectParams {
  // 项目名称
  name: string
  // 项目描述
  description?: string
}

/**
 * 版本发布项目更新参数
 * @description 定义更新版本发布项目所需的参数
 */
export interface UpdateReleaseProjectParams {
  // 项目名称
  name?: string
  // 项目描述
  description?: string
}
