import App from './App.vue'
import { createApp } from 'vue'
import { useUserStore } from './store/modules/user'
import { AdminComponents } from '@ao/admin-components'
// 组件包样式：SFC scoped 样式编译产物，需与全局样式一同引入
import '@ao/admin-components/styles.css'
import logoUrl from '@imgs/common/logo.webp'

// Store
import { initStore } from './store'
// Router
import { initRouter } from './router'
// 多语言
import language from './locales'
// 全局样式
import '@styles/index.scss'
// 自定义指令
import { setupGlobDirectives } from './directives'
// 全局错误处理
import { setupErrorHandle } from './utils/sys/errorHandle'

// 收集宿主本地 SVG 资源，注入组件包供 AoSvgIcon 解析（图标名以连字符表示目录层级）
const localSvgModules = import.meta.glob('@/assets/svg/**/*.svg', {
  eager: true,
  query: '?url',
  import: 'default'
}) as Record<string, string>

/**
 * @description 按图标名解析宿主本地 SVG 资源地址。
 * @param icon 图标名称，使用连字符表示 SVG 目录层级。
 * @return 本地 SVG URL，未找到时返回 undefined。
 */
const resolveLocalSvg = (icon: string): string | undefined => {
  const relativePath = `${icon.split('-').join('/')}.svg`
  return Object.entries(localSvgModules).find(([path]) =>
    path.endsWith(`/assets/svg/${relativePath}`)
  )?.[1]
}

// 解决 Element Plus 等组件库在移动端触摸滚动时的兼容性问题
document.addEventListener('touchstart', function () {}, { passive: false })

const app = createApp(App)
initStore(app)
const userLanguage = useUserStore().language
const globalLocale = language.global.locale
if (typeof globalLocale === 'string') {
  language.global.locale = userLanguage
} else {
  globalLocale.value = userLanguage
}
initRouter(app)
setupGlobDirectives(app)
setupErrorHandle(app)

app.use(language)
// 公共组件包：注册 v-loading 指令、合并包语言包、注入权限与本地资源解析
app.use(AdminComponents, {
  i18n: language,
  getAuthList: () => useUserStore().info?.auth,
  resolveLocalSvg,
  assets: { logo: logoUrl }
})
app.mount('#app')
