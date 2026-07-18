<!-- 用户菜单 -->
<template>
  <ElPopover
    ref="userMenuPopover"
    placement="bottom-end"
    :width="240"
    :hide-after="0"
    :offset="10"
    trigger="hover"
    :show-arrow="false"
    popper-class="user-menu-popover"
    popper-style="padding: 5px 16px;"
  >
    <template #reference>
      <img class="user-avatar c-p" src="@imgs/user/avatar.webp" alt="avatar" />
    </template>
    <template #default>
      <div class="user-menu">
        <div class="user-menu__header flex-c">
          <img class="user-menu__avatar" src="@imgs/user/avatar.webp" />
          <div class="user-menu__info">
            <span class="user-menu__name">{{ userInfo.userName }}</span>
            <span class="user-menu__email">{{ userInfo.email }}</span>
          </div>
        </div>
        <ul class="user-menu__list">
          <li class="btn-item" @click="goPage('/system/user-center')">
            <ArtSvgIcon icon="ri:user-3-line" />
            <span>{{ $t('topBar.user.userCenter') }}</span>
          </li>
          <li class="btn-item" @click="toDocs()">
            <ArtSvgIcon icon="ri:book-2-line" />
            <span>{{ $t('topBar.user.docs') }}</span>
          </li>
          <li class="btn-item" @click="toGithub()">
            <ArtSvgIcon icon="ri:github-line" />
            <span>{{ $t('topBar.user.github') }}</span>
          </li>
          <li class="btn-item" @click="lockScreen()">
            <ArtSvgIcon icon="ri:lock-line" />
            <span>{{ $t('topBar.user.lockScreen') }}</span>
          </li>
          <div class="user-menu__divider"></div>
          <div class="log-out c-p" @click="loginOut">
            {{ $t('topBar.user.logout') }}
          </div>
        </ul>
      </div>
    </template>
  </ElPopover>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { ElMessageBox } from 'element-plus'
  import { useUserStore } from '@/store/modules/user'
  import { WEB_LINKS } from '@/utils/constants'
  import { mittBus } from '@/utils/sys'

  defineOptions({ name: 'ArtUserMenu' })

  const router = useRouter()
  const { t } = useI18n()
  const userStore = useUserStore()

  const { getUserInfo: userInfo } = storeToRefs(userStore)
  const userMenuPopover = ref()

  /**
   * 页面跳转
   * @param {string} path - 目标路径
   */
  const goPage = (path: string): void => {
    router.push(path)
  }

  /**
   * 打开文档页面
   */
  const toDocs = (): void => {
    window.open(WEB_LINKS.DOCS)
  }

  /**
   * 打开 GitHub 页面
   */
  const toGithub = (): void => {
    window.open(WEB_LINKS.GITHUB)
  }

  /**
   * 打开锁屏功能
   */
  const lockScreen = (): void => {
    mittBus.emit('openLockScreen')
  }

  /**
   * 用户登出确认
   */
  const loginOut = (): void => {
    closeUserMenu()
    setTimeout(() => {
      ElMessageBox.confirm(t('common.logOutTips'), t('common.tips'), {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        customClass: 'login-out-dialog'
      }).then(() => {
        userStore.logOut()
      })
    }, 200)
  }

  /**
   * 关闭用户菜单弹出层
   */
  const closeUserMenu = (): void => {
    setTimeout(() => {
      userMenuPopover.value.hide()
    }, 100)
  }
</script>

