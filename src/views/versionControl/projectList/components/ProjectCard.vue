<template>
  <el-card class="project-card" shadow="hover">
    <div class="hd">
      <div class="title">
        <span class="name" :title="project.name">{{ project.name }}</span>
      </div>
    </div>

    <div class="bd">
      <div class="desc" :title="project.description || '暂无描述'">
        {{ project.description || '暂无描述' }}
      </div>
      <div class="appid" :title="`appid：${project.appid || '暂无'}`">
        <span class="appid-text">应用ID：{{ project.appid || '暂无' }}</span>
        <el-button
          type="primary"
          link
          class="copy"
          :disabled="!project.appid"
          @click.stop="handleCopyAppid(project.appid)"
        >
          <el-icon :size="16"><CopyDocument /></el-icon>
        </el-button>
      </div>
      <div class="time"> 更新于：{{ formatTime(project.updatedAt) }} </div>
    </div>

    <div class="ft">
      <el-button type="primary" link @click="$emit('edit', project)">
        <el-icon><Edit /></el-icon>
        编辑
      </el-button>
      <el-button type="primary" link @click="$emit('baseline', project)">
        <el-icon><Monitor /></el-icon>
        基线管理
      </el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
  import { CopyDocument, Edit, Monitor } from '@element-plus/icons-vue'
  import dayjs from 'dayjs'
  import type { WgtProjectItem } from '@/types/api/versionControl'
  import { copyText } from '@/utils'

  defineOptions({
    name: 'ProjectCard'
  })

  defineProps<{
    project: WgtProjectItem
  }>()

  defineEmits<{
    (e: 'edit', project: WgtProjectItem): void
    (e: 'baseline', project: WgtProjectItem): void
  }>()

  /**
   * @description 复制项目 AppID 到系统剪贴板。
   * @param {string} appid 需要复制的项目 AppID。
   * @return {Promise<void>} 复制流程完成后返回。
   */
  const handleCopyAppid = async (appid: string) => {
    if (!appid) return
    await copyText(appid, 'AppID 复制成功')
  }

  /**
   * @description 将 Unix 时间戳格式化为可读时间字符串。
   * @param {number} timestamp Unix 时间戳。
   * @return {string} 格式化后的时间字符串。
   */
  const formatTime = (timestamp: number) => {
    return dayjs.unix(timestamp).format('YYYY-MM-DD HH:mm:ss')
  }
</script>

<style lang="scss" scoped>
  @use '@/assets/styles/mixin.scss' as *;

  .project-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: var(--default-box-color);
    border: 1px solid var(--default-border);
    transition: all 0.3s ease;
    border-radius: var(--custom-radius);

    :deep(.el-card__body) {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 0;
    }

    .hd {
      display: flex;
      gap: 12px;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid var(--default-border-dashed);
    }

    .title {
      display: flex;
      gap: 8px;
      align-items: center;
      overflow: hidden;
    }

    .name {
      font-size: 16px;
      font-weight: 600;
      color: var(--ao-gray-900);
      @include ellipsis(1);
    }

    .appid {
      display: flex;
      gap: 8px;
      align-items: center;
      font-size: 12px;
      line-height: 1.5;
      color: var(--ao-gray-500);
    }
    .appid-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .copy {
      flex-shrink: 0;
      min-height: auto;
      padding: 0;
    }

    .bd {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      gap: 12px;
      padding: 16px;
    }

    .desc {
      flex-grow: 1;
      min-height: 63px; /* 14px * 1.5 * 3 */
      font-size: 14px;
      line-height: 1.5;
      color: var(--ao-gray-600);
      @include ellipsis(3);
    }

    .time {
      font-size: 12px;
      color: var(--ao-gray-500);
    }

    .ft {
      display: flex;
      justify-content: flex-end;
      padding: 12px 16px;
      background-color: var(--ao-gray-100);
      border-top: 1px solid var(--default-border);
    }
  }
</style>
