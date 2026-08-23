import request from '@/utils/http'
import type {
  ReleaseProjectItem,
  ReleaseProjectListResponse,
  ReleaseProjectSearchParams,
  CreateReleaseProjectParams,
  UpdateReleaseProjectParams
} from '@/types/api/versionControl'

/**
 * 创建版本发布项目
 * @description 创建项目并生成全库唯一 appId
 * @param data 创建项目请求体
 * @returns 创建成功的项目响应
 */
export function fetchCreateReleaseProject(data: CreateReleaseProjectParams) {
  return request.post<null>({
    url: '/v1/admin/release/projects',
    data
  })
}

/**
 * 分页查询版本发布项目
 * @description 支持按项目名称筛选
 * @param params 项目查询参数
 * @returns 项目分页响应
 */
export function fetchGetReleaseProjectList(params: ReleaseProjectSearchParams) {
  return request.get<ReleaseProjectListResponse>({
    url: '/v1/admin/release/projects',
    params,
    showSuccessMessage: false
  })
}

/**
 * 查询版本发布项目详情
 * @description 按 appId 查询项目基础信息
 * @param appId 项目唯一标识
 * @returns 项目详情响应
 */
export function fetchGetReleaseProjectDetail(appId: string) {
  return request.get<ReleaseProjectItem>({
    url: `/v1/admin/release/projects/${appId}`,
    showSuccessMessage: false
  })
}

/**
 * 更新版本发布项目
 * @description 更新项目名称或描述，不修改 appId
 * @param appId 项目唯一标识
 * @param data 项目更新请求体
 * @returns 更新后的项目响应
 */
export function fetchUpdateReleaseProject(appId: string, data: UpdateReleaseProjectParams) {
  return request.request<null>({
    url: `/v1/admin/release/projects/${appId}`,
    method: 'PATCH',
    data
  })
}
