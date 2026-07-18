<!-- 系统聊天窗口 -->
<template>
  <div>
    <ElDrawer v-model="isDrawerVisible" :size="isMobile ? '100%' : '480px'" :with-header="false">
      <div class="chat-header flex-cb">
        <div>
          <span class="chat-header__title">Art Bot</span>
          <div class="chat-header__status flex-c">
            <div
              class="chat-header__dot"
              :class="isOnline ? 'chat-header__dot--online' : 'chat-header__dot--offline'"
            ></div>
            <span class="chat-header__status-text">{{ isOnline ? '在线' : '离线' }}</span>
          </div>
        </div>
        <div>
          <ElIcon class="c-p" :size="20" @click="closeChat">
            <Close />
          </ElIcon>
        </div>
      </div>
      <div class="chat-body">
        <!-- 聊天消息区域 -->
        <div
          class="chat-messages border-t-d"
          ref="messageContainer"
        >
          <template v-for="(message, index) in messages" :key="index">
            <div
              class="chat-message"
              :class="message.isMe ? 'chat-message--reverse' : 'chat-message--normal'"
            >
              <ElAvatar :size="32" :src="message.avatar" class="chat-message__avatar" />
              <div
                class="chat-message__content"
                :class="message.isMe ? 'chat-message__content--end' : 'chat-message__content--start'"
              >
                <div
                  class="chat-message__meta"
                  :class="message.isMe ? 'chat-message__meta--reverse' : 'chat-message__meta--normal'"
                >
                  <span class="chat-message__sender">{{ message.sender }}</span>
                  <span class="chat-message__time">{{ message.time }}</span>
                </div>
                <div
                  class="chat-message__bubble"
                  :class="message.isMe ? 'message-right' : 'message-left'"
                  >{{ message.content }}</div
                >
              </div>
            </div>
          </template>
        </div>

        <!-- 聊天输入区域 -->
        <div class="chat-input">
          <ElInput
            v-model="messageText"
            type="textarea"
            :rows="3"
            placeholder="输入消息"
            resize="none"
            @keyup.enter.prevent="sendMessage"
          >
            <template #append>
              <div class="chat-input__actions">
                <ElButton :icon="Paperclip" circle plain />
                <ElButton :icon="Picture" circle plain />
                <ElButton type="primary" @click="sendMessage" v-ripple>发送</ElButton>
              </div>
            </template>
          </ElInput>
          <div class="chat-input__footer flex-cb">
            <div class="flex-c">
              <ArtSvgIcon icon="ri:image-line" class="chat-input__icon c-p" />
              <ArtSvgIcon icon="ri:emotion-happy-line" class="chat-input__icon c-p" />
            </div>
            <ElButton type="primary" @click="sendMessage" v-ripple class="chat-input__send">发送</ElButton>
          </div>
        </div>
      </div>
    </ElDrawer>
  </div>
</template>

