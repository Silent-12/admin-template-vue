<!-- 表格按钮 -->
<template>
  <div
    :class="['art-button-table c-p', buttonClass]"
    :style="{ backgroundColor: buttonBgColor, color: iconColor }"
    @click="handleClick"
  >
    <ArtSvgIcon :icon="iconContent" />
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'ArtButtonTable' })

  interface Props {
    /** 按钮类型 */
    type?: 'add' | 'edit' | 'delete' | 'more' | 'view'
    /** 按钮图标 */
    icon?: string
    /** 按钮样式类 */
    iconClass?: string
    /** icon 颜色 */
    iconColor?: string
    /** 按钮背景色 */
    buttonBgColor?: string
  }

  const props = withDefaults(defineProps<Props>(), {})

  const emit = defineEmits<{
    (e: 'click'): void
  }>()

  // 默认按钮配置
  const defaultButtons = {
    add: { icon: 'ri:add-fill', class: 'art-btn-theme' },
    edit: { icon: 'ri:pencil-line', class: 'art-btn-secondary' },
    delete: { icon: 'ri:delete-bin-5-line', class: 'art-btn-error' },
    view: { icon: 'ri:eye-line', class: 'art-btn-info' },
    more: { icon: 'ri:more-2-fill', class: '' }
  } as const

  // 获取图标内容
  const iconContent = computed(() => {
    return props.icon || (props.type ? defaultButtons[props.type]?.icon : '') || ''
  })

  // 获取按钮样式类
  const buttonClass = computed(() => {
    return props.iconClass || (props.type ? defaultButtons[props.type]?.class : '') || ''
  })

  const handleClick = () => {
    emit('click')
  }
</script>

<style scoped lang="scss">
  // 表格按钮基础样式（原 inline-flex items-center justify-center min-w-8 h-8 px-2.5 mr-2.5 text-sm rounded-md align-middle）
  .art-button-table {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2rem;
    height: 2rem;
    padding-left: 0.625rem;
    padding-right: 0.625rem;
    margin-right: 0.625rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    border-radius: 0.375rem;
    vertical-align: middle;
  }

  // 主题色按钮（原 bg-theme/12 text-theme）
  .art-btn-theme {
    background-color: color-mix(in oklab, var(--theme-color) 12%, transparent);
    color: var(--theme-color);
  }

  // 次要色按钮（原 bg-secondary/12 text-secondary）
  .art-btn-secondary {
    background-color: color-mix(in oklab, var(--art-secondary) 12%, transparent);
    color: var(--art-secondary);
  }

  // 错误色按钮（原 bg-error/12 text-error）
  .art-btn-error {
    background-color: color-mix(in oklab, var(--art-error) 12%, transparent);
    color: var(--art-error);
  }

  // 信息色按钮（原 bg-info/12 text-info）
  .art-btn-info {
    background-color: color-mix(in oklab, var(--art-info) 12%, transparent);
    color: var(--art-info);
  }
</style>
