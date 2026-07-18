<!-- 登录页面 -->
<template>
  <div class="login-container">
    <LoginLeftView />

    <div class="login-right-side">
      <AuthTopBar />

      <div class="auth-right-wrap">
        <div class="form">
          <h3 class="title">{{ $t('login.title') }}</h3>
          <p class="sub-title">{{ $t('login.subTitle') }}</p>
          <ElForm
            ref="formRef"
            :model="formData"
            :rules="rules"
            :key="formKey"
            @keyup.enter="handleSubmit"
            style="margin-top: 25px"
          >
            <ElFormItem prop="account">
              <ElSelect v-model="formData.account" @change="setupAccount">
                <ElOption
                  v-for="account in accounts"
                  :key="account.key"
                  :label="account.label"
                  :value="account.key"
                >
                  <span>{{ account.label }}</span>
                </ElOption>
              </ElSelect>
            </ElFormItem>
            <ElFormItem prop="username">
              <ElInput
                class="custom-height"
                :placeholder="$t('login.placeholder.username')"
                v-model.trim="formData.username"
              />
            </ElFormItem>
            <ElFormItem prop="password">
              <ElInput
                class="custom-height"
                :placeholder="$t('login.placeholder.password')"
                v-model.trim="formData.password"
                type="password"
                autocomplete="off"
                show-password
              />
            </ElFormItem>

            <!-- 推拽验证 -->
            <div class="drag-verify-wrap">
              <div
                class="drag-verify-inner tad-300"
                :class="{ 'is-error': !isPassing && isClickPass }"
              >
                <ArtDragVerify
                  ref="dragVerify"
                  v-model:value="isPassing"
                  :text="$t('login.sliderText')"
                  textColor="var(--art-gray-700)"
                  :successText="$t('login.sliderSuccessText')"
                  progressBarBg="var(--main-color)"
                  :background="isDark ? '#26272F' : '#F1F1F4'"
                  handlerBg="var(--default-box-color)"
                />
              </div>
              <p class="drag-verify-tip tad-300" :class="{ 'is-show': !isPassing && isClickPass }">
                {{ $t('login.placeholder.slider') }}
              </p>
            </div>

            <div class="flex-cb action-row remember-row">
              <ElCheckbox v-model="formData.rememberPassword">{{
                $t('login.rememberPwd')
              }}</ElCheckbox>
              <RouterLink class="link-theme" :to="{ name: 'ForgetPassword' }">{{
                $t('login.forgetPwd')
              }}</RouterLink>
            </div>

            <div style="margin-top: 30px">
              <ElButton
                class="submit-btn custom-height"
                type="primary"
                @click="handleSubmit"
                :loading="loading"
                v-ripple
              >
                {{ $t('login.btnText') }}
              </ElButton>
            </div>

            <div class="action-row no-account-row">
              <span>{{ $t('login.noAccount') }}</span>
              <RouterLink class="link-theme" :to="{ name: 'Register' }">{{
                $t('login.register')
              }}</RouterLink>
            </div>
          </ElForm>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import AppConfig from '@/config'
  import { useUserStore } from '@/store/modules/user'
  import { useI18n } from 'vue-i18n'
  import { HttpError } from '@/utils/http/error'
  import { fetchLogin } from '@/api/auth'
  import { ElNotification, type FormInstance, type FormRules } from 'element-plus'
  import { useSettingStore } from '@/store/modules/setting'

  defineOptions({ name: 'Login' })

  const settingStore = useSettingStore()
  const { isDark } = storeToRefs(settingStore)
  const { t, locale } = useI18n()
  const formKey = ref(0)

  // 监听语言切换，重置表单
  watch(locale, () => {
    formKey.value++
  })

  type AccountKey = 'super' | 'admin' | 'user'

  export interface Account {
    key: AccountKey
    label: string
    userName: string
    password: string
    roles: string[]
  }

  const accounts = computed<Account[]>(() => [
    {
      key: 'super',
      label: t('login.roles.super'),
      userName: 'Super',
      password: '123456',
      roles: ['R_SUPER']
    },
    {
      key: 'admin',
      label: t('login.roles.admin'),
      userName: 'Admin',
      password: '123456',
      roles: ['R_ADMIN']
    },
    {
      key: 'user',
      label: t('login.roles.user'),
      userName: 'User',
      password: '123456',
      roles: ['R_USER']
    }
  ])

  const dragVerify = ref()

  const userStore = useUserStore()
  const router = useRouter()
  const route = useRoute()
  const isPassing = ref(false)
  const isClickPass = ref(false)

  const systemName = AppConfig.systemInfo.name
  const formRef = ref<FormInstance>()

  const formData = reactive({
    account: '',
    username: '',
    password: '',
    rememberPassword: true
  })

  const rules = computed<FormRules>(() => ({
    username: [{ required: true, message: t('login.placeholder.username'), trigger: 'blur' }],
    password: [{ required: true, message: t('login.placeholder.password'), trigger: 'blur' }]
  }))

  const loading = ref(false)

  onMounted(() => {
    setupAccount('super')
  })

  // 设置账号
  const setupAccount = (key: AccountKey) => {
    const selectedAccount = accounts.value.find((account: Account) => account.key === key)
    formData.account = key
    formData.username = selectedAccount?.userName ?? ''
    formData.password = selectedAccount?.password ?? ''
  }

  // 登录
  const handleSubmit = async () => {
    if (!formRef.value) return

    try {
      // 表单验证
      const valid = await formRef.value.validate()
      if (!valid) return

      // 拖拽验证
      if (!isPassing.value) {
        isClickPass.value = true
        return
      }

      loading.value = true

      // 登录请求
      const { username, password } = formData

      const { token, refreshToken } = await fetchLogin({
        userName: username,
        password
      })

      // 验证token
      if (!token) {
        throw new Error('Login failed - no token received')
      }

      // 存储 token 和登录状态
      userStore.setToken(token, refreshToken)
      userStore.setLoginStatus(true)

      // 登录成功处理
      showLoginSuccessNotice()

      // 获取 redirect 参数，如果存在则跳转到指定页面，否则跳转到首页
      const redirect = route.query.redirect as string
      router.push(redirect || '/')
    } catch (error) {
      // 处理 HttpError
      if (error instanceof HttpError) {
        // console.log(error.code)
      } else {
        // 处理非 HttpError
        // ElMessage.error('登录失败，请稍后重试')
        console.error('[Login] Unexpected error:', error)
      }
    } finally {
      loading.value = false
      resetDragVerify()
    }
  }

  // 重置拖拽验证
  const resetDragVerify = () => {
    dragVerify.value.reset()
  }

  // 登录成功提示
  const showLoginSuccessNotice = () => {
    setTimeout(() => {
      ElNotification({
        title: t('login.success.title'),
        type: 'success',
        duration: 2500,
        zIndex: 10000,
        message: `${t('login.success.message')}, ${systemName}!`
      })
    }, 1000)
  }
