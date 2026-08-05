import App from './App.vue'
import { createApp } from 'vue'
import { useUserStore } from './store/modules/user'

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
app.mount('#app')
