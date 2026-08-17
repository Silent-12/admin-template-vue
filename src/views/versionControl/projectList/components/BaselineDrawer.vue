<template>
  <el-drawer v-model="visible" title="基线管理" size="70%" destroy-on-close @closed="handleClosed">
    <div class="baseline-drawer">
      <div class="top">
        <div class="info">
          <span class="label">当前项目：</span>
          <span class="value">{{ projectName }} ({{ currentAppid }})</span>
        </div>
        <el-button type="primary" @click="handleAddBaseline">
          <el-icon><Plus /></el-icon>
          新增基线
        </el-button>
      </div>

      <el-table v-loading="loading" :data="tableData" border style="width: 100%" class="table">
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="versionCode" label="Version Code" width="120" align="center" />
        <el-table-column prop="versionName" label="Version Name" min-width="150" />
        <el-table-column prop="createdAt" label="创建时间" width="180" align="center">
          <template #default="{ row }">
            {{ formatTime(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-popconfirm title="确定要删除该基线吗？" @confirm="handleDelete(row)" width="200px">
              <template #reference>
                <el-button type="danger" link>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <div class="pager">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 基线表单组件 -->
    <BaselineForm ref="baselineFormRef" @success="loadData" />
  </el-drawer>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { Plus } from '@element-plus/icons-vue'
  import dayjs from 'dayjs'
  import type { WgtBaselineItem, WgtProjectItem } from '@/types/api/versionControl'
  import { fetchGetWgtBaselineList, fetchDeleteWgtBaseline } from '@/api/versionControl/wgtProject'
  import BaselineForm from './BaselineForm.vue'

  defineOptions({
    name: 'BaselineDrawer'
  })

  // 抽屉与加载状态
  const visible = ref(false)
  const loading = ref(false)
  // 当前项目上下文
  const currentAppid = ref('')
  const projectName = ref('')
  // 组件引用
  const baselineFormRef = ref<InstanceType<typeof BaselineForm>>()
  // 表格数据
  const tableData = ref<WgtBaselineItem[]>([])
  // 分页参数
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    total: 0
  })

  /**
   * @description 将 Unix 时间戳格式化为页面展示使用的日期时间字符串
   * @param {number} timestamp Unix 时间戳
   * @return {string} 格式化后的时间字符串
   */
  const formatTime = (timestamp: number) => {
    return dayjs.unix(timestamp).format('YYYY-MM-DD HH:mm:ss')
  }

  /**
   * @description 根据当前项目 appid 和分页参数加载基线列表
   * @return {Promise<void>} 基线列表加载完成
   */
  const loadData = async () => {
    if (!currentAppid.value) return

    try {
      loading.value = true
      const res = await fetchGetWgtBaselineList(currentAppid.value, {
        page: pagination.page,
        pageSize: pagination.pageSize
      })
      tableData.value = res.list || []
      pagination.total = res.pagination.total || 0
    } catch (error) {
      console.error('获取基线列表失败:', error)
    } finally {
      loading.value = false
    }
  }

  /**
   * @description 打开基线管理抽屉并初始化当前项目的基线列表
   * @param {WgtProjectItem} project 当前项目数据
   * @return {void} 无返回值
   */
  const open = (project: WgtProjectItem) => {
    currentAppid.value = project.appid
    projectName.value = project.name
    pagination.page = 1
    loadData()
    visible.value = true
  }

  /**
   * @description 打开新增基线弹窗，并传入当前项目 appid
   * @return {void} 无返回值
   */
  const handleAddBaseline = () => {
    baselineFormRef.value?.open(currentAppid.value)
  }

  /**
   * @description 删除指定基线，并在必要时回退分页后刷新列表
   * @param {WgtBaselineItem} row 当前操作的基线数据
   * @return {Promise<void>} 基线删除流程执行完成
   */
  const handleDelete = async (row: any) => {
    try {
      await fetchDeleteWgtBaseline(currentAppid.value, row.id)

      // 如果当前页只有一条数据，且不是第一页，则页码减1
      if (tableData.value.length === 1 && pagination.page > 1) {
        pagination.page -= 1
      }
      loadData()
    } catch (error) {
      console.error('删除失败:', error)
    }
  }

  /**
   * @description 处理分页大小变更，并重新加载第一页基线数据
   * @param {number} val 最新分页大小
   * @return {void} 无返回值
   */
  const handleSizeChange = (val: number) => {
    pagination.pageSize = val
    pagination.page = 1
    loadData()
  }

  /**
   * @description 处理当前页码变更，并加载对应页的基线数据
   * @param {number} val 最新页码
   * @return {void} 无返回值
   */
  const handleCurrentChange = (val: number) => {
    pagination.page = val
    loadData()
  }

  /**
   * @description 在抽屉关闭后清空当前页面缓存的项目上下文和表格数据
   * @return {void} 无返回值
   */
  const handleClosed = () => {
    tableData.value = []
    currentAppid.value = ''
    projectName.value = ''
  }

  defineExpose({
    open
  })
</script>

<style lang="scss" scoped>
  .baseline-drawer {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 20px;

    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;

      .info {
        font-size: 14px;

        .label {
          color: var(--ao-gray-600);
        }

        .value {
          font-weight: 600;
          color: var(--ao-gray-900);
        }
      }
    }

    .table {
      flex-grow: 1;
    }

    .pager {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }
  }
</style>
