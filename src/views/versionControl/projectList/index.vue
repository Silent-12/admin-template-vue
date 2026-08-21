<template>
  <div class="project-list ao-full-height">
    <ProjectSearch v-model="searchParams" @search="handleSearch" @reset="resetSearch" />

    <el-card class="ao-table-card">
      <AoTableHeader :loading="loading" @refresh="refreshData">
        <template #left>
          <el-button type="primary" @click="handleAddProject">
            <el-icon><Plus /></el-icon>
            新增项目
          </el-button>
        </template>
      </AoTableHeader>

      <AoTable
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        :pagination-options="{ pageSizes: [10, 20, 30] }"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
        <template #appid="{ row }">
          <div class="appid">
            <span class="text">{{ row.appid || '暂无' }}</span>
            <el-button
              type="primary"
              link
              :disabled="!row.appid"
              @click="handleCopyAppid(row.appid)"
            >
              <el-icon><CopyDocument /></el-icon>
            </el-button>
          </div>
        </template>
      </AoTable>

      <ProjectForm ref="projectFormRef" @success="refreshCreate" />
      <BaselineDrawer ref="baselineDrawerRef" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { h, reactive, ref } from 'vue'
  import { CopyDocument, Plus } from '@element-plus/icons-vue'
  import { ElButton, ElTooltip } from 'element-plus'
  import dayjs from 'dayjs'
  import type { WgtProjectItem, WgtProjectSearchParams } from '@/types/api/versionControl'
  import type { PaginatedResponse } from '@/types/api/common'
  import { fetchGetWgtProjectList } from '@/api/versionControl/wgtProject'
  import { copyText } from '@/utils'
  import { useTable } from '@/hooks/core/useTable'
  import type { ColumnOption } from '@/types/component'
  import ProjectForm from './components/ProjectForm.vue'
  import BaselineDrawer from './components/BaselineDrawer.vue'
  import ProjectSearch from './components/ProjectSearch.vue'

  defineOptions({ name: 'ProjectList' })

  // 组件引用
  const projectFormRef = ref<InstanceType<typeof ProjectForm>>()
  const baselineDrawerRef = ref<InstanceType<typeof BaselineDrawer>>()

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
        { prop: 'name', label: '项目名称', minWidth: 180, showOverflowTooltip: true },
        { prop: 'appid', label: '应用 ID', minWidth: 220, useSlot: true },
        {
          prop: 'description',
          label: '项目描述',
          minWidth: 260,
          formatter: (row) => {
            const description = row.description || '暂无描述'
            return h(
              ElTooltip,
              {
                content: description,
                placement: 'top',
                popperClass: 'project-description-tooltip'
              },
              { default: () => h('span', { class: 'description' }, description) }
            )
          }
        },
        {
          prop: 'createdAt',
          label: '创建时间',
          width: 180,
          align: 'center',
          formatter: (row) => formatTime(row.createdAt)
        },
        {
          prop: 'updatedAt',
          label: '更新时间',
          width: 180,
          align: 'center',
          formatter: (row) => formatTime(row.updatedAt)
        },
        {
          prop: 'operation',
          label: '操作',
          width: 160,
          fixed: 'right',
          formatter: (row) =>
            h('div', [
              h(
                ElButton,
                { type: 'primary', link: true, onClick: () => handleEditProject(row) },
                () => '编辑'
              ),
              h(
                ElButton,
                { type: 'primary', link: true, onClick: () => handleManageBaseline(row) },
                () => '基线管理'
              )
            ])
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
   * @description 打开当前项目的基线管理抽屉。
   * @param project 当前项目数据。
   */
  const handleManageBaseline = (project: WgtProjectItem) => {
    baselineDrawerRef.value?.open(project)
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
    @include ellipsis(2);
  }
</style>