<style scoped lang="scss">
  // ==================== 头像（弹层触发器） ====================
  // size-8.5 mr-5 c-p rounded-full max-sm:w-6.5 max-sm:h-6.5 max-sm:mr-[16px]
  // 保留全局工具类 c-p
  .user-avatar {
    width: 2.125rem; // size-8.5
    height: 2.125rem;
    margin-right: 1.25rem; // mr-5
    border-radius: 9999px; // rounded-full

    @media (max-width: 39.99rem) {
      width: 1.625rem; // max-sm:w-6.5
      height: 1.625rem; // max-sm:h-6.5
      margin-right: 16px; // max-sm:mr-[16px]
    }
  }

  // ==================== 用户菜单弹层 ====================
  .user-menu {
    padding-top: 0.75rem; // pt-3

    // flex-c pb-1 px-0
    // 保留全局工具类 flex-c
    &__header {
      padding-bottom: 0.25rem; // pb-1
      padding-left: 0;
      padding-right: 0;
    }

    // w-10 h-10 mr-3 ml-0 overflow-hidden rounded-full float-left
    &__avatar {
      width: 2.5rem; // w-10
      height: 2.5rem; // h-10
      margin-right: 0.75rem; // mr-3
      margin-left: 0; // ml-0
      overflow: hidden;
      border-radius: 9999px;
      float: left;
    }

    // w-[calc(100%-60px)] h-full
    &__info {
      width: calc(100% - 60px);
      height: 100%;
    }

    // 用户名 block text-sm font-medium text-g-800 truncate
    &__name {
      display: block;
      font-size: 0.875rem; // text-sm
      line-height: 1.25rem;
      font-weight: 500; // font-medium
      color: var(--art-gray-800);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap; // truncate
    }

    // 邮箱 block mt-0.5 text-xs text-g-500 truncate
    &__email {
      display: block;
      margin-top: 0.125rem; // mt-0.5
      font-size: 0.75rem; // text-xs
      line-height: 1rem;
      color: var(--art-gray-500);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    // py-4 mt-3 border-t border-g-300/80
    &__list {
      padding-top: 1rem; // py-4
      padding-bottom: 1rem;
      margin-top: 0.75rem; // mt-3
      border-top: 1px solid color-mix(in srgb, var(--art-gray-300) 80%, transparent); // border-t border-g-300/80
    }

    // 分割线 w-full h-px my-2 bg-g-300/80
    &__divider {
      width: 100%;
      height: 1px;
      margin-top: 0.5rem; // my-2
      margin-bottom: 0.5rem;
      background: color-mix(in srgb, var(--art-gray-300) 80%, transparent); // bg-g-300/80
    }
  }

  // ==================== 菜单项（原 @apply 展开） ====================
  // 原: @apply flex items-center p-2 mb-3 select-none rounded-md cursor-pointer last:mb-0;
  .btn-item {
    display: flex;
    align-items: center;
    padding: 0.5rem; // p-2
    margin-bottom: 0.75rem; // mb-3
    user-select: none;
    border-radius: 0.375rem; // rounded-md
    cursor: pointer;

    &:last-child {
      margin-bottom: 0; // last:mb-0
    }

    // 原: @apply text-sm;
    span {
      font-size: 0.875rem;
      line-height: 1.25rem;
    }

    // 原: @apply mr-2 text-base;
    :deep(.art-svg-icon) {
      margin-right: 0.5rem; // mr-2
      font-size: 1rem; // text-base
      line-height: 1.5rem;
    }

    &:hover {
      background-color: var(--art-gray-200);
    }
  }

  // ==================== 退出登录按钮（原 @apply 展开） ====================
  // 原: @apply py-1.5 mt-5 text-xs text-center border border-g-400 rounded-md
  //      transition-all duration-200 hover:shadow-xl;
  .log-out {
    padding-top: 0.375rem; // py-1.5
    padding-bottom: 0.375rem;
    margin-top: 1.25rem; // mt-5
    font-size: 0.75rem; // text-xs
    line-height: 1rem;
    text-align: center;
    border: 1px solid var(--art-gray-400); // border border-g-400
    border-radius: 0.375rem; // rounded-md
    transition-property: all;
    transition-duration: 200ms; // duration-200

    &:hover {
      // hover:shadow-xl
      box-shadow:
        0 20px 25px -5px rgb(0 0 0 / 0.1),
        0 8px 10px -6px rgb(0 0 0 / 0.1);
    }
  }
</style>
