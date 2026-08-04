/**
 * OMS 应用路由。
 */
import type { AppRouteRecord } from '@/types/router'
import { RoutePath } from '@/router/constants'

export const omsRoutes: AppRouteRecord = {
  path: '/oms',
  name: 'OMS',
  component: RoutePath.LayoutComponent,
  meta: { title: 'menus.oms.title', icon: 'ri:shopping-cart-2-line' },
  children: [
    {
      name: 'Dashboard',
      path: 'dashboard',
      meta: {
        title: 'menus.dashboard.title',
        icon: 'ri:pie-chart-line'
      },
      children: [
        {
          path: 'console',
          name: 'Console',
          component: '/dashboard/console',
          meta: {
            title: 'menus.dashboard.console',
            keepAlive: false,
            fixedTab: true
          }
        },
        {
          path: 'docs',
          name: 'Docs',
          meta: {
            title: '文档',
            link: 'https://element-plus.org/',
            isIframe: true
          }
        }
      ]
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
          path: 'user-center',
          name: 'UserCenter',
          component: '/system/user-center',
          meta: { title: 'menus.system.userCenter', isHide: true, keepAlive: true, isHideTab: true }
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
