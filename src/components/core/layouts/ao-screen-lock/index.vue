<!-- 锁屏 -->
<template>
  <div class="layout-lock-screen">
    <!-- 开发者工具警告覆盖层 -->
    <div v-if="showDevToolsWarning" class="dev-tools-warning flex-cc animate-fade-in">
      <div class="dev-tools-warning__content">
        <div class="dev-tools-warning__icon">🔒</div>
        <h1 class="dev-tools-warning__title">系统已锁定</h1>
        <p class="dev-tools-warning__desc">
          检测到开发者工具已打开<br />
          为了系统安全，请关闭开发者工具后继续使用
        </p>
        <div class="dev-tools-warning__footer">Security Lock Activated</div>
      </div>
    </div>

    <!-- 锁屏弹窗 -->
    <div v-if="!isLock">
      <ElDialog v-model="visible" :width="370" :show-close="false" @open="handleDialogOpen">
        <div class="lock-dialog__body flex-c">
          <img class="lock-dialog__avatar" src="@imgs/user/avatar.webp" alt="用户头像" />
          <div class="lock-dialog__username">{{ userInfo.userName }}</div>
          <ElForm
            ref="formRef"
            :model="formData"
            :rules="rules"
            class="lock-dialog__form"
            @submit.prevent="handleLock"
          >
            <ElFormItem prop="password">
              <ElInput
                v-model="formData.password"
                type="password"
                :placeholder="$t('lockScreen.lock.inputPlaceholder')"
                :show-password="true"
                autocomplete="new-password"
                ref="lockInputRef"
                class="lock-dialog__input"
                @keyup.enter="handleLock"
              >
                <template #suffix>
                  <ElIcon class="c-p" @click="handleLock">
                    <Lock />
                  </ElIcon>
                </template>
              </ElInput>
            </ElFormItem>
            <ElButton type="primary" class="lock-dialog__submit" @click="handleLock" v-ripple>
              {{ $t('lockScreen.lock.btnText') }}
            </ElButton>
          </ElForm>
        </div>
      </ElDialog>
    </div>

    <!-- 解锁界面 -->
    <div v-else class="unlock-content">
      <div class="unlock-content__body flex-c">
        <img class="unlock-content__avatar" src="@imgs/user/avatar.webp" alt="用户头像" />
        <div class="unlock-content__username">
          {{ userInfo.userName }}
        </div>
        <ElForm
          ref="unlockFormRef"
          :model="unlockForm"
          :rules="rules"
          class="unlock-content__form"
          @submit.prevent="handleUnlock"
        >
          <ElFormItem prop="password">
            <ElInput
              v-model="unlockForm.password"
              type="password"
              :placeholder="$t('lockScreen.unlock.inputPlaceholder')"
              :show-password="true"
              autocomplete="new-password"
              ref="unlockInputRef"
              class="unlock-content__input"
            >
              <template #suffix>
                <ElIcon class="c-p" @click="handleUnlock">
                  <Unlock />
                </ElIcon>
              </template>
            </ElInput>
          </ElFormItem>

          <ElButton type="primary" class="unlock-content__submit" @click="handleUnlock" v-ripple>
            {{ $t('lockScreen.unlock.btnText') }}
          </ElButton>
          <div class="unlock-content__back-wrapper">
            <ElButton text class="unlock-content__back-btn" @click="toLogin">
              {{ $t('lockScreen.unlock.backBtnText') }}
            </ElButton>
          </div>
        </ElForm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Lock, Unlock } from '@element-plus/icons-vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import CryptoJS from 'crypto-js'
  import { useUserStore } from '@/store/modules/user'
  import { mittBus } from '@/utils/sys'

  // 国际化
  const { t } = useI18n()

  // 环境变量
  const ENCRYPT_KEY = import.meta.env.VITE_LOCK_ENCRYPT_KEY

  // Store
  const userStore = useUserStore()
  const { info: userInfo, lockPassword, isLock } = storeToRefs(userStore)

  // 响应式数据
  const visible = ref<boolean>(false)
  const lockInputRef = ref<any>(null)
  const unlockInputRef = ref<any>(null)
  const showDevToolsWarning = ref<boolean>(false)

  // 表单相关
  const formRef = ref<FormInstance>()
  const unlockFormRef = ref<FormInstance>()

  const formData = reactive({
    password: ''
  })

  const unlockForm = reactive({
    password: ''
  })

  // 表单验证规则
  const rules = computed<FormRules>(() => ({
    password: [
      {
        required: true,
        message: t('lockScreen.lock.inputPlaceholder'),
        trigger: 'blur'
      }
    ]
  }))

  // 检测是否为移动设备
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  }

  // 添加禁用控制台的函数
  const disableDevTools = () => {
    // 禁用右键菜单
    const handleContextMenu = (e: Event) => {
      if (isLock.value) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }
    document.addEventListener('contextmenu', handleContextMenu, true)

    // 禁用开发者工具相关快捷键
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLock.value) return

      // 禁用 F12
      if (e.key === 'F12') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // 禁用 Ctrl+Shift+I/J/C/K (开发者工具)
      if (e.ctrlKey && e.shiftKey) {
        const key = e.key.toLowerCase()
        if (['i', 'j', 'c', 'k'].includes(key)) {
          e.preventDefault()
          e.stopPropagation()
          return false
        }
      }

      // 禁用 Ctrl+U (查看源代码)
      if (e.ctrlKey && e.key.toLowerCase() === 'u') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // 禁用 Ctrl+S (保存页面)
      if (e.ctrlKey && e.key.toLowerCase() === 's') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // 禁用 Ctrl+A (全选)
      if (e.ctrlKey && e.key.toLowerCase() === 'a') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // 禁用 Ctrl+P (打印)
      if (e.ctrlKey && e.key.toLowerCase() === 'p') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // 禁用 Ctrl+F (查找)
      if (e.ctrlKey && e.key.toLowerCase() === 'f') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // 禁用 Alt+Tab (切换窗口)
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // 禁用 Ctrl+Tab (切换标签页)
      if (e.ctrlKey && e.key === 'Tab') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // 禁用 Ctrl+W (关闭标签页)
      if (e.ctrlKey && e.key.toLowerCase() === 'w') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // 禁用 Ctrl+R 和 F5 (刷新页面)
      if ((e.ctrlKey && e.key.toLowerCase() === 'r') || e.key === 'F5') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // 禁用 Ctrl+Shift+R (强制刷新)
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'r') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }
    document.addEventListener('keydown', handleKeyDown, true)

    // 禁用选择文本
    const handleSelectStart = (e: Event) => {
      if (isLock.value) {
        e.preventDefault()
        return false
      }
    }
    document.addEventListener('selectstart', handleSelectStart, true)

    // 禁用拖拽
    const handleDragStart = (e: Event) => {
      if (isLock.value) {
        e.preventDefault()
        return false
      }
    }
    document.addEventListener('dragstart', handleDragStart, true)

    // 监听开发者工具打开状态（仅在桌面端启用）
    let devtools = { open: false }
    const threshold = 160
    let devToolsInterval: ReturnType<typeof setInterval> | null = null

    const checkDevTools = () => {
      if (!isLock.value || isMobile()) return

      const isDevToolsOpen =
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold

      if (isDevToolsOpen && !devtools.open) {
        devtools.open = true
        showDevToolsWarning.value = true
      } else if (!isDevToolsOpen && devtools.open) {
        devtools.open = false
        showDevToolsWarning.value = false
      }
    }

    // 仅在桌面端启用开发者工具检测
    if (!isMobile()) {
      devToolsInterval = setInterval(checkDevTools, 500)
    }

    // 返回清理函数
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, true)
      document.removeEventListener('keydown', handleKeyDown, true)
      document.removeEventListener('selectstart', handleSelectStart, true)
      document.removeEventListener('dragstart', handleDragStart, true)
      if (devToolsInterval) {
        clearInterval(devToolsInterval)
      }
    }
  }

  // 工具函数
  const verifyPassword = (inputPassword: string, storedPassword: string): boolean => {
    try {
      const decryptedPassword = CryptoJS.AES.decrypt(storedPassword, ENCRYPT_KEY).toString(
        CryptoJS.enc.Utf8
      )
      return inputPassword === decryptedPassword
    } catch (error) {
      console.error('密码解密失败:', error)
      return false
    }
  }

  // 事件处理函数
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.altKey && event.key.toLowerCase() === '¬') {
      event.preventDefault()
      visible.value = true
    }
  }

  const handleDialogOpen = () => {
    setTimeout(() => {
      lockInputRef.value?.input?.focus()
    }, 100)
  }

  const handleLock = async () => {
    if (!formRef.value) return

    await formRef.value.validate((valid, fields) => {
      if (valid) {
        const encryptedPassword = CryptoJS.AES.encrypt(formData.password, ENCRYPT_KEY).toString()
        userStore.setLockStatus(true)
        userStore.setLockPassword(encryptedPassword)
        visible.value = false
        formData.password = ''
      } else {
        console.error('表单验证失败:', fields)
      }
    })
  }

  const handleUnlock = async () => {
    if (!unlockFormRef.value) return

    await unlockFormRef.value.validate((valid, fields) => {
      if (valid) {
        const isValid = verifyPassword(unlockForm.password, lockPassword.value)

        if (isValid) {
          try {
            userStore.setLockStatus(false)
            userStore.setLockPassword('')
            unlockForm.password = ''
            visible.value = false
            showDevToolsWarning.value = false
          } catch (error) {
            console.error('更新store失败:', error)
          }
        } else {
          // 触发抖动动画
          const inputElement = unlockInputRef.value?.$el
          if (inputElement) {
            inputElement.classList.add('shake-animation')
            setTimeout(() => {
              inputElement.classList.remove('shake-animation')
            }, 300)
          }
          ElMessage.error(t('lockScreen.pwdError'))
          unlockForm.password = ''
        }
      } else {
        console.error('表单验证失败:', fields)
      }
    })
  }

  const toLogin = () => {
    userStore.logOut()
  }

  const openLockScreen = () => {
    visible.value = true
  }

  // 监听锁屏状态变化
  watch(isLock, (newValue) => {
    if (newValue) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => {
        unlockInputRef.value?.input?.focus()
      }, 100)
    } else {
      document.body.style.overflow = 'auto'
      showDevToolsWarning.value = false
    }
  })

  // 存储清理函数
  let cleanupDevTools: (() => void) | null = null

  // 生命周期钩子
  onMounted(() => {
    mittBus.on('openLockScreen', openLockScreen)
    document.addEventListener('keydown', handleKeydown)

    if (isLock.value) {
      visible.value = true
      setTimeout(() => {
        unlockInputRef.value?.input?.focus()
      }, 100)
    }

    // 初始化禁用开发者工具功能
    cleanupDevTools = disableDevTools()
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = 'auto'
    // 清理禁用开发者工具的事件监听器
    if (cleanupDevTools) {
      cleanupDevTools()
      cleanupDevTools = null
    }
  })
