<!-- 用户管理页面 -->
<!-- ao-full-height 自动计算出页面剩余高度 -->
<!-- AoTable 已集成搜索栏与表格头部：传入 searchItems 即可渲染搜索栏，#header-left / #header-right 插槽内容自动渲染到表格头部 -->
<!-- 更多 useTable 使用示例请移步至 功能示例 下面的高级表格示例或者查看官方文档 -->
<!-- useTable 文档：https://www.artd.pro/docs/zh/guide/hooks/use-table.html -->
<template>
  <div class="user-page ao-full-height">
    <!-- 搜索栏 + 表格头部 + 表格 -->
    <AoTable
      v-model:search-form="searchForm"
      v-model:column-checks="columnChecks"
      :search-items="searchItems"
      :search-rules="searchRules"
      :loading="loading"
      :data="data"
      :columns="columns"
      :pagination="pagination"
      @search="handleSearch"
      @reset="resetSearchParams"
      @refresh="refreshData"
      @selection-change="handleSelectionChange"
      @pagination:size-change="handleSizeChange"
      @pagination:current-change="handleCurrentChange"
    >
      <!-- 表格头部左侧操作区 -->
      <template #header-left>
        <ElSpace wrap>
          <ElButton @click="showDialog('add')" v-ripple>新增用户</ElButton>
        </ElSpace>
      </template>

      <!-- 用户弹窗 -->
      <template #footer>
        <UserDialog
          v-model="dialogVisible"
          :type="dialogType"
          :user-data="currentUserData"
          @submit="handleDialogSubmit"
        />
      </template>
    </AoTable>
  </div>
</template>

