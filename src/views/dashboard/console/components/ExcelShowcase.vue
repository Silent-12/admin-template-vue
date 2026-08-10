<template>
  <section class="excel-showcase ao-card">
    <div class="excel-showcase__header">
      <div>
        <h2 class="excel-showcase__title">Excel 导入导出</h2>
        <p class="excel-showcase__description"
          >展示 AoExcelExport 与 AoExcelImport 的基础用法，支持导出示例数据并预览导入结果。</p
        >
      </div>
      <div class="excel-showcase__actions">
        <AoExcelImport @import-success="handleImportSuccess" @import-error="handleImportError">
          <ElIcon><Upload /></ElIcon>
          导入 Excel
        </AoExcelImport>
        <AoExcelExport
          :data="exportData"
          filename="excel_demo"
          sheet-name="示例数据"
          button-text="导出 Excel"
          loading-text="导出中..."
          :headers="headers"
          auto-index
          index-column-title="序号"
          :workbook-options="{ creator: 'Ao Design Pro' }"
        >
          <ElIcon><Download /></ElIcon>
          导出 Excel
        </AoExcelExport>
      </div>
    </div>

    <div class="excel-showcase__content">
      <div class="excel-showcase__summary">
        <span>当前数据</span>
        <strong>{{ exportData.length }}</strong>
        <span>条</span>
      </div>
      <ElTable :data="importedData" border stripe>
        <ElTableColumn
          v-for="column in importedColumns"
          :key="column"
          :prop="column"
          :label="headers[column] ?? column"
        />
      </ElTable>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import { Download, Upload } from '@element-plus/icons-vue'
  import AoExcelExport from '@/components/forms/AoExcelExport.vue'
  import AoExcelImport from '@/components/forms/AoExcelImport.vue'

  defineOptions({ name: 'ExcelShowcase' })

  interface ExcelDemoRow {
    [key: string]: string
    name: string
    department: string
    status: string
    updatedAt: string
  }

  const exportData = computed<ExcelDemoRow[]>(() => [
    {
      name: 'Alice',
      department: '设计部',
      status: '正常',
      updatedAt: '2026-08-01'
    },
    {
      name: 'Bob',
      department: '研发部',
      status: '正常',
      updatedAt: '2026-08-02'
    },
    {
      name: 'Carol',
      department: '运营部',
      status: '待处理',
      updatedAt: '2026-08-03'
    }
  ])

  const headers = computed<Record<string, string>>(() => ({
    name: '姓名',
    department: '部门',
    status: '状态',
    updatedAt: '更新时间'
  }))

  const importedData = ref<Array<Record<string, unknown>>>(exportData.value)
  const importedColumns = computed(() => Object.keys(importedData.value[0] ?? {}))

  /**
   * @description 更新导入后的 Excel 数据并提示解析结果
   * @param data Excel 文件解析后的数据行（Array<Record<string, unknown>>）
   * @return void 无返回值
   */
  const handleImportSuccess = (data: Array<Record<string, unknown>>): void => {
    if (!Array.isArray(data)) {
      return
    }

    importedData.value = data
    ElMessage.success(`成功导入 ${data.length} 条数据`)
  }

  /**
   * @description 处理 Excel 文件解析失败并提示用户
   * @param error Excel 文件解析错误（Error）
   * @return void 无返回值
   */
  const handleImportError = (error: Error): void => {
    if (!error) {
      return
    }

    ElMessage.error('Excel 文件解析失败，请检查文件格式')
  }
</script>

<style scoped lang="scss">
  .excel-showcase {
    padding: 1.25rem;
    margin-bottom: 1.25rem;
    &__header {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 1.25rem;
    }
    &__title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 500;
      line-height: 2rem;
    }
    &__description {
      margin: 0.25rem 0 0;
      color: var(--ao-gray-700);
    }
    &__actions {
      display: flex;
      flex-shrink: 0;
      gap: 0.75rem;
    }
    &__content {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    &__summary {
      display: flex;
      gap: 0.35rem;
      align-items: baseline;
      font-size: 0.875rem;
      color: var(--ao-gray-700);
      strong {
        font-size: 1.25rem;
        color: var(--theme-color);
      }
    }
    @media (width <= 47.99rem) {
      &__header {
        flex-direction: column;
      }
      &__actions {
        width: 100%;
        :deep(.el-upload),
        :deep(.el-button) {
          flex: 1;
        }
      }
    }
  }
</style>
