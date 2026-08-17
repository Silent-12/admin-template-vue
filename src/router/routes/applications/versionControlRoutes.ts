/**
 * wgt 应用路由。
 */
import type { AppRouteRecord } from '@/types/router'
import { RoutePath } from '@/router/constants'

export const versionControlRoutes: AppRouteRecord = {
  path: '/versionControl',
  name: 'VersionControl',
  component: RoutePath.LayoutComponent,
  meta: { title: '版本管理', icon: 'ri:shopping-cart-2-line' },
  children: [
    {
      path: 'projectList',
      name: 'ProjectList',
      component: () => import('@/views/versionControl/projectList/index.vue'),
      meta: {
        title: '项目列表',
        icon: 'ri:pie-chart-line',
        keepAlive: true
      }
    }
  ]
}
