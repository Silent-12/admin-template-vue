import type { App } from 'vue'
import { setupAuthDirective } from './auth'
import type { AuthDirective } from './auth'
import { setupHighlightDirective } from './highlight'
import type { HighlightDirective } from './highlight'
import { setupRippleDirective } from './ripple'
import type { RippleDirective } from './ripple'

/**
 * @description 注册应用内置的全局自定义指令
 * @param app - Vue 应用实例
 * @return 无返回值
 */
export function setupGlobDirectives(app: App): void {
  setupAuthDirective(app) // 权限指令
  setupHighlightDirective(app) // 高亮指令
  setupRippleDirective(app) // 水波纹指令
}

export type { AuthDirective, HighlightDirective, RippleDirective }
