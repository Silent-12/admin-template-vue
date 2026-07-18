<!-- 通知组件 -->
<template>
  <div
    class="art-notification-panel art-card-sm notification-panel"
    :style="{
      transform: show ? 'scaleY(1)' : 'scaleY(0.9)',
      opacity: show ? 1 : 0
    }"
    v-show="visible"
    @click.stop
  >
    <div class="notification-panel__header flex-cb">
      <span class="notification-panel__title">{{ $t('notice.title') }}</span>
      <span class="notification-panel__read-btn c-p">
        {{ $t('notice.btnRead') }}
      </span>
    </div>

    <ul class="notification-panel__tabs box-border flex border-b-d">
      <li
        v-for="(item, index) in barList"
        :key="index"
        class="notification-panel__tab c-p"
        :class="{ 'bar-active': barActiveIndex === index }"
        @click="changeBar(index)"
      >
        {{ item.name }} ({{ item.num }})
      </li>
    </ul>

    <div class="notification-panel__content">
      <div class="notification-panel__scroll scrollbar-thin">
        <!-- 通知 -->
        <ul v-show="barActiveIndex === 0">
          <li
            v-for="(item, index) in noticeList"
            :key="index"
            class="notification-item flex-c c-p"
          >
            <div
              class="notification-item__icon flex-cc"
              :class="[getNoticeStyle(item.type).iconClass]"
            >
              <ArtSvgIcon
                class="notification-item__icon-svg"
                :icon="getNoticeStyle(item.type).icon"
              />
            </div>
            <div class="notification-item__body">
              <h4 class="notification-item__title">{{ item.title }}</h4>
              <p class="notification-item__time">{{ item.time }}</p>
            </div>
          </li>
        </ul>

        <!-- 消息 -->
        <ul v-show="barActiveIndex === 1">
          <li
            v-for="(item, index) in msgList"
            :key="index"
            class="notification-item flex-c c-p"
          >
            <div class="notification-item__avatar-box">
              <img :src="item.avatar" class="notification-item__avatar" />
            </div>
            <div class="notification-item__body">
              <h4 class="notification-item__msg-title">{{ item.title }}</h4>
              <p class="notification-item__time">{{ item.time }}</p>
            </div>
          </li>
        </ul>

        <!-- 待办 -->
        <ul v-show="barActiveIndex === 2">
          <li
            v-for="(item, index) in pendingList"
            :key="index"
            class="pending-item box-border"
          >
            <h4>{{ item.title }}</h4>
            <p class="pending-item__time">{{ item.time }}</p>
          </li>
        </ul>

        <!-- 空状态 -->
        <div
          v-show="currentTabIsEmpty"
          class="notification-empty"
        >
          <ArtSvgIcon icon="system-uicons:inbox" class="notification-empty__icon" />
          <p class="notification-empty__text"
            >{{ $t('notice.text[0]') }}{{ barList[barActiveIndex].name }}</p
          >
        </div>
      </div>

      <div class="notification-panel__footer box-border">
        <ElButton class="notification-panel__view-all" @click="handleViewAll" v-ripple>
          {{ $t('notice.viewAll') }}
        </ElButton>
      </div>
    </div>

    <div class="notification-panel__bottom-spacer"></div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch, type Ref, type ComputedRef } from 'vue'
  import { useI18n } from 'vue-i18n'

  // 导入头像图片
  import avatar1 from '@/assets/images/avatar/avatar1.webp'
  import avatar2 from '@/assets/images/avatar/avatar2.webp'
  import avatar3 from '@/assets/images/avatar/avatar3.webp'
  import avatar4 from '@/assets/images/avatar/avatar4.webp'
  import avatar5 from '@/assets/images/avatar/avatar5.webp'
  import avatar6 from '@/assets/images/avatar/avatar6.webp'

  defineOptions({ name: 'ArtNotification' })

  interface NoticeItem {
    /** 标题 */
    title: string
    /** 时间 */
    time: string
    /** 类型 */
    type: NoticeType
  }

  interface MessageItem {
    /** 标题 */
    title: string
    /** 时间 */
    time: string
    /** 头像 */
    avatar: string
  }

  interface PendingItem {
    /** 标题 */
    title: string
    /** 时间 */
    time: string
  }

  interface BarItem {
    /** 名称 */
    name: ComputedRef<string>
    /** 数量 */
    num: number
  }

  interface NoticeStyle {
    /** 图标 */
    icon: string
    /** icon 样式 */
    iconClass: string
  }

  type NoticeType = 'email' | 'message' | 'collection' | 'user' | 'notice'

  const { t } = useI18n()

  const props = defineProps<{
    value: boolean
  }>()

  const emit = defineEmits<{
    'update:value': [value: boolean]
  }>()

  const show = ref(false)
  const visible = ref(false)
  const barActiveIndex = ref(0)

  const useNotificationData = () => {
    // 通知数据
    const noticeList = ref<NoticeItem[]>([
      {
        title: '新增国际化',
        time: '2024-6-13 0:10',
        type: 'notice'
      },
      {
        title: '冷月呆呆给你发了一条消息',
        time: '2024-4-21 8:05',
        type: 'message'
      },
      {
        title: '小肥猪关注了你',
        time: '2020-3-17 21:12',
        type: 'collection'
      },
      {
        title: '新增使用文档',
        time: '2024-02-14 0:20',
        type: 'notice'
      },
      {
        title: '小肥猪给你发了一封邮件',
        time: '2024-1-20 0:15',
        type: 'email'
      },
      {
        title: '菜单mock本地真实数据',
        time: '2024-1-17 22:06',
        type: 'notice'
      }
    ])

    // 消息数据
    const msgList = ref<MessageItem[]>([
      {
        title: '池不胖 关注了你',
        time: '2021-2-26 23:50',
        avatar: avatar1
      },
      {
        title: '唐不苦 关注了你',
        time: '2021-2-21 8:05',
        avatar: avatar2
      },
      {
        title: '中小鱼 关注了你',
        time: '2020-1-17 21:12',
        avatar: avatar3
      },
      {
        title: '何小荷 关注了你',
        time: '2021-01-14 0:20',
        avatar: avatar4
      },
      {
        title: '誶誶淰 关注了你',
        time: '2020-12-20 0:15',
        avatar: avatar5
      },
      {
        title: '冷月呆呆 关注了你',
        time: '2020-12-17 22:06',
        avatar: avatar6
      }
    ])

    // 待办数据
    const pendingList = ref<PendingItem[]>([])

    // 标签栏数据
    const barList = computed<BarItem[]>(() => [
      {
        name: computed(() => t('notice.bar[0]')),
        num: noticeList.value.length
      },
      {
        name: computed(() => t('notice.bar[1]')),
        num: msgList.value.length
      },
      {
        name: computed(() => t('notice.bar[2]')),
        num: pendingList.value.length
      }
    ])

    return {
      noticeList,
      msgList,
      pendingList,
      barList
    }
  }

  // 样式管理
  const useNotificationStyles = () => {
    // 通知图标样式映射（使用语义化类名，对应 SCSS 中定义）
    const noticeStyleMap: Record<NoticeType, NoticeStyle> = {
      email: {
        icon: 'ri:mail-line',
        iconClass: 'notice-icon--email'
      },
      message: {
        icon: 'ri:volume-down-line',
        iconClass: 'notice-icon--message'
      },
      collection: {
        icon: 'ri:heart-3-line',
        iconClass: 'notice-icon--collection'
      },
      user: {
        icon: 'ri:volume-down-line',
        iconClass: 'notice-icon--user'
      },
      notice: {
        icon: 'ri:notification-3-line',
        iconClass: 'notice-icon--notice'
      }
    }

    const getNoticeStyle = (type: NoticeType): NoticeStyle => {
      const defaultStyle: NoticeStyle = {
        icon: 'ri:arrow-right-circle-line',
        iconClass: 'notice-icon--notice'
      }

      return noticeStyleMap[type] || defaultStyle
    }

    return {
      getNoticeStyle
    }
  }

  // 动画管理
  const useNotificationAnimation = () => {
    const showNotice = (open: boolean) => {
      if (open) {
        visible.value = true
        setTimeout(() => {
          show.value = true
        }, 5)
      } else {
        show.value = false
        setTimeout(() => {
          visible.value = false
        }, 350)
      }
    }

    return {
      showNotice
    }
  }

  // 标签页管理
  const useTabManagement = (
    noticeList: Ref<NoticeItem[]>,
    msgList: Ref<MessageItem[]>,
    pendingList: Ref<PendingItem[]>,
    businessHandlers: {
      handleNoticeAll: () => void
      handleMsgAll: () => void
      handlePendingAll: () => void
    }
  ) => {
    const changeBar = (index: number) => {
      barActiveIndex.value = index
    }

    // 检查当前标签页是否为空
    const currentTabIsEmpty = computed(() => {
      const tabDataMap = [noticeList.value, msgList.value, pendingList.value]

      const currentData = tabDataMap[barActiveIndex.value]
      return currentData && currentData.length === 0
    })

    const handleViewAll = () => {
      // 查看全部处理器映射
      const viewAllHandlers: Record<number, () => void> = {
        0: businessHandlers.handleNoticeAll,
        1: businessHandlers.handleMsgAll,
        2: businessHandlers.handlePendingAll
      }

      const handler = viewAllHandlers[barActiveIndex.value]
      handler?.()

      // 关闭通知面板
      emit('update:value', false)
    }

    return {
      changeBar,
      currentTabIsEmpty,
      handleViewAll
    }
  }

  // 业务逻辑处理
  const useBusinessLogic = () => {
    const handleNoticeAll = () => {
      // 处理查看全部通知
      console.log('查看全部通知')
    }

    const handleMsgAll = () => {
      // 处理查看全部消息
      console.log('查看全部消息')
    }

    const handlePendingAll = () => {
      // 处理查看全部待办
      console.log('查看全部待办')
    }

    return {
      handleNoticeAll,
      handleMsgAll,
      handlePendingAll
    }
  }

  // 组合所有逻辑
  const { noticeList, msgList, pendingList, barList } = useNotificationData()
  const { getNoticeStyle } = useNotificationStyles()
  const { showNotice } = useNotificationAnimation()
  const { handleNoticeAll, handleMsgAll, handlePendingAll } = useBusinessLogic()
  const { changeBar, currentTabIsEmpty, handleViewAll } = useTabManagement(
    noticeList,
    msgList,
    pendingList,
    { handleNoticeAll, handleMsgAll, handlePendingAll }
  )

  // 监听属性变化
  watch(
    () => props.value,
    (newValue) => {
      showNotice(newValue)
    }
  )