</script>

<style scoped lang="scss">
  @import './style.scss';

  /* 登录页根容器 */
  .login-container {
    display: flex;
    width: 100%;
    height: 100vh;
  }

  /* 右侧区域容器 */
  .login-right-side {
    position: relative;
    flex: 1 1 0%;
  }

  /* 拖拽验证外层 */
  .drag-verify-wrap {
    position: relative;
    padding-bottom: 1.25rem;
    margin-top: 1.5rem;
  }

  /* 拖拽验证容器 */
  .drag-verify-inner {
    position: relative;
    z-index: 2;
    overflow: hidden;
    user-select: none;
    border: 1px solid transparent;
    border-radius: 0.5rem;

    /* 验证失败时显示红色边框 */
    &.is-error {
      border-color: #ff4e4f !important;
    }
  }

  /* 拖拽验证提示文案 */
  .drag-verify-tip {
    position: absolute;
    top: 0;
    z-index: 1;
    margin-top: 0.5rem;
    padding-left: 1px;
    padding-right: 1px;
    font-size: 0.75rem;
    line-height: 1rem;
    color: #f56c6c;

    /* 验证失败时下移显示 */
    &.is-show {
      transform: translateY(2.5rem);
    }
  }

  /* 操作行（记住密码 / 没有账号）共用样式 */
  .action-row {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  /* 记住密码行 */
  .remember-row {
    margin-top: 0.5rem;
  }

  /* 没有账号行 */
  .no-account-row {
    margin-top: 1.25rem;
    color: var(--art-gray-600);
  }

  /* 主题色链接 */
  .link-theme {
    color: var(--theme-color);
  }

  /* 提交按钮宽度 */
  .submit-btn {
    width: 100%;
  }

  /* Element Plus 选择器高度调整 */
  :deep(.el-select__wrapper) {
    height: 40px !important;
  }
</style>
