<template>
  <div class="project-list ao-full-height">
    <ProjectSearch v-model="searchParams" @search="handleSearch" @reset="resetSearch" />

    <ElCard class="ao-table-card">
      <AoTableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData">
        <template #left>
          <ElButton @click="handleAddProject">
            <ElIcon><Plus /></ElIcon>
            新增项目
          </ElButton>
        </template>
      </AoTableHeader>

      <AoTable
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
        <!-- 应用ID -->
        <template #appid="{ row }">
          <div class="appid">
            <span class="text">{{ row.appid || '暂无' }}</span>
            <ElButton
              type="primary"
              link
              :disabled="!row.appid"
              @click="handleCopyAppid(row.appid)"
            >
              <ElIcon><CopyDocument /></ElIcon>
            </ElButton>
          </div>
        </template>

        <!-- 项目描述 -->
        <template #description="{ row }">
          <ElTooltip
            :content="row.description || '暂无描述'"
            placement="top"
            popper-class="project-description-tooltip"
          >
            <span class="description">{{ row.description || '暂无描述' }}</span>
          </ElTooltip>
        </template>

        <!-- 创建时间 -->
        <template #createdAt="{ row }">
          {{ formatTime(row.createdAt) }}
        </template>

        <!-- 更新时间 -->
        <template #updatedAt="{ row }">
          {{ formatTime(row.updatedAt) }}
        </template>

        <!-- 操作列 -->
        <template #operation="{ row }">
          <div class="actions">
            <ElButton type="primary" link @click="handleEditProject(row)">编辑</ElButton>
            <ElButton type="primary" link @click="handleViewProject(row)">详情</ElButton>
          </div>
        </template>
      </AoTable>

      <ProjectForm ref="projectFormRef" @success="refreshCreate" />
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { CopyDocument, Plus } from '@element-plus/icons-vue'
  import dayjs from 'dayjs'
  import { ElButton, ElCard, ElIcon, ElTooltip } from 'element-plus'
  import type { WgtProjectItem, WgtProjectSearchParams } from '@/types/api/versionControl'
  import type { PaginatedResponse } from '@/types/api/common'
  import { fetchGetWgtProjectList } from '@/api/versionControl/wgtProject'
  import { copyText } from '@/utils'
  import { useTable } from '@/hooks/core/useTable'
  import type { ColumnOption } from '@/types/component'
  import ProjectForm from './components/ProjectForm.vue'
  import ProjectSearch from './components/ProjectSearch.vue'

  defineOptions({ name: 'ProjectList' })

  // 路由实例
  const router = useRouter()

  // 组件引用
  const projectFormRef = ref<InstanceType<typeof ProjectForm>>()

  // 搜索参数
  const searchParams = reactive({ name: '' })

  /**
   * @description 获取项目列表并转换为 useTable 使用的标准分页结构。
   * @param params 项目列表查询参数。
   * @return 标准分页项目数据。
   */
  const fetchProjectTableData = async (
    params: WgtProjectSearchParams
  ): Promise<PaginatedResponse<WgtProjectItem>> => {
    const response = await fetchGetWgtProjectList(params)
    return {
      records: response.list || [],
      total: response.pagination?.total || 0,
      current: response.pagination?.page || 1,
      size: response.pagination?.pageSize || 10
    }
  }

  // 表格数据与分页
  const {
    columns,
    columnChecks,
    data,
    loading,
    pagination,
    replaceSearchParams,
    resetSearchParams,
    handleSizeChange,
    handleCurrentChange,
    refreshData,
    refreshCreate
  } = useTable({
    core: {
      apiFn: fetchProjectTableData,
      apiParams: { page: 1, pageSize: 10 },
      paginationKey: { current: 'page', size: 'pageSize' },
      columnsFactory: (): ColumnOption<WgtProjectItem>[] => [
        { type: 'index', width: 60, label: '序号' },
        {
          prop: 'name',
          label: '项目名称',
          minWidth: 120
        },
        {
          prop: 'description',
          label: '项目描述',
          minWidth: 260,
          useSlot: true,
          slotName: 'description'
        },
        { prop: 'appid', label: '应用 ID', minWidth: 150, useSlot: true, slotName: 'appid' },
        {
          prop: 'createdAt',
          label: '创建时间',
          width: 180,
          align: 'center',
          useSlot: true,
          slotName: 'createdAt'
        },
        {
          prop: 'updatedAt',
          label: '更新时间',
          width: 180,
          align: 'center',
          useSlot: true,
          slotName: 'updatedAt'
        },
        {
          prop: 'operation',
          label: '操作',
          width: 120,
          fixed: 'right',
          useSlot: true,
          slotName: 'operation'
        }
      ]
    }
  })

  /**
   * @description 执行项目筛选并回到第一页。
   * @param params 搜索组件提交的筛选条件。
   */
  const handleSearch = (params: WgtProjectSearchParams) => {
    replaceSearchParams(params)
    refreshData()
  }

  /**
   * @description 清空项目名称筛选条件并重新加载列表。
   */
  const resetSearch = () => {
    searchParams.name = ''
    resetSearchParams()
  }

  /**
   * @description 打开新增项目表单。
   */
  const handleAddProject = () => {
    projectFormRef.value?.open()
  }

  /**
   * @description 打开项目编辑表单。
   * @param project 当前项目数据。
   */
  const handleEditProject = (project: WgtProjectItem) => {
    projectFormRef.value?.open(project)
  }

  /**
   * @description 查看项目详情。
   * @param project 当前项目数据。
   */
  const handleViewProject = (project: WgtProjectItem) => {
    if (!project.appid) return
    router.push({ name: 'ProjectDetails', params: { appid: project.appid } })
  }

  /**
   * @description 复制项目 AppID 到系统剪贴板。
   * @param appid 需要复制的项目 AppID。
   */
  const handleCopyAppid = async (appid: string) => {
    if (!appid) return
    await copyText(appid, 'AppID 复制成功')
  }

  /**
   * @description 将 Unix 时间戳格式化为页面展示时间。
   * @param timestamp Unix 时间戳。
   * @return 格式化后的日期时间。
   */
  const formatTime = (timestamp: number) => dayjs.unix(timestamp).format('YYYY-MM-DD HH:mm:ss')
</script>

<style lang="scss" scoped>
  @use '@/assets/styles/mixin.scss' as *;

  .project-list {
    .appid {
      display: flex;
      gap: 8px;
      align-items: center;

      .text {
        min-width: 0;
        @include ellipsis;
      }

      .el-button {
        flex-shrink: 0;
        min-height: auto;
        padding: 0;
      }
    }
  }

  :global(.project-description-tooltip) {
    max-width: 360px;
    word-break: break-word;
    white-space: normal;
  }

  :deep(.description) {
    display: inline-block;
    max-width: 100%;
    line-height: 1.5;
    vertical-align: middle;
    @include ellipsis(1);
  }
</style>
