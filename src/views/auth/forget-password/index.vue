<template>
  <div class="forget-container">
    <LoginLeftView />

    <div class="forget-right-side">
      <AuthTopBar />

      <div class="auth-right-wrap">
        <div class="form">
          <h3 class="title">{{ $t('forgetPassword.title') }}</h3>
          <p class="sub-title">{{ $t('forgetPassword.subTitle') }}</p>
          <div class="input-wrap">
            <span class="input-label" v-if="showInputLabel">账号</span>
            <ElInput
              class="custom-height"
              :placeholder="$t('forgetPassword.placeholder')"
              v-model.trim="username"
            />
          </div>

          <div style="margin-top: 15px">
            <ElButton
              class="submit-btn custom-height"
              type="primary"
              @click="register"
              :loading="loading"
              v-ripple
            >
              {{ $t('forgetPassword.submitBtnText') }}
            </ElButton>
          </div>

          <div style="margin-top: 15px">
            <ElButton class="submit-btn custom-height" plain @click="toLogin">
              {{ $t('forgetPassword.backBtnText') }}
            </ElButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'ForgetPassword' })

  const router = useRouter()
  const showInputLabel = ref(false)

  const username = ref('')
  const loading = ref(false)

  const register = async () => {}

  const toLogin = () => {
    router.push({ name: 'Login' })
  }
</script>

<style scoped lang="scss">
  @import '../login/style.scss';

  /* 忘记密码页根容器 */
  .forget-container {
    display: flex;
    width: 100%;
    height: 100vh;
  }

  /* 右侧区域容器 */
  .forget-right-side {
    position: relative;
    flex: 1 1 0%;
  }

  /* 输入框外层间距 */
  .input-wrap {
    margin-top: 1.25rem;
  }

  /* 提交按钮宽度 */
  .submit-btn {
    width: 100%;
  }
</style>