</script>

<style scoped lang="scss">
  // ==================== 通知面板容器（原 @apply 展开） ====================
  // 原: @apply absolute top-14.5 right-5 w-90 h-125 overflow-hidden transition-all
  //      duration-300 origin-top will-change-[top,left]
  //      max-[640px]:top-[65px] max-[640px]:right-0 max-[640px]:w-full max-[640px]:h-[80vh];
  // 保留自定义类 art-notification-panel art-card-sm
  .notification-panel {
    position: absolute; // absolute
    top: 3.625rem; // top-14.5
    right: 1.25rem; // right-5
    width: 22.5rem; // w-90
    height: 31.25rem; // h-125
    overflow: hidden;
    transition-property: all; // transition-all
    transition-duration: 300ms; // duration-300
    transform-origin: top; // origin-top
    will-change: top, left; // will-change-[top,left]
    // !shadow-xl
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) !important;

    @media (max-width: 640px) {
      top: 65px; // max-[640px]:top-[65px]
      right: 0; // max-[640px]:right-0
      width: 100%; // max-[640px]:w-full
      height: 80vh; // max-[640px]:h-[80vh]
    }
  }

  // ==================== 头部 ====================
  // flex-cb px-3.5 mt-3.5
  // 保留全局工具类 flex-cb
  .notification-panel__header {
    padding-left: 0.875rem; // px-3.5
    padding-right: 0.875rem;
    margin-top: 0.875rem; // mt-3.5
  }

  // text-base font-medium text-g-800
  .notification-panel__title {
    font-size: 1rem; // text-base
    line-height: 1.5rem;
    font-weight: 500; // font-medium
    color: var(--art-gray-800);
  }

  // text-xs text-g-800 px-1.5 py-1 c-p select-none rounded hover:bg-g-200
  // 保留全局工具类 c-p
  .notification-panel__read-btn {
    padding-left: 0.375rem; // px-1.5
    padding-right: 0.375rem;
    padding-top: 0.25rem; // py-1
    padding-bottom: 0.25rem;
    font-size: 0.75rem; // text-xs
    line-height: 1rem;
    color: var(--art-gray-800);
    user-select: none; // select-none
    border-radius: 0.25rem; // rounded

    &:hover {
      background: var(--art-gray-200); // hover:bg-g-200
    }
  }

  // ==================== 标签栏 ====================
  // box-border flex items-end w-full h-12.5 px-3.5 border-b-d
  // 保留全局工具类 border-b-d
  .notification-panel__tabs {
    display: flex;
    align-items: flex-end; // items-end
    width: 100%; // w-full
    height: 3.125rem; // h-12.5
    padding-left: 0.875rem; // px-3.5
    padding-right: 0.875rem;
    box-sizing: border-box;
  }

  // h-12 leading-12 mr-5 overflow-hidden text-[13px] text-g-700 c-p select-none
  // 保留全局工具类 c-p
  .notification-panel__tab {
    height: 3rem; // h-12
    line-height: 3rem; // leading-12
    margin-right: 1.25rem; // mr-5
    overflow: hidden;
    font-size: 13px; // text-[13px]
    color: var(--art-gray-700);
    user-select: none; // select-none
  }

  // ==================== 内容区 ====================
  // w-full h-[calc(100%-95px)]
  .notification-panel__content {
    width: 100%;
    height: calc(100% - 95px); // h-[calc(100%-95px)]
  }

  // h-[calc(100%-60px)] overflow-y-scroll scrollbar-thin
  .notification-panel__scroll {
    height: calc(100% - 60px); // h-[calc(100%-60px)]
    overflow-y: scroll;
  }

  // 自定义滚动条
  .scrollbar-thin::-webkit-scrollbar {
    width: 5px !important;
  }

  .dark .scrollbar-thin::-webkit-scrollbar-track {
    background-color: var(--default-box-color);
  }

  .dark .scrollbar-thin::-webkit-scrollbar-thumb {
    background-color: #222 !important;
  }

  // ==================== 通知/消息项 ====================
  // box-border flex-c px-3.5 py-3.5 c-p last:border-b-0 hover:bg-g-200/60
  // 保留全局工具类 flex-c c-p
  .notification-item {
    padding-left: 0.875rem; // px-3.5
    padding-right: 0.875rem;
    padding-top: 0.875rem; // py-3.5
    padding-bottom: 0.875rem;
    box-sizing: border-box;

    &:last-child {
      border-bottom: 0; // last:border-b-0
    }

    &:hover {
      background: color-mix(in srgb, var(--art-gray-200) 60%, transparent); // hover:bg-g-200/60
    }
  }

  // 图标容器：size-9 leading-9 text-center rounded-lg flex-cc
  // 保留全局工具类 flex-cc
  .notification-item__icon {
    width: 2.25rem; // size-9
    height: 2.25rem;
    line-height: 2.25rem; // leading-9
    text-align: center; // text-center
    border-radius: 0.5rem; // rounded-lg
  }

  // 图标 SVG：text-lg !bg-transparent
  .notification-item__icon-svg {
    font-size: 1.125rem; // text-lg
    line-height: 1.75rem;
    background: transparent !important; // !bg-transparent
  }

  // 文本主体：w-[calc(100%-45px)] ml-3.5
  .notification-item__body {
    width: calc(100% - 45px); // w-[calc(100%-45px)]
    margin-left: 0.875rem; // ml-3.5
  }

  // 通知标题：text-sm font-normal leading-5.5 text-g-900
  .notification-item__title {
    font-size: 0.875rem; // text-sm
    line-height: 1.375rem; // leading-5.5
    font-weight: 400; // font-normal
    color: var(--art-gray-900);
  }

  // 消息标题：text-xs font-normal leading-5.5
  .notification-item__msg-title {
    font-size: 0.75rem; // text-xs
    line-height: 1rem;
    font-weight: 400; // font-normal
    line-height: 1.375rem; // leading-5.5
  }

  // 时间：mt-1.5 text-xs text-g-500
  .notification-item__time {
    margin-top: 0.375rem; // mt-1.5
    font-size: 0.75rem; // text-xs
    line-height: 1rem;
    color: var(--art-gray-500);
  }

  // 头像容器：w-9 h-9
  .notification-item__avatar-box {
    width: 2.25rem; // w-9
    height: 2.25rem; // h-9
  }

  // 头像图片：w-full h-full rounded-lg
  .notification-item__avatar {
    width: 100%; // w-full
    height: 100%; // h-full
    border-radius: 0.5rem; // rounded-lg
  }

  // ==================== 待办项 ====================
  // box-border px-5 py-3.5 last:border-b-0
  .pending-item {
    padding-left: 1.25rem; // px-5
    padding-right: 1.25rem;
    padding-top: 0.875rem; // py-3.5
    padding-bottom: 0.875rem;
    box-sizing: border-box;

    &:last-child {
      border-bottom: 0; // last:border-b-0
    }
  }

  // 时间：text-xs text-g-500
  .pending-item__time {
    font-size: 0.75rem; // text-xs
    line-height: 1rem;
    color: var(--art-gray-500);
  }

  // ==================== 空状态 ====================
  // relative top-25 h-full text-g-500 text-center !bg-transparent
  .notification-empty {
    position: relative;
    top: 6.25rem; // top-25
    height: 100%; // h-full
    color: var(--art-gray-500);
    text-align: center; // text-center
    background: transparent !important; // !bg-transparent
  }

  // 空状态图标：text-5xl
  .notification-empty__icon {
    font-size: 3rem; // text-5xl
    line-height: 1;
  }

  // 空状态文字：mt-3.5 text-xs !bg-transparent
  .notification-empty__text {
    margin-top: 0.875rem; // mt-3.5
    font-size: 0.75rem; // text-xs
    line-height: 1rem;
    background: transparent !important; // !bg-transparent
  }

  // ==================== 底部按钮区 ====================
  // relative box-border w-full px-3.5
  .notification-panel__footer {
    position: relative;
    width: 100%; // w-full
    padding-left: 0.875rem; // px-3.5
    padding-right: 0.875rem;
    box-sizing: border-box;
  }

  // 查看全部按钮：w-full mt-3
  .notification-panel__view-all {
    width: 100%; // w-full
    margin-top: 0.75rem; // mt-3
  }

  // 底部占位：h-25
  .notification-panel__bottom-spacer {
    height: 6.25rem; // h-25
  }

  // ==================== 标签激活状态 ====================
  .bar-active {
    color: var(--theme-color) !important;
    border-bottom: 2px solid var(--theme-color);
  }

  // ==================== 通知图标类型样式（替代原 bg-*/text-* Tailwind 类） ====================
  // 原: bg-warning/12 text-warning
  .notice-icon--email {
    background: color-mix(in srgb, var(--art-warning) 12%, transparent);
    color: var(--art-warning);
  }

  // 原: bg-success/12 text-success
  .notice-icon--message {
    background: color-mix(in srgb, var(--art-success) 12%, transparent);
    color: var(--art-success);
  }

  // 原: bg-danger/12 text-danger
  .notice-icon--collection {
    background: color-mix(in srgb, var(--art-danger) 12%, transparent);
    color: var(--art-danger);
  }

  // 原: bg-info/12 text-info
  .notice-icon--user {
    background: color-mix(in srgb, var(--art-info) 12%, transparent);
    color: var(--art-info);
  }

  // 原: bg-theme/12 text-theme
  .notice-icon--notice {
    background: color-mix(in srgb, var(--theme-color) 12%, transparent);
    color: var(--theme-color);
  }
</style>
