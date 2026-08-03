<template>
  <section class="excel-showcase ao-card">
    <div class="excel-showcase__header">
      <div>
        <h2 class="excel-showcase__title">{{ t('dashboard.console.excel.title') }}</h2>
        <p class="excel-showcase__description">{{ t('dashboard.console.excel.description') }}</p>
      </div>
      <div class="excel-showcase__actions">
        <AoExcelImport @import-success="handleImportSuccess" @import-error="handleImportError">
          <ElIcon><Upload /></ElIcon>
          {{ t('dashboard.console.excel.importButton') }}
        </AoExcelImport>
        <AoExcelExport
          :data="exportData"
          :filename="t('dashboard.console.excel.filename')"
          :sheet-name="t('dashboard.console.excel.sheetName')"
          :button-text="t('dashboard.console.excel.exportButton')"
          :loading-text="t('dashboard.console.excel.exportLoading')"
          :headers="headers"
          auto-index
          :index-column-title="t('dashboard.console.excel.indexColumn')"
          :workbook-options="{ creator: 'Ao Design Pro' }"
        >
          <ElIcon><Download /></ElIcon>
          {{ t('dashboard.console.excel.exportButton') }}
        </AoExcelExport>
      </div>
    </div>

    <div class="excel-showcase__content">
      <div class="excel-showcase__summary">
        <span>{{ t('dashboard.console.excel.sampleData') }}</span>
        <strong>{{ exportData.length }}</strong>
        <span>{{ t('dashboard.console.excel.rows') }}</span>
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
  import { useI18n } from 'vue-i18n'
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

  const { t } = useI18n()

  const exportData = computed<ExcelDemoRow[]>(() => [
    {
      name: 'Alice',
      department: t('dashboard.console.excel.demoData.design'),
      status: t('dashboard.console.excel.demoData.active'),
      updatedAt: '2026-08-01'
    },
    {
      name: 'Bob',
      department: t('dashboard.console.excel.demoData.engineering'),
      status: t('dashboard.console.excel.demoData.active'),
      updatedAt: '2026-08-02'
    },
    {
      name: 'Carol',
      department: t('dashboard.console.excel.demoData.operations'),
      status: t('dashboard.console.excel.demoData.pending'),
      updatedAt: '2026-08-03'
    }
  ])

  const headers = computed<Record<string, string>>(() => ({
    name: t('dashboard.console.excel.columns.name'),
    department: t('dashboard.console.excel.columns.department'),
    status: t('dashboard.console.excel.columns.status'),
    updatedAt: t('dashboard.console.excel.columns.updatedAt')
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
    ElMessage.success(t('dashboard.console.excel.importSuccess', { count: data.length }))
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

    ElMessage.error(t('dashboard.console.excel.importError'))
  }
</script>

<style scoped lang="scss">
  .excel-showcase {
    padding: 1.25rem;
    margin-bottom: 1.25rem;
  }

  .excel-showcase__header {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 1.25rem;
  }

  .excel-showcase__title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 500;
    line-height: 2rem;
  }

  .excel-showcase__description {
    margin: 0.25rem 0 0;
    color: var(--ao-gray-700);
  }

  .excel-showcase__actions {
    display: flex;
    flex-shrink: 0;
    gap: 0.75rem;
  }

  .excel-showcase__content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .excel-showcase__summary {
    display: flex;
    gap: 0.35rem;
    align-items: baseline;
    font-size: 0.875rem;
    color: var(--ao-gray-700);
  }

  .excel-showcase__summary strong {
    font-size: 1.25rem;
    color: var(--theme-color);
  }

  @media (width <= 47.99rem) {
    .excel-showcase__header {
      flex-direction: column;
    }

    .excel-showcase__actions {
      width: 100%;
    }

    .excel-showcase__actions :deep(.el-upload),
    .excel-showcase__actions :deep(.el-button) {
      flex: 1;
    }
  }
</style>
