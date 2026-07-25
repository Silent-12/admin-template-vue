# 功能移除计划：图表/卡片/节日滚动/ECharts 等公共能力

> 依据 `.agents/skills/feature-removal/SKILL.md` 规范执行，确保零死代码残留。

## 一、摘要

移除项目中图表类、卡片类、节日文本滚动、控制台欢迎信息、WebSocket 客户端、外链常量、ECharts 插件及类型定义等公共能力，并在项目根目录生成剩余公共组件清单 Markdown 文档。

## 二、用户决策（Phase 2 已确认）

| 共享资源 | 决策 | 说明 |
|---|---|---|
| ThemeSvg | **保留** | 仍被 `LoginLeftView.vue`、`AoException.vue` 使用 |
| `constants/links.ts` 的 WEB_LINKS | **彻底删除并内联** | 将 URL 内联到 `fastEnter.ts` 和 `about-project.vue` |
| ECharts 插件 + 图表类型定义 | **一并删除** | 含 `plugins/echarts.ts`、`plugins/index.ts`、`types/component/chart.ts`、`package.json` echarts 依赖、`vite.config.ts` echarts manualChunks |

## 三、当前状态分析（Phase 1 探索结论）

### 3.1 待删除资源引用情况

| 资源 | 外部引用 | 处理方式 |
|---|---|---|
| `cards/` 8 个组件 | 仅 `cards/` 内部互相引用（如 AoStatsCard 用 AoCountTo） | 整目录删除 |
| `charts/` 8 个组件 | 仅自身引用 `useChart` + `plugins/echarts` | 整目录删除 |
| AoFestivalTextScroll | [ao-page-content/index.vue:10](file:///e:/hulihan/admin-template-pro/src/components/core/layouts/ao-page-content/index.vue#L10) | 删除目录 + 清理引用行 |
| AoTextScroll | 仅 AoFestivalTextScroll 引用 | 整目录删除 |
| `sys/console.ts` | [main.ts:7](file:///e:/hulihan/admin-template-pro/src/main.ts#L7) | 删文件 + 清理 import |
| `socket/index.ts` | 仅 `utils/index.ts` 聚合导出 | 整目录删除 + 清理聚合导出 |
| `constants/links.ts` | 3 处保留文件引用 | 内联 URL 后删除文件 |
| `hooks/core/useChart.ts` | `hooks/index.ts` 聚合 + 所有 charts/cards 组件 | 删文件 + 清理聚合导出 |
| `plugins/echarts.ts` | useChart + 所有 charts/cards + `types/component/chart.ts` | 删文件 |
| `types/component/chart.ts` | 所有 charts/cards 组件 | 删文件（目录 index.ts 保留） |

### 3.2 组件注册方式

项目使用 `unplugin-vue-components` 自动注册（[vite.config.ts:81-82](file:///e:/hulihan/admin-template-pro/vite.config.ts#L81)），dts 输出到 `src/types/import/components.d.ts`。删除组件目录后，dev/build 时会自动重新生成 dts，**无需手动清理注册点**。

### 3.3 共享资源保留说明

- **ThemeSvg 保留**：被 [LoginLeftView.vue:10](file:///e:/hulihan/admin-template-pro/src/components/core/views/login/LoginLeftView.vue#L10) 和 [AoException.vue:4](file:///e:/hulihan/admin-template-pro/src/components/core/views/exception/AoException.vue#L4) 使用，按用户决策不删除。
- **WEB_LINKS 内联值**（来自 [links.ts](file:///e:/hulihan/admin-template-pro/src/utils/constants/links.ts)）：
  - `DOCS` = `https://www.artd.pro/docs/zh/`
  - `COMMUNITY` = `https://www.artd.pro/docs/zh/community/communicate.html`
  - `BILIBILI` = `https://space.bilibili.com/425500936?spm_id_from=333.1007.0.0`
  - `INTRODUCE` = `https://www.artd.pro/docs/zh/guide/introduce.html`
  - `GITHUB_HOME` = `https://github.com/Daymychen/art-design-pro`

## 四、删除清单（What/Why/How）

### A. 整个目录删除（10 个目录）

| # | 路径 | 内容 | Why |
|---|---|---|---|
| 1 | `src/components/core/cards/` | 8 个卡片组件（AoBarChartCard、AoDataListCard、AoDonutChartCard、AoImageCard、AoLineChartCard、AoProgressCard、AoStatsCard、AoTimelineListCard） | 用户要求全部移除 |
| 2 | `src/components/core/charts/` | 8 个图表组件（AoBarChart、AoDualBarCompareChart、AoHBarChart、AoKLineChart、AoLineChart、AoRadarChart、AoRingChart、AoScatterChart） | 用户要求全部移除 |
| 3 | `src/components/core/text-effect/ao-festival-text-scroll/` | AoFestivalTextScroll 组件 | 用户要求移除 |
| 4 | `src/components/core/text-effect/ao-text-scroll/` | AoTextScroll 组件 | 用户要求移除 |
| 5 | `src/utils/socket/` | WebSocketClient 单例 | 用户要求移除 |

> **执行方式**：使用 `DeleteFile` 工具按目录递归删除（或逐个文件删除）。Windows 下目录需先清空。

### B. 单文件删除（6 个文件）

| # | 路径 | Why |
|---|---|---|
| 1 | `src/utils/sys/console.ts` | 控制台 ASCII 欢迎信息，用户要求移除 |
| 2 | `src/utils/constants/links.ts` | WEB_LINKS 常量，内联到使用处后删除 |
| 3 | `src/hooks/core/useChart.ts` | 图表 Hook，用户要求移除 |
| 4 | `src/plugins/echarts.ts` | ECharts 插件，用户决策一并删除 |
| 5 | `src/plugins/index.ts` | 插件聚合导出，删除 echarts 后变空 |
| 6 | `src/types/component/chart.ts` | 图表类型定义，用户决策一并删除 |

> `src/types/component/index.ts` 保留（目录非空）。`src/plugins/` 目录在删除两个文件后可保留空目录或一并删除（建议保留目录骨架，未来扩展用）。

### C. 保留资源（不删除）

| 路径 | 原因 |
|---|---|
| `src/components/core/theme/theme-svg/` | ThemeSvg 仍被 LoginLeftView + AoException 使用，用户决策保留 |

## 五、引用清理清单（How）

### 5.1 聚合导出文件清理

**文件 1**：[src/utils/index.ts](file:///e:/hulihan/admin-template-pro/src/utils/index.ts)
- 移除第 33-34 行：
  ```ts
  // socket 相关
  export * from './socket'
  ```

**文件 2**：[src/utils/constants/index.ts](file:///e:/hulihan/admin-template-pro/src/utils/constants/index.ts)
- 移除第 8 行：`export * from './links'`
- 删除后该文件只剩头部注释，可考虑直接删除整个 `constants/` 目录（若 `links.ts` 是唯一文件）。执行时确认。

**文件 3**：[src/hooks/index.ts](file:///e:/hulihan/admin-template-pro/src/hooks/index.ts)
- 移除第 28-29 行：
  ```ts
  // 图表相关
  export { useChart, useChartComponent, useChartOps } from './core/useChart'
  ```

### 5.2 入口文件清理

**文件**：[src/main.ts](file:///e:/hulihan/admin-template-pro/src/main.ts)
- 移除第 7 行：`import '@utils/sys/console.ts'  // 控制台输出内容`

### 5.3 布局组件清理

**文件**：[src/components/core/layouts/ao-page-content/index.vue](file:///e:/hulihan/admin-template-pro/src/components/core/layouts/ao-page-content/index.vue)
- 移除第 9-10 行（注释 + 标签）：
  ```vue
        <!-- 节日滚动 -->
        <AoFestivalTextScroll v-if="!isFullPage" />
  ```

### 5.4 WEB_LINKS 内联（用户确认彻底删除）

**文件 1**：[src/config/fastEnter.ts](file:///e:/hulihan/admin-template-pro/src/config/fastEnter.ts)
- 移除第 5 行：`import { WEB_LINKS } from '@/utils/constants'`
- 第 29 行：`link: WEB_LINKS.DOCS` → `link: 'https://www.artd.pro/docs/zh/'`
- 第 38 行：`link: WEB_LINKS.COMMUNITY` → `link: 'https://www.artd.pro/docs/zh/community/communicate.html'`
- 第 47 行：`link: WEB_LINKS.BILIBILI` → `link: 'https://space.bilibili.com/425500936?spm_id_from=333.1007.0.0'`

**文件 2**：`src/config/modules/fastEnter.ts`（执行时先 Read 确认内容）
- 若引用 WEB_LINKS，按同样方式内联

**文件 3**：[src/views/dashboard/console/modules/about-project.vue](file:///e:/hulihan/admin-template-pro/src/views/dashboard/console/modules/about-project.vue)
- 移除第 26 行：`import { WEB_LINKS } from '@/utils/constants'`
- 第 31 行：`{ label: '项目官网', url: WEB_LINKS.DOCS }` → `url: 'https://www.artd.pro/docs/zh/'`
- 第 32 行：`{ label: '文档', url: WEB_LINKS.INTRODUCE }` → `url: 'https://www.artd.pro/docs/zh/guide/introduce.html'`
- 第 33 行：`{ label: 'Github', url: WEB_LINKS.GITHUB_HOME }` → `url: 'https://github.com/Daymychen/art-design-pro'`
- 第 34 行：`{ label: '哔哩哔哩', url: WEB_LINKS.BILIBILI }` → `url: 'https://space.bilibili.com/425500936?spm_id_from=333.1007.0.0'`

### 5.5 依赖与构建配置清理

**文件 1**：[package.json](file:///e:/hulihan/admin-template-pro/package.json)
- 移除第 59 行：`"echarts": "^6.0.0",`
- 执行 `pnpm install` 同步 lockfile

**文件 2**：[vite.config.ts](file:///e:/hulihan/admin-template-pro/vite.config.ts)
- 移除第 112 行附近的 echarts 相关 manualChunks 配置（`'echarts/components'`、`'echarts/core'`、`'echarts/charts'`、`'echarts/renderers'` 等）。执行时 Read 该文件 100-130 行确认完整范围。

### 5.6 自动生成文件

- `src/types/import/components.d.ts`：由 `unplugin-vue-components` 自动生成，dev/build 时自动更新，无需手动清理（如需可手动删除触发重新生成）。

## 六、文档生成（What）

在项目根目录创建 `PUBLIC_COMPONENTS.md`，列出剩余公共组件及其作用。

### 文档结构

```markdown
# 公共组件清单

> 本文档列出 `src/components/core/` 下所有公共组件及其作用，自动同步自最新代码。

## 目录结构

按子目录分类（banners/base/layouts/forms/media/others/tables/text-effect/theme/views/widget），
每个组件给出：组件名、路径链接、功能描述、主要 props。

## 备注

- ThemeSvg：保留供 LoginLeftView / AoException 使用
- 已移除：cards/、charts/、AoFestivalTextScroll、AoTextScroll
```

### 文档内容来源

基于第一阶段分析的清单，剔除已删除项（cards 8 个、charts 8 个、AoFestivalTextScroll、AoTextScroll），保留 ThemeSvg 并在文档中标注保留原因。

## 七、执行顺序（建议）

1. **第一步：内联 WEB_LINKS**（先处理共享资源依赖，避免删除 links.ts 后报错）
   - 修改 `src/config/fastEnter.ts`
   - 修改 `src/config/modules/fastEnter.ts`（如需）
   - 修改 `src/views/dashboard/console/modules/about-project.vue`

2. **第二步：清理引用**
   - 修改 `src/utils/index.ts`、`src/utils/constants/index.ts`、`src/hooks/index.ts`
   - 修改 `src/main.ts`
   - 修改 `src/components/core/layouts/ao-page-content/index.vue`

3. **第三步：删除文件/目录**
   - 删除 `cards/`、`charts/`、`ao-festival-text-scroll/`、`ao-text-scroll/`、`socket/`
   - 删除 `sys/console.ts`、`constants/links.ts`、`hooks/core/useChart.ts`
   - 删除 `plugins/echarts.ts`、`plugins/index.ts`、`types/component/chart.ts`

4. **第四步：清理依赖与构建配置**
   - 修改 `package.json`（移除 echarts）
   - 修改 `vite.config.ts`（移除 echarts manualChunks）
   - 执行 `pnpm install`

5. **第五步：生成文档**
   - 创建 `PUBLIC_COMPONENTS.md`

6. **第六步：验证**
   - 执行 lint 系列
   - 启动 dev 服务器回归测试

## 八、验证步骤

| # | 命令/操作 | 目的 |
|---|---|---|
| 1 | `pnpm run lint` | ESLint 检查无新增错误 |
| 2 | `pnpm run lint:stylelint` | Stylelint 检查（涉及样式改动） |
| 3 | `pnpm run lint:prettier` | Prettier 格式检查 |
| 4 | `pnpm run dev` | 启动开发服务器，验证无运行时错误 |
| 5 | 浏览器回归 - 登录页 | LoginLeftView 的 ThemeSvg 正常显示 |
| 6 | 浏览器回归 - 404/403 异常页 | AoException 的 ThemeSvg 正常显示 |
| 7 | 浏览器回归 - 顶部栏快速入口 | fastEnter 三个外链跳转正常 |
| 8 | 浏览器回归 - dashboard/console about-project | 4 个外链正常 |
| 9 | 浏览器回归 - 主内容区 | ao-page-content 不再渲染节日滚动条，其他功能正常 |
| 10 | 全局搜索 `useChart`、`WEB_LINKS`、`AoFestivalTextScroll`、`echarts`、`socket` | 确认零残留引用 |

## 九、假设与决策

### 假设
- `src/config/modules/fastEnter.ts` 与 `src/config/fastEnter.ts` 是不同文件，均引用 WEB_LINKS，执行时 Read 确认。
- 项目无其他业务页面使用 echarts（已通过 Grep 确认仅 charts/cards/useChart 使用）。
- `src/types/component/index.ts` 不导出 chart.ts 内容（执行时 Read 确认；若导出需清理）。

### 决策
- ThemeSvg 保留，文档中标注「保留（仅供 LoginLeftView / AoException 使用）」。
- WEB_LINKS 彻底删除，URL 内联到 2 个使用文件。
- echarts 依赖、插件、类型、构建配置一并清理。
- `src/plugins/` 目录在删除两个文件后保留空目录骨架（未来扩展）。
- `src/utils/constants/` 目录若删除 links.ts 后只剩 index.ts 空壳，则一并删除整个目录并清理 `utils/index.ts` 的 `export * from './constants'`。

## 十、删除报告（执行完成后输出）

按 SKILL.md 第七步格式输出，包含：
- 删除的页面/组件/Hook/API/Store/Type/常量/样式/图片数量
- 检查结果：未发现遗留引用、未发现死代码、项目可正常编译、无新增 TS/ESLint 错误
