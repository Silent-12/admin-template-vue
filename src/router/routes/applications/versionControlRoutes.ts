/**
 * 版本发布应用路由。
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
      path: 'projectManagement',
      name: 'ProjectManagement',
      component: () => import('@/views/versionControl/projectManagement/index.vue'),
      meta: {
        title: '项目管理',
        icon: 'ri:pie-chart-line',
        keepAlive: true
      }
    },
    {
      path: 'projectDetails/:appId',
      name: 'ProjectDetails',
      component: () => import('@/views/versionControl/projectManagement/details/index.vue'),
      meta: {
        title: '项目详情',
        keepAlive: true,
        icon: 'ri:pie-chart-line',
        isHide: true,
        // isHideTab: true,
        activePath: '/versionControl/projectManagement'
      }
    },
    {
      path: 'system',
      name: 'System',
      meta: {
        title: 'menus.system.title',
        icon: 'ri:user-3-line'
      },
      children: [
        {
          path: 'user',
          name: 'User',
          component: '/system/user',
          meta: { title: 'menus.system.user', keepAlive: true }
        },
        {
          path: 'role',
          name: 'Role',
          component: '/system/role',
          meta: { title: 'menus.system.role', keepAlive: true }
        },
        {
          path: 'menu',
          name: 'Menus',
          component: '/system/menu',
          meta: { title: 'menus.system.menu', keepAlive: true }
        }
      ]
    }
  ]
}
