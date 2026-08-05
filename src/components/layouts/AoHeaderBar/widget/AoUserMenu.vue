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
      <img class="user-avatar" src="@imgs/user/avatar.webp" alt="avatar" />
    </template>
    <template #default>
      <div class="user-menu">
        <div class="user-menu__header">
          <img class="user-menu__avatar" src="@imgs/user/avatar.webp" />
          <div class="user-menu__info">
            <span class="user-menu__name">{{ userInfo.userName }}</span>
            <span class="user-menu__email">{{ userInfo.email }}</span>
          </div>
        </div>
        <ul class="user-menu__list">
          <li class="btn-item" @click="goPage('/system/user-center')">
            <AoSvgIcon icon="ri:user-3-line" />
            <span>{{ $t('topBar.user.userCenter') }}</span>
          </li>
          <div class="user-menu__divider"></div>
          <div class="log-out" @click="loginOut">
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

  defineOptions({ name: 'AoUserMenu' })

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
  // 头像（弹层触发器）
  .user-avatar {
    width: 2.125rem;
    height: 2.125rem;
    margin-right: 1.25rem;
    cursor: pointer;
    border-radius: 9999px;
    @media (width <= 39.99rem) {
      width: 1.625rem;
      height: 1.625rem;
      margin-right: 16px;
    }
  }

  // 用户菜单弹层
  .user-menu {
    padding-top: 0.75rem;
    &__header {
      display: flex;
      align-items: center;
      padding-right: 0;
      padding-bottom: 0.25rem;
      padding-left: 0;
    }
    &__avatar {
      float: left;
      width: 2.5rem;
      height: 2.5rem;
      margin-right: 0.75rem;
      margin-left: 0;
      overflow: hidden;
      border-radius: 9999px;
    }
    &__info {
      width: calc(100% - 60px);
      height: 100%;
    }
    // 用户名
    &__name {
      display: block;
      overflow: hidden;
      font-size: 0.875rem;
      font-weight: 500;
      line-height: 1.25rem;
      color: var(--ao-gray-800);
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    // 邮箱
    &__email {
      display: block;
      margin-top: 0.125rem;
      overflow: hidden;
      font-size: 0.75rem;
      line-height: 1rem;
      color: var(--ao-gray-500);
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &__list {
      padding-top: 1rem;
      padding-bottom: 1rem;
      margin-top: 0.75rem;
      border-top: 1px solid color-mix(in srgb, var(--ao-gray-300) 80%, transparent);
    }
    // 分割线
    &__divider {
      width: 100%;
      height: 1px;
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
      background: color-mix(in srgb, var(--ao-gray-300) 80%, transparent);
    }
  }

  // 菜单项
  .btn-item {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    margin-bottom: 0.75rem;
    cursor: pointer;
    user-select: none;
    border-radius: 0.375rem;
    &:last-child {
      margin-bottom: 0;
    }
    span {
      font-size: 0.875rem;
      line-height: 1.25rem;
    }
    :deep(.ao-svg-icon) {
      margin-right: 0.5rem;
      font-size: 1rem;
      line-height: 1.5rem;
    }
    &:hover {
      background-color: var(--ao-gray-200);
    }
  }

  // 退出登录按钮
  .log-out {
    padding-top: 0.375rem;
    padding-bottom: 0.375rem;
    margin-top: 1.25rem;
    font-size: 0.75rem;
    line-height: 1rem;
    text-align: center;
    cursor: pointer;
    border: 1px solid var(--ao-gray-400);
    border-radius: 0.375rem;
    transition-duration: 200ms;
    transition-property: all;
    &:hover {
      box-shadow:
        0 20px 25px -5px var(--ao-shadow-10),
        0 8px 10px -6px var(--ao-shadow-10);
    }
  }
</style>
