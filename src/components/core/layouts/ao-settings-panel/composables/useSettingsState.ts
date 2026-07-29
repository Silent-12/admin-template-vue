import { useSettingStore } from '@/store/modules/setting'

/**
 * 设置状态管理
 */
export function useSettingsState() {
  const settingStore = useSettingStore()

  // 色弱模式初始化
  const initColorWeak = () => {
    if (settingStore.colorWeak) {
      const el = document.getElementsByTagName('html')[0]
      setTimeout(() => {
        el.classList.add('color-weak')
      }, 100)
    }
  }

  return {
    // 方法
    initColorWeak
  }
}