<script setup lang="ts">
  import { Picture, Paperclip, Close } from '@element-plus/icons-vue'
  import { mittBus } from '@/utils/sys'
  import meAvatar from '@/assets/images/avatar/avatar5.webp'
  import aiAvatar from '@/assets/images/avatar/avatar10.webp'

  defineOptions({ name: 'ArtChatWindow' })

  // 类型定义
  interface ChatMessage {
    id: number
    sender: string
    content: string
    time: string
    isMe: boolean
    avatar: string
  }

  // 常量定义
  const MOBILE_BREAKPOINT = 640
  const SCROLL_DELAY = 100
  const BOT_NAME = 'Art Bot'
  const USER_NAME = 'Ricky'

  // 响应式布局
  const { width } = useWindowSize()
  const isMobile = computed(() => width.value < MOBILE_BREAKPOINT)

  // 组件状态
  const isDrawerVisible = ref(false)
  const isOnline = ref(true)

  // 消息相关状态
  const messageText = ref('')
  const messageId = ref(10)
  const messageContainer = ref<HTMLElement | null>(null)

  // 初始化聊天消息数据
  const initializeMessages = (): ChatMessage[] => [
    {
      id: 1,
      sender: BOT_NAME,
      content: '你好！我是你的AI助手，有什么我可以帮你的吗？',
      time: '10:00',
      isMe: false,
      avatar: aiAvatar
    },
    {
      id: 2,
      sender: USER_NAME,
      content: '我想了解一下系统的使用方法。',
      time: '10:01',
      isMe: true,
      avatar: meAvatar
    },
    {
      id: 3,
      sender: BOT_NAME,
      content: '好的，我来为您介绍系统的主要功能。首先，您可以通过左侧菜单访问不同的功能模块...',
      time: '10:02',
      isMe: false,
      avatar: aiAvatar
    },
    {
      id: 4,
      sender: USER_NAME,
      content: '听起来很不错，能具体讲讲数据分析部分吗？',
      time: '10:05',
      isMe: true,
      avatar: meAvatar
    },
    {
      id: 5,
      sender: BOT_NAME,
      content: '当然可以。数据分析模块可以帮助您实时监控关键指标，并生成详细的报表...',
      time: '10:06',
      isMe: false,
      avatar: aiAvatar
    },
    {
      id: 6,
      sender: USER_NAME,
      content: '太好了，那我如何开始使用呢？',
      time: '10:08',
      isMe: true,
      avatar: meAvatar
    },
    {
      id: 7,
      sender: BOT_NAME,
      content: '您可以先创建一个项目，然后在项目中添加相关的数据源，系统会自动进行分析。',
      time: '10:09',
      isMe: false,
      avatar: aiAvatar
    },
    {
      id: 8,
      sender: USER_NAME,
      content: '明白了，谢谢你的帮助！',
      time: '10:10',
      isMe: true,
      avatar: meAvatar
    },
    {
      id: 9,
      sender: BOT_NAME,
      content: '不客气，有任何问题随时联系我。',
      time: '10:11',
      isMe: false,
      avatar: aiAvatar
    }
  ]

  const messages = ref<ChatMessage[]>(initializeMessages())

  // 工具函数
  const formatCurrentTime = (): string => {
    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const scrollToBottom = (): void => {
    nextTick(() => {
      setTimeout(() => {
        if (messageContainer.value) {
          messageContainer.value.scrollTop = messageContainer.value.scrollHeight
        }
      }, SCROLL_DELAY)
    })
  }

  // 消息处理方法
  const sendMessage = (): void => {
    const text = messageText.value.trim()
    if (!text) return

    const newMessage: ChatMessage = {
      id: messageId.value++,
      sender: USER_NAME,
      content: text,
      time: formatCurrentTime(),
      isMe: true,
      avatar: meAvatar
    }

    messages.value.push(newMessage)
    messageText.value = ''
    scrollToBottom()
  }

  // 聊天窗口控制方法
  const openChat = (): void => {
    isDrawerVisible.value = true
    scrollToBottom()
  }

  const closeChat = (): void => {
    isDrawerVisible.value = false
  }

  // 生命周期
  onMounted(() => {
    scrollToBottom()
    mittBus.on('openChat', openChat)
  })

  onUnmounted(() => {
    mittBus.off('openChat', openChat)
  })
</script>

<style scoped lang="scss">
  // ==================== 头部 ====================
  // mb-5 flex-cb
  // 保留全局工具类 flex-cb
  .chat-header {
    margin-bottom: 1.25rem; // mb-5

    // text-base font-medium
    &__title {
      font-size: 1rem; // text-base
      line-height: 1.5rem;
      font-weight: 500; // font-medium
    }

    // mt-1.5 flex-c gap-1
    // 保留全局工具类 flex-c
    &__status {
      margin-top: 0.375rem; // mt-1.5
      gap: 0.25rem; // gap-1
    }

    // h-2 w-2 rounded-full
    &__dot {
      width: 0.5rem; // w-2
      height: 0.5rem; // h-2
      border-radius: 9999px; // rounded-full

      // bg-success/100
      &--online {
        background: var(--art-success);
      }

      // bg-danger/100
      &--offline {
        background: var(--art-danger);
      }
    }

    // text-xs text-g-600
    &__status-text {
      font-size: 0.75rem; // text-xs
      line-height: 1rem;
      color: var(--art-gray-600);
    }
  }

  // ==================== 主体布局 ====================
  // flex h-[calc(100%-70px)] flex-col
  .chat-body {
    display: flex;
    flex-direction: column; // flex-col
    height: calc(100% - 70px); // h-[calc(100%-70px)]
  }

  // ==================== 消息列表 ====================
  // flex-1 overflow-y-auto border-t-d px-4 py-7.5 [&::-webkit-scrollbar]:!w-1
  // 保留全局工具类 border-t-d
  .chat-messages {
    flex: 1 1 0%; // flex-1
    overflow-y: auto;
    padding-left: 1rem; // px-4
    padding-right: 1rem;
    padding-top: 1.875rem; // py-7.5
    padding-bottom: 1.875rem;

    // [&::-webkit-scrollbar]:!w-1
    &::-webkit-scrollbar {
      width: 0.25rem !important;
    }
  }

  // 单条消息：mb-7.5 flex w-full items-start gap-2
  .chat-message {
    display: flex;
    width: 100%; // w-full
    align-items: flex-start; // items-start
    gap: 0.5rem; // gap-2
    margin-bottom: 1.875rem; // mb-7.5

    // flex-row-reverse
    &--reverse {
      flex-direction: row-reverse;
    }

    // flex-row
    &--normal {
      flex-direction: row;
    }

    // shrink-0
    &__avatar {
      flex-shrink: 0;
    }

    // flex max-w-[70%] flex-col
    &__content {
      display: flex;
      flex-direction: column;
      max-width: 70%; // max-w-[70%]

      // items-end
      &--end {
        align-items: flex-end;
      }

      // items-start
      &--start {
        align-items: flex-start;
      }
    }

    // mb-1 flex gap-2 text-xs
    &__meta {
      display: flex;
      gap: 0.5rem; // gap-2
      margin-bottom: 0.25rem; // mb-1
      font-size: 0.75rem; // text-xs
      line-height: 1rem;

      &--reverse {
        flex-direction: row-reverse;
      }

      &--normal {
        flex-direction: row;
      }
    }

    // font-medium
    &__sender {
      font-weight: 500; // font-medium
    }

    // text-g-600
    &__time {
      color: var(--art-gray-600);
    }

    // rounded-md px-3.5 py-2.5 text-sm leading-[1.4] text-g-900
    &__bubble {
      padding-left: 0.875rem; // px-3.5
      padding-right: 0.875rem;
      padding-top: 0.625rem; // py-2.5
      padding-bottom: 0.625rem;
      font-size: 0.875rem; // text-sm
      line-height: 1.4; // leading-[1.4]
      color: var(--art-gray-900);
      border-radius: 0.375rem; // rounded-md
    }
  }

  // 消息气泡背景色
  // bg-theme/15
  .message-right {
    background: color-mix(in srgb, var(--theme-color) 15%, transparent);
  }

  // bg-g-300/50
  .message-left {
    background: color-mix(in srgb, var(--art-gray-300) 50%, transparent);
  }

  // ==================== 输入区域 ====================
  // px-4 pt-4
  .chat-input {
    padding-left: 1rem; // px-4
    padding-right: 1rem;
    padding-top: 1rem; // pt-4

    // flex gap-2 py-2
    &__actions {
      display: flex;
      gap: 0.5rem; // gap-2
      padding-top: 0.5rem; // py-2
      padding-bottom: 0.5rem;
    }

    // mt-3 flex-cb
    // 保留全局工具类 flex-cb
    &__footer {
      margin-top: 0.75rem; // mt-3
    }

    // mr-5 c-p text-g-600 text-lg
    // 保留全局工具类 c-p
    &__icon {
      margin-right: 1.25rem; // mr-5
      font-size: 1.125rem; // text-lg
      line-height: 1.75rem;
      color: var(--art-gray-600);
    }

    // min-w-20
    &__send {
      min-width: 5rem; // min-w-20
    }
  }
</style>
