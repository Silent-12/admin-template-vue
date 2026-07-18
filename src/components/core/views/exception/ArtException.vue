<template>
  <div class="page-content exception-page flex-cc">
    <div class="exception-inner flex-cc">
      <ThemeSvg :src="data.imgUrl" size="100%" class="exception-img" />
      <div class="exception-text">
        <p class="exception-desc">{{ data.desc }}</p>
        <ElButton type="primary" size="large" @click="backHome" v-ripple class="exception-btn">{{
          data.btnText
        }}</ElButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useCommon } from '@/hooks/core/useCommon'
  import { useUserStore } from '@/store/modules/user'

  const router = useRouter()
  const userStore = useUserStore()

  interface ExceptionData {
    /** 标题 */
    title: string
    /** 描述 */
    desc: string
    /** 按钮文本 */
    btnText: string
    /** 图片地址 */
    imgUrl: string
  }

  withDefaults(
    defineProps<{
      data: ExceptionData
    }>(),
    {}
  )

  const { homePath } = useCommon()

  const backHome = () => {
    const targetHomePath = homePath.value || '/'

    if (!userStore.isLogin) {
      router.push({
        name: 'Login',
        query: { redirect: targetHomePath }
      })
      return
    }

    router.push(targetHomePath)
  }
</script>

<style scoped lang="scss">
// 异常页根容器（!border-0 !bg-transparent min-h-screen）
.exception-page {
  border: 0 !important; // !border-0
  background: transparent !important; // !bg-transparent
  min-height: 100vh; // min-h-screen
}

// 内部布局（max-md:!block max-md:text-center）
.exception-inner {
  @media (max-width: 47.99rem) {
    // max-md:!block
    display: block !important;
    // max-md:text-center
    text-align: center;
  }
}

// 异常图片（!w-100）
.exception-img {
  width: 25rem !important; // !w-100
}

// 文本区域（ml-15 w-75 + max-md:*）
.exception-text {
  margin-left: 3.75rem; // ml-15
  width: 18.75rem; // w-75

  @media (max-width: 47.99rem) {
    // max-md:mx-auto
    margin-left: auto;
    margin-right: auto;
    // max-md:mt-10
    margin-top: 2.5rem;
    // max-md:w-full
    width: 100%;
    // max-md:text-center
    text-align: center;
  }
}

// 描述文本（text-xl leading-7 text-g-600 max-md:text-lg）
.exception-desc {
  font-size: 1.25rem; // text-xl
  line-height: 1.75rem; // leading-7
  color: var(--art-gray-600); // text-g-600

  @media (max-width: 47.99rem) {
    // max-md:text-lg
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
}

// 按钮（mt-5）
.exception-btn {
  margin-top: 1.25rem; // mt-5
}
</style>
