<template>
  <div class="page-content result-page" :class="type">
    <AoSvgIcon
      class="icon"
      :icon="iconCode"
      :class="type === 'success' ? 'is-success' : 'is-fail'"
    />
    <h1 class="title">{{ title }}</h1>
    <p class="msg">{{ message }}</p>
    <div class="res">
      <slot name="content"></slot>
    </div>
    <div class="btn-group">
      <slot name="buttons"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'AoResultPage' })

  interface ResultPageProps {
    /** 成功/失败 */
    type: 'success' | 'fail'
    /** 标题 */
    title: string
    /** 消息 */
    message: string
    /** 图标 */
    iconCode: string
  }

  withDefaults(defineProps<ResultPageProps>(), {
    type: 'success',
    title: '',
    message: '',
    iconCode: ''
  })
</script>

<style scoped lang="scss">
  // 结果页根容器（box-border !px-20 py-3.5 text-center max-md:!px-5）
  .result-page {
    box-sizing: border-box; // box-border
    padding-top: 0.875rem; // py-3.5
    padding-right: 5rem !important; // !px-20
    padding-bottom: 0.875rem; // py-3.5
    padding-left: 5rem !important; // !px-20
    text-align: center; // text-center

    @media (width <= 47.99rem) {
      padding-right: 1.25rem !important;
      // max-md:!px-5
      padding-left: 1.25rem !important;
    }
  }

  // 图标（size-22 p-2 mt-16 block rounded-full !text-white）
  .icon {
    display: block; // block
    width: 5.5rem; // size-22
    height: 5.5rem; // size-22
    padding: 0.5rem; // p-2
    margin-top: 4rem; // mt-16
    color: #fff !important; // !text-white
    border-radius: 9999px; // rounded-full

    // 成功状态（bg-[#19BE6B]）
    &.is-success {
      background: #19be6b;
    }

    // 失败状态（bg-[#ED4014]）
    &.is-fail {
      background: #ed4014;
    }
  }

  // 标题（mt-8 text-3xl font-medium !text-g-900 max-md:mt-2.5 max-md:text-2xl）
  .title {
    margin-top: 2rem; // mt-8
    font-size: 1.875rem; // text-3xl
    font-weight: 500; // font-medium
    line-height: 2.25rem; // text-3xl
    color: var(--ao-gray-900) !important; // !text-g-900

    @media (width <= 47.99rem) {
      // max-md:mt-2.5
      margin-top: 0.625rem;
      // max-md:text-2xl
      font-size: 1.5rem;
      line-height: 2rem;
    }
  }

  // 消息（mt-5 text-base text-g-600）
  .msg {
    margin-top: 1.25rem; // mt-5
    font-size: 1rem; // text-base
    line-height: 1.5rem; // text-base
    color: var(--ao-gray-600); // text-g-600
  }

  // 结果内容容器（mt-7.5 rounded bg-g-200/80 dark:bg-g-300/40 px-7.5 py-5.5 text-left max-md:*）
  .res {
    padding: 1.375rem 1.875rem; // py-5.5 // px-7.5 // py-5.5 // px-7.5
    margin-top: 1.875rem; // mt-7.5
    text-align: left; // text-left
    background: color-mix(in srgb, var(--ao-gray-200) 80%, transparent); // bg-g-200/80
    border-radius: 0.25rem; // rounded

    // dark:bg-g-300/40
    .dark & {
      background: color-mix(in srgb, var(--ao-gray-300) 40%, transparent);
    }

    @media (width <= 47.99rem) {
      padding: 0.625rem 1.875rem;
      // max-md:py-2.5
      // max-md:px-7.5
    }

    // [&_p]:flex [&_p]:items-center [&_p]:py-2 [&_p]:text-sm [&_p]:text-[#808695]
    p {
      display: flex; // [&_p]:flex
      align-items: center; // [&_p]:items-center
      padding-top: 0.5rem; // [&_p]:py-2
      padding-bottom: 0.5rem; // [&_p]:py-2
      font-size: 0.875rem; // [&_p]:text-sm
      line-height: 1.25rem; // [&_p]:text-sm
      color: #808695; // [&_p]:text-[#808695]

      // [&_p_i]:mr-1.5
      i {
        margin-right: 0.375rem; // [&_p_i]:mr-1.5
      }
    }
  }

  // 按钮组（mt-12.5）
  .btn-group {
    margin-top: 3.125rem; // mt-12.5
  }
</style>
