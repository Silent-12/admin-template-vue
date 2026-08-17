<template>
  <div class="project-list">
    <!-- 顶部搜索和操作区 -->
    <div class="search-wrap">
      <el-card class="search" shadow="never">
        <el-form :inline="true" :model="searchParams" class="form" @submit.prevent="handleSearch">
          <el-form-item label="项目名称">
            <el-input
              v-model="searchParams.name"
              placeholder="请输入项目名称"
              clearable
              @keyup.enter="handleSearch"
              @clear="handleSearch"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              查询
            </el-button>
            <el-button @click="resetSearch">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
          </el-form-item>
          <div class="action">
            <el-button type="primary" @click="handleAddProject">
              <el-icon><Plus /></el-icon>
              新增项目
            </el-button>
          </div>
        </el-form>
      </el-card>
    </div>

    <!-- 项目卡片网格展示区 -->
    <el-scrollbar class="list-scrollbar" v-loading="loading">
      <div class="list">
        <div v-if="projectList.length" class="grid">
          <ProjectCard
            v-for="project in projectList"
            :key="project.id"
            :project="project"
            @edit="handleEditProject"
            @baseline="handleManageBaseline"
          />
        </div>

        <el-empty v-else-if="!loading" description="暂无项目数据">
          <el-button type="primary" @click="handleAddProject">立即创建</el-button>
        </el-empty>
      </div>
    </el-scrollbar>

    <!-- 分页区 -->
    <div class="pager-wrap">
      <div class="pager">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[12, 24, 48, 96]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 弹窗及抽屉组件 -->
    <ProjectForm ref="projectFormRef" @success="loadData" />
    <BaselineDrawer ref="baselineDrawerRef" />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref } from 'vue'
  import { Search, Refresh, Plus } from '@element-plus/icons-vue'
  import type { WgtProjectItem } from '@/types/api/versionControl'
  import { fetchGetWgtProjectList } from '@/api/versionControl/wgtProject'
  import ProjectCard from './components/ProjectCard.vue'
  import ProjectForm from './components/ProjectForm.vue'
  import BaselineDrawer from './components/BaselineDrawer.vue'

  defineOptions({
    name: 'ProjectList'
  })

  // 组件引用
  const projectFormRef = ref<InstanceType<typeof ProjectForm>>()
  const baselineDrawerRef = ref<InstanceType<typeof BaselineDrawer>>()

  // 状态数据
  const loading = ref(false)
  const projectList = ref<WgtProjectItem[]>([])

  // 搜索参数
  const searchParams = reactive({
    name: ''
  })

  // 分页参数
  const pagination = reactive({
    page: 1,
    pageSize: 12,
    total: 0
  })

  /**
   * 加载项目列表数据
   */
  const loadData = async () => {
    try {
      loading.value = true
      const res = await fetchGetWgtProjectList({
        page: pagination.page,
        pageSize: pagination.pageSize,
        name: searchParams.name || undefined
      })

      projectList.value = res.list || []
      pagination.total = res.pagination.total || 0
    } catch (error) {
      console.error('获取项目列表失败:', error)
    } finally {
      loading.value = false
    }
  }

  /**
   * 搜索
   */
  const handleSearch = () => {
    pagination.page = 1
    loadData()
  }

  /**
   * 重置搜索
   */
  const resetSearch = () => {
    searchParams.name = ''
    handleSearch()
  }

  /**
   * 新增项目
   */
  const handleAddProject = () => {
    projectFormRef.value?.open()
  }

  /**
   * 编辑项目
   */
  const handleEditProject = (project: WgtProjectItem) => {
    projectFormRef.value?.open(project)
  }

  /**
   * 管理基线
   */
  const handleManageBaseline = (project: WgtProjectItem) => {
    baselineDrawerRef.value?.open(project)
  }

  /**
   * 分页大小改变
   */
  const handleSizeChange = (val: number) => {
    pagination.pageSize = val
    pagination.page = 1
    loadData()
  }

  /**
   * 页码改变
   */
  const handleCurrentChange = (val: number) => {
    pagination.page = val
    loadData()
  }

  // 初始化加载
  onMounted(() => {
    loadData()
  })
</script>

<style lang="scss" scoped>
  .project-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: var(--default-bg-color);
    justify-content: space-between;

    .search-wrap,
    .pager-wrap {
      flex-shrink: 0;
    }

    .search {
      background-color: var(--default-box-color);
      border-color: var(--default-border);
      border-radius: var(--custom-radius);
      :deep(.el-card__body) {
        padding: 16px;
      }
      .form {
        display: flex;
        flex-wrap: wrap;

        .el-form-item {
          margin-bottom: 0;
        }

        .action {
          margin-left: auto;
        }
      }
    }

    .list-scrollbar {
      min-height: 0;
    }

    .list {
      min-height: 100%;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 16px;
      align-items: start;
    }

    .pager {
      display: flex;
      justify-content: flex-end;
      padding: 16px;
      background-color: var(--default-box-color);
      border: 1px solid var(--default-border);
      border-radius: var(--custom-radius);
    }
  }
</style>