<script setup lang="ts">
  import { computed, h, nextTick, onMounted, ref } from 'vue'
  import { ElButton, ElMessage, ElSpace } from 'element-plus'
  import AoButtonTable from '@/components/forms/AoButtonTable.vue'
  import AoImage from '@/components/media/AoImage.vue'
  import { fetchGetUserList } from '@/mock'
  import { useTable } from '@/hooks/core/useTable'
  import UserDialog from './components/UserDialog.vue'
  import { ElTag, ElMessageBox } from 'element-plus'
  import type { FormRules } from 'element-plus'
  import type { SearchFormItem } from '@/components/forms/AoSearchBar.vue'
  import type { UserSearchParams } from '@/types/api/system-manage'
  import type { DialogType, UserListItem } from './types'

  defineOptions({ name: 'User' })

  // 弹窗相关
  const dialogType = ref<DialogType>('add')
  const dialogVisible = ref(false)
  const currentUserData = ref<Partial<UserListItem>>({})

  // 选中行
  const selectedRows = ref<UserListItem[]>([])

  // 搜索表单
  const searchForm = ref({
    userName: undefined,
    userGender: undefined,
    userPhone: undefined,
    userEmail: undefined,
    status: '1'
  })

  // 搜索表单校验规则
  const searchRules: FormRules = {
    userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
  }

  // 用户状态选项
  const statusOptions = ref<{ label: string; value: string; disabled?: boolean }[]>([])

  /**
   * @description 模拟接口返回用户状态选项
   * @return 用户状态选项列表
   */
  const fetchStatusOptions = (): Promise<typeof statusOptions.value> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { label: '在线', value: '1' },
          { label: '离线', value: '2' },
          { label: '异常', value: '3' },
          { label: '注销', value: '4' }
        ])
      }, 1000)
    })
  }

  onMounted(async () => {
    statusOptions.value = await fetchStatusOptions()
  })

  // 搜索项配置（同 AoSearchBar 的 items）
  const searchItems = computed<SearchFormItem[]>(() => [
    {
      label: '用户名',
      key: 'userName',
      type: 'input',
      props: { placeholder: '请输入用户名', clearable: true }
    },
    {
      label: '手机号',
      key: 'userPhone',
      type: 'input',
      props: { placeholder: '请输入手机号', maxlength: '11' }
    },
    {
      label: '邮箱',
      key: 'userEmail',
      type: 'input',
      props: { placeholder: '请输入邮箱' }
    },
    {
      label: '状态',
      key: 'status',
      type: 'select',
      props: {
        placeholder: '请选择状态',
        options: statusOptions.value
      }
    },
    {
      label: '性别',
      key: 'userGender',
      type: 'radiogroup',
      props: {
        options: [
          { label: '男', value: '1' },
          { label: '女', value: '2' }
        ]
      }
    }
  ])

  // 用户状态配置
  const USER_STATUS_CONFIG = {
    '1': { type: 'success' as const, text: '在线' },
    '2': { type: 'info' as const, text: '离线' },
    '3': { type: 'warning' as const, text: '异常' },
    '4': { type: 'danger' as const, text: '注销' }
  } as const

  /**
   * 获取用户状态配置
   */
  const getUserStatusConfig = (status: string) => {
    return (
      USER_STATUS_CONFIG[status as keyof typeof USER_STATUS_CONFIG] || {
        type: 'info' as const,
        text: '未知'
      }
    )
  }

  const {
    columns,
    columnChecks,
    data,
    loading,
    pagination,
    getData,
    replaceSearchParams,
    resetSearchParams,
    handleSizeChange,
    handleCurrentChange,
    refreshData
  } = useTable({
    // 核心配置
    core: {
      apiFn: fetchGetUserList,
      apiParams: {
        current: 1,
        size: 20,
        ...searchForm.value
      },
      // 自定义分页字段映射，未设置时将使用 useTable 私有配置中的 paginationKey
      // paginationKey: {
      //   current: 'pageNum',
      //   size: 'pageSize'
      // },
      columnsFactory: () => [
        { type: 'selection' }, // 勾选列
        { type: 'index', width: 60, label: '序号' }, // 序号
        {
          prop: 'userInfo',
          label: '用户名',
          width: 280,
          // visible: false, // 默认是否显示列
          formatter: (row) => {
            return h('div', { class: 'user' }, [
              h(AoImage, {
                class: 'user-avatar',
                src: row.avatar,
                // 图片预览是否插入至 body 元素上，用于解决表格内部图片预览样式异常
                previewTeleported: true
              }),
              h('div', { class: 'user-info' }, [
                h('p', { class: 'user-name' }, row.userName),
                h('p', { class: 'email' }, row.userEmail)
              ])
            ])
          }
        },
        {
          prop: 'userGender',
          label: '性别',
          sortable: true,
          formatter: (row) => row.userGender
        },
        { prop: 'userPhone', label: '手机号' },
        {
          prop: 'status',
          label: '状态',
          formatter: (row) => {
            const statusConfig = getUserStatusConfig(row.status)
            return h(ElTag, { type: statusConfig.type }, () => statusConfig.text)
          }
        },
        {
          prop: 'createTime',
          label: '创建日期',
          sortable: true
        },
        {
          prop: 'operation',
          label: '操作',
          width: 120,
          fixed: 'right', // 固定列
          formatter: (row) =>
            h('div', [
              h(AoButtonTable, {
                type: 'edit',
                onClick: () => showDialog('edit', row)
              }),
              h(AoButtonTable, {
                type: 'delete',
                onClick: () => deleteUser(row)
              })
            ])
        }
      ]
    }
  })

  /**
   * 搜索处理
   * @param params 参数
   */
  const handleSearch = (params: UserSearchParams) => {
    replaceSearchParams(params)
    getData()
  }

  /**
   * 显示用户弹窗
   */
  const showDialog = (type: DialogType, row?: UserListItem): void => {
    console.log('打开弹窗:', { type, row })
    dialogType.value = type
    currentUserData.value = row || {}
    nextTick(() => {
      dialogVisible.value = true
    })
  }

  /**
   * 删除用户
   */
  const deleteUser = (row: UserListItem): void => {
    console.log('删除用户:', row)
    ElMessageBox.confirm('确定要注销该用户吗？', '注销用户', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }).then(() => {
      ElMessage.success('注销成功')
    })
  }

  /**
   * 处理弹窗提交事件
   */
  const handleDialogSubmit = async () => {
    try {
      dialogVisible.value = false
      currentUserData.value = {}
    } catch (error) {
      console.error('提交失败:', error)
    }
  }

  /**
   * 处理表格行选择变化
   */
  const handleSelectionChange = (selection: UserListItem[]): void => {
    selectedRows.value = selection
    console.log('选中行数据:', selectedRows.value)
  }
</script>

<style scoped lang="scss">
  :deep(.user) {
    display: flex;
    align-items: center;
  }

  // 用户头像
  // 使用 :deep() 穿透子组件，因为 formatter 中的 VNode 在 AoTable/ElTableColumn 内部渲染，
  // scoped 属性可能无法正确传递到 AoImage 根元素，导致 .user-avatar 样式不生效
  :deep(.user-avatar) {
    width: 2.375rem;
    height: 2.375rem;
    border-radius: 0.375rem;
  }

  // 用户名与邮箱容器
  // 同样使用 :deep() 穿透，原因同上：formatter 中的 VNode 在子组件内渲染
  :deep(.user-info) {
    margin-left: 0.5rem;
  }
</style>
