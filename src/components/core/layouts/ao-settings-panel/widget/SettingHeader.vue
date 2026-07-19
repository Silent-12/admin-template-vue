<template>
  <div>
    <div class="header-actions">
      <div @click="$emit('close')" class="close-btn flex-cc c-p">
        <AoSvgIcon icon="ri:close-fill" class="close-btn-icon" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineEmits<{
    close: []
  }>()
</script>

<style scoped lang="scss">
  // 头部操作区（右对齐）
  .header-actions {
    display: flex; // flex
    justify-content: flex-end; // justify-end
  }

  // 关闭按钮
  .close-btn {
    width: 1.875rem; // size-7.5
    height: 1.875rem; // size-7.5
    border-radius: 0.25rem; // rounded
    transition-duration: 200ms; // duration-200
    transition-property: all !important; // !transition-all

    &:hover {
      // hover:bg-g-300/80（alpha 80%）
      background: color-mix(in srgb, var(--ao-gray-300) 80%, transparent);
    }
  }

  // 关闭按钮图标
  .close-btn-icon {
    display: block; // block
    font-size: 1.25rem; // text-xl
    line-height: 1.75rem; // text-xl
    color: var(--ao-gray-600); // text-g-600
  }
</style>
