<template>
  <div class="ao-card about-project">
    <div>
      <h2 class="about-project-title">{{ t('dashboard.console.aboutProject.title') }}</h2>
      <p class="about-project-desc"
        >{{ systemName }} {{ t('dashboard.console.aboutProject.desc1') }}</p
      >
      <p class="about-project-desc">{{ t('dashboard.console.aboutProject.desc2') }}</p>

      <div class="about-project-links">
        <div
          class="about-project-link"
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
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const systemName = AppConfig.systemInfo.name

  const linkList = computed(() => [
    {
      label: t('dashboard.console.aboutProject.officialSite'),
      url: 'https://www.artd.pro/docs/zh/'
    },
    {
      label: t('dashboard.console.aboutProject.documentation'),
      url: 'https://www.artd.pro/docs/zh/guide/introduce.html'
    },
    {
      label: t('dashboard.console.aboutProject.github'),
      url: 'https://github.com/Daymychen/art-design-pro'
    },
    {
      label: t('dashboard.console.aboutProject.bilibili'),
      url: 'https://space.bilibili.com/425500936?spm_id_from=333.1007.0.0'
    }
  ])

  /**
   * @description 在新标签页中打开指定 URL
   * @param url 要打开的网页地址
   */
  const goPage = (url: string): void => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
</script>

<style scoped lang="scss">
  // 项目介绍卡片容器
  .about-project {
    display: flex;
    justify-content: space-between;
    padding: 1.25rem;
    margin-bottom: 1.25rem;
    @media (width <= 39.99rem) {
      margin-bottom: 1rem;
    }
    // 标题
    &-title {
      font-size: 1.5rem;
      font-weight: 500;
      line-height: 2rem;
    }
    // 描述文字
    &-desc {
      margin-top: 0.25rem;
      color: var(--ao-gray-700);
    }
    // 链接列表容器
    &-links {
      display: flex;
      flex-wrap: wrap;
      gap: 0.875rem;
      max-width: 37.5rem;
      margin-top: 2.25rem;
    }
    // 单个链接项
    &-link {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 15rem;
      height: 3.125rem;
      padding-right: 0.875rem;
      padding-left: 0.875rem;
      font-size: 0.875rem;
      line-height: 1.25rem;
      cursor: pointer;
      background: var(--ao-gray-100);
      border: 1px solid var(--ao-gray-300);
      border-radius: 0.5rem;
      // 链接悬停时上移并保持平滑过渡
      transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
      &:hover {
        transform: translateY(-0.25rem);
      }
      @media (width <= 39.99rem) {
        width: 100%;
      }
    }
    // 链接文字
    &-link-label {
      color: var(--ao-gray-700);
    }
    // 链接箭头图标
    &-link-icon {
      font-size: 1.125rem;
      line-height: 1.75rem;
      color: var(--ao-gray-600);
    }
    // 右侧插图
    &-img {
      width: 18.75rem;
      @media (width <= 47.99rem) {
        display: none !important;
      }
    }
  }
</style>
