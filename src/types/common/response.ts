/**
 * API 响应类型定义模块
 *
 * 提供统一的 API 响应结构类型定义
 *
 * ## 主要功能
 *
 * - 基础响应结构定义
 * - 泛型支持（适配不同数据类型）
 * - 统一的响应格式约束
 *
 * ## 使用场景
 *
 * - API 请求响应类型约束
 * - 接口数据类型定义
 * - 响应数据解析
 */

/**
 * 基础 API 响应结构
 * @description 描述后端统一返回的成功与错误响应字段。
 */
export interface BaseResponse<T = unknown> {
  // HTTP 状态码
  code: number
  // 响应消息
  message: string
  // 响应数据
  data: T
  // 响应时间戳
  timestamp: string
  // 可选的错误追踪 ID
  traceId?: string
}
