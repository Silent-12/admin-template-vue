import request from '@/utils/http'
import type {
  WgtProjectItem,
  WgtProjectListResponse,
  WgtProjectSearchParams,
  CreateWgtProjectParams,
  UpdateWgtProjectParams
} from '@/types/api/versionControl'

/**
 * 创建 WGT 项目
 * @description 创建项目并生成全库唯一 appid
 * @param data 创建项目请求体
 * @returns 创建成功的项目响应
 */
export function fetchCreateWgtProject(data: CreateWgtProjectParams) {
  return request.post<WgtProjectItem>({
    url: '/v1/admin/projects',
    data,
    showSuccessMessage: true
  })
}

/**
 * 分页查询 WGT 项目
 * @description 支持按项目名称筛选
 * @param params 项目查询参数
 * @returns 项目分页响应
 */
export function fetchGetWgtProjectList(params: WgtProjectSearchParams) {
  return request.get<WgtProjectListResponse>({
    url: '/v1/admin/projects',
    params
  })
}

/**
 * 查询 WGT 项目详情
 * @description 按 appid 查询项目基础信息
 * @param appid 项目唯一标识
 * @returns 项目详情响应
 */
export function fetchGetWgtProjectDetail(appid: string) {
  return request.get<WgtProjectItem>({
    url: `/v1/admin/projects/${appid}`
  })
}

/**
 * 更新 WGT 项目
 * @description 更新项目名称或描述，不修改 appid
 * @param appid 项目唯一标识
 * @param data 项目更新请求体
 * @returns 更新后的项目响应
 */
export function fetchUpdateWgtProject(appid: string, data: UpdateWgtProjectParams) {
  return request.request<WgtProjectItem>({
    url: `/v1/admin/projects/${appid}`,
    method: 'PATCH',
    data,
    showSuccessMessage: true
  })
}