</script>

<style lang="scss" scoped>
  .layout-lock-screen :deep(.el-dialog) {
    border-radius: 10px;
  }

  // ==================== 开发者工具警告覆盖层 ====================
  // fixed top-0 left-0 z-[999999] flex-cc w-full h-full text-white
  // bg-gradient-to-br from-[#1e1e1e] to-black
  // 保留全局工具类 flex-cc
  .dev-tools-warning {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999999; // z-[999999]
    width: 100%; // w-full
    height: 100%; // h-full
    color: #fff; // text-white
    background-image: linear-gradient(
      to bottom right,
      #1e1e1e,
      #000
    ); // bg-gradient-to-br from-[#1e1e1e] to-black

    // p-5 text-center select-none
    &__content {
      padding: 1.25rem; // p-5
      text-align: center;
      user-select: none; // select-none
    }

    // mb-7.5 text-5xl
    &__icon {
      margin-bottom: 1.875rem; // mb-7.5
      font-size: 3rem; // text-5xl
      line-height: 1;
    }

    // m-0 mb-5 text-3xl font-semibold text-danger
    &__title {
      margin: 0 0 1.25rem; // m-0 mb-5
      font-size: 1.875rem; // text-3xl
      font-weight: 600; // font-semibold
      line-height: 2.25rem;
      color: var(--ao-danger); // text-danger
    }

    // max-w-125 m-0 text-lg leading-relaxed text-white
    &__desc {
      max-width: 31.25rem; // max-w-125
      margin: 0; // m-0
      font-size: 1.125rem; // text-lg
      line-height: 1.625; // leading-relaxed
      color: #fff; // text-white
    }

    // mt-7.5 text-sm text-gray-400
    &__footer {
      margin-top: 1.875rem; // mt-7.5
      font-size: 0.875rem; // text-sm
      line-height: 1.25rem;
      color: #9ca3af; // text-gray-400（Tailwind 原生色板）
    }
  }

  // ==================== 锁屏弹窗 ====================
  .lock-dialog {
    // flex-col（与全局工具类 flex-c 组合使用）
    &__body {
      flex-direction: column; // flex-col
    }

    // w-16 h-16 rounded-full
    &__avatar {
      width: 4rem; // w-16
      height: 4rem; // h-16
      border-radius: 9999px; // rounded-full
    }

    // mt-7.5 mb-3.5 text-base font-medium
    &__username {
      margin-top: 1.875rem; // mt-7.5
      margin-bottom: 0.875rem; // mb-3.5
      font-size: 1rem; // text-base
      font-weight: 500; // font-medium
      line-height: 1.5rem;
    }

    // w-[90%]
    &__form {
      width: 90%;
    }

    // w-full mt-9
    &__input {
      width: 100%; // w-full
      margin-top: 2.25rem; // mt-9
    }

    // w-full mt-0.5
    &__submit {
      width: 100%; // w-full
      margin-top: 0.125rem; // mt-0.5
    }
  }

  // ==================== 解锁界面 ====================
  .unlock-content {
    position: fixed;
    inset: 0;
    z-index: 2500;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background-color: #fff;
    background-image: url('@imgs/lock/bg_light.webp');
    background-size: cover;
    transition: transform 0.3s ease-in-out;

    // flex-col w-80（与全局工具类 flex-c 组合使用）
    &__body {
      flex-direction: column; // flex-col
      width: 20rem; // w-80
    }

    // w-16 h-16 mt-5 rounded-full
    &__avatar {
      width: 4rem; // w-16
      height: 4rem; // h-16
      margin-top: 1.25rem; // mt-5
      border-radius: 9999px; // rounded-full
    }

    // mt-3 mb-3.5 text-base font-medium
    &__username {
      margin-top: 0.75rem; // mt-3
      margin-bottom: 0.875rem; // mb-3.5
      font-size: 1rem; // text-base
      font-weight: 500; // font-medium
      line-height: 1.5rem;
    }

    // w-full !px-2.5
    &__form {
      width: 100%; // w-full
      padding-right: 0.625rem !important;
      padding-left: 0.625rem !important; // !px-2.5
    }

    // mt-5
    &__input {
      margin-top: 1.25rem; // mt-5
    }

    // w-full mt-2
    &__submit {
      width: 100%; // w-full
      margin-top: 0.5rem; // mt-2
    }

    // w-full text-center
    &__back-wrapper {
      width: 100%; // w-full
      text-align: center;
    }

    // mt-2.5 !text-g-600 hover:!text-theme hover:!bg-transparent
    &__back-btn {
      margin-top: 0.625rem; // mt-2.5
      color: var(--ao-gray-600) !important; // !text-g-600

      &:hover {
        color: var(--theme-color) !important; // hover:!text-theme
        background: transparent !important; // hover:!bg-transparent
      }
    }
  }

  .dark {
    .unlock-content {
      background-image: url('@imgs/lock/bg_dark.webp');
    }
  }

  @keyframes fade-in {
    from {
      opacity: 0;
      transform: scale(0.9);
    }

    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.3s ease-in-out;
  }

  @keyframes shake {
    0%,
    100% {
      transform: translateX(0);
    }

    10%,
    30%,
    50%,
    70%,
    90% {
      transform: translateX(-10px);
    }

    20%,
    40%,
    60%,
    80% {
      transform: translateX(10px);
    }
  }

  .shake-animation {
    animation: shake 0.5s ease-in-out;
  }
</style>
