/**
 * 本地业务系统路由集合。
 */
import type { AppRouteRecord } from '@/types/router'
import { versionControlRoutes } from './versionControlRoutes'

export const applicationRoutes: AppRouteRecord[] = [versionControlRoutes]
