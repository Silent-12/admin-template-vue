<template>
  <div class="ao-card about-project flex-b">
    <div>
      <h2 class="about-project-title">关于项目</h2>
      <p class="about-project-desc">{{ systemName }} 是一款兼具设计美学与高效开发的后台系统</p>
      <p class="about-project-desc">使用了 Vue3、TypeScript、Vite、Element Plus 等前沿技术</p>

      <div class="about-project-links">
        <div
          class="about-project-link flex-cb c-p"
          v-for="link in linkList"
          :key="link.label"
          @click="goPage(link.url)"
        >
          <span class="about-project-link-label">{{ link.label }}</span>
          <AoSvgIcon icon="ri:arrow-right-s-line" class="about-project-link-icon" />
        </div>
      </div>
    </div>
    <img class="about-project-img" src="@imgs/draw/draw1.png" alt="draw1" />
  </div>
</template>

<script setup lang="ts">
  import AppConfig from '@/config'

  const systemName = AppConfig.systemInfo.name

  const linkList = [
    { label: '项目官网', url: 'https://www.artd.pro/docs/zh/' },
    { label: '文档', url: 'https://www.artd.pro/docs/zh/guide/introduce.html' },
    { label: 'Github', url: 'https://github.com/Daymychen/art-design-pro' },
    { label: '哔哩哔哩', url: 'https://space.bilibili.com/425500936?spm_id_from=333.1007.0.0' }
  ]

  /**
   * 在新标签页中打开指定 URL
   * @param url 要打开的网页地址
   */
  const goPage = (url: string): void => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
</script>

<style scoped lang="scss">
  // 项目介绍卡片容器（p-5 mb-5 max-sm:mb-4）
  .about-project {
    padding: 1.25rem; // p-5
    margin-bottom: 1.25rem; // mb-5

    @media (width <= 39.99rem) {
      // max-sm:mb-4
      margin-bottom: 1rem;
    }
  }

  // 标题（text-2xl font-medium）
  .about-project-title {
    font-size: 1.5rem; // text-2xl
    font-weight: 500; // font-medium
    line-height: 2rem; // text-2xl
  }

  // 描述文字（text-g-700 mt-1）
  .about-project-desc {
    margin-top: 0.25rem; // mt-1
    color: var(--ao-gray-700); // text-g-700
  }

  // 链接列表容器（flex flex-wrap gap-3.5 max-w-150 mt-9）
  .about-project-links {
    display: flex; // flex
    flex-wrap: wrap; // flex-wrap
    gap: 0.875rem; // gap-3.5
    max-width: 37.5rem; // max-w-150
    margin-top: 2.25rem; // mt-9
  }

  // 单个链接项（w-60 h-12.5 px-3.5 border border-g-300 rounded-lg text-sm bg-g-100 duration-300 hover:-translate-y-1 max-sm:w-full）
  .about-project-link {
    width: 15rem; // w-60
    height: 3.125rem; // h-12.5
    padding-right: 0.875rem; // px-3.5
    padding-left: 0.875rem; // px-3.5
    font-size: 0.875rem; // text-sm
    line-height: 1.25rem; // text-sm
    background: var(--ao-gray-100); // bg-g-100
    border: 1px solid var(--ao-gray-300); // border border-g-300
    border-radius: 0.5rem; // rounded-lg
    // 还原 duration-300 + hover:-translate-y-1 的过渡效果
    transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      // hover:-translate-y-1
      transform: translateY(-0.25rem);
    }

    @media (width <= 39.99rem) {
      // max-sm:w-full
      width: 100%;
    }
  }

  // 链接文字（text-g-700）
  .about-project-link-label {
    color: var(--ao-gray-700); // text-g-700
  }

  // 链接箭头图标（text-lg text-g-600）
  .about-project-link-icon {
    font-size: 1.125rem; // text-lg
    line-height: 1.75rem; // text-lg
    color: var(--ao-gray-600); // text-g-600
  }

  // 右侧插图（w-75 max-md:!hidden）
  .about-project-img {
    width: 18.75rem; // w-75

    @media (width <= 47.99rem) {
      // max-md:!hidden
      display: none !important;
    }
  }
</style>
