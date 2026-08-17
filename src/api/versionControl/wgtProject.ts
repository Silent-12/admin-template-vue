import request from '@/utils/http'
import type {
  WgtProjectItem,
  WgtProjectListResponse,
  WgtProjectSearchParams,
  CreateWgtProjectParams,
  UpdateWgtProjectParams,
  WgtBaselineItem,
  WgtBaselineListResponse,
  WgtBaselineSearchParams,
  CreateWgtBaselineParams
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

/**
 * 创建 WGT 基线
 * @description 为指定项目创建一条版本溯源基线
 * @param appid 项目唯一标识
 * @param data 创建基线请求体
 * @returns 创建成功的基线响应
 */
export function fetchCreateWgtBaseline(appid: string, data: CreateWgtBaselineParams) {
  return request.post<WgtBaselineItem>({
    url: `/v1/admin/projects/${appid}/baselines`,
    data,
    showSuccessMessage: true
  })
}

/**
 * 分页查询项目基线
 * @description 仅查询指定项目下的基线
 * @param appid 项目唯一标识
 * @param params 分页参数
 * @returns 基线分页响应
 */
export function fetchGetWgtBaselineList(appid: string, params: WgtBaselineSearchParams) {
  return request.get<WgtBaselineListResponse>({
    url: `/v1/admin/projects/${appid}/baselines`,
    params
  })
}

/**
 * 查询项目中的单个基线
 * @description 查询单条基线详情
 * @param appid 项目唯一标识
 * @param id 基线主键
 * @returns 基线详情响应
 */
export function fetchGetWgtBaselineDetail(appid: string, id: number) {
  return request.get<WgtBaselineItem>({
    url: `/v1/admin/projects/${appid}/baselines/${id}`
  })
}

/**
 * 删除项目基线
 * @description 删除未被引用的基线
 * @param appid 项目唯一标识
 * @param id 基线主键
 * @returns 删除结果
 */
export function fetchDeleteWgtBaseline(appid: string, id: number) {
  return request.del<null>({
    url: `/v1/admin/projects/${appid}/baselines/${id}`,
    showSuccessMessage: true
  })
}
