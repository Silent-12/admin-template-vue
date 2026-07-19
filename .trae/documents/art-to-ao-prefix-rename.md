# Art → Ao 前缀统一重命名计划

## 一、任务摘要

将项目中残留的 `Art` / `art` 前缀统一变更为 `ao` 前缀，覆盖：组件目录名、组件文件名、组件 `defineOptions` 名、CSS 类名、CSS 变量、TypeScript 类型、品牌字符串。分 4 个批次执行，每批后做回归校验，确认不影响页面样式与布局。

## 二、已确认的决策（来自用户回答）

| 决策项                                   | 选择                                                  |
| ---------------------------------------- | ----------------------------------------------------- |
| CSS 变量 `--art-*`                       | **全部重命名** 为 `--ao-*`                            |
| 品牌字符串 `Art Design Pro`              | 改为 `Ao Design Pro`，但 **GitHub/官网 URL 保留原样** |
| `@author Art Design Pro Team` JSDoc 注释 | **保留不动**                                          |
| 执行方式                                 | **分多批次**，每批后回归校验                          |

## 三、不变更范围（明确豁免）

1. `@author Art Design Pro Team` 类注释（60+ 处，分布在几乎所有源文件头部）
2. 外部 URL：
   - `https://github.com/Daymychen/art-design-pro`（`src/utils/sys/console.ts:7`、`src/utils/constants/links.ts:10, 13`）
   - `https://www.artd.pro/...`（`src/utils/constants/links.ts:16, 19, 22, 25, 28, 34`）
3. `Auth` 前缀（非 `Art`）：`src/components/core/views/login/AuthTopBar.vue` 文件名、组件名 `AuthTopBar`、CSS 类 `.auth-top-bar` 均保留。**但该文件内部引用的 `<ArtLogo>` / `<ArtSvgIcon>` 需同步重命名。**
4. `src/types/import/components.d.ts`：由 `unplugin-vue-components` 自动生成，**禁止手动编辑**，目录重命名后执行 `pnpm dev` 会自动重新生成。

## 四、当前状态分析

### 4.1 残留统计

| 类别 | 数量 | 位置 |
| --- | --- | --- |
| `art-` 开头的组件目录 | 48 个 | `src/components/core/` 下各分类目录 |
| `Art` 开头的 `.vue` 文件 | 3 个 | `ArtException.vue`、`ArtResultPage.vue`、`ArtUserMenu.vue` |
| `defineOptions({ name: 'ArtXxx' })` | 55 处 | 各组件 `index.vue` |
| `--art-*` CSS 变量定义 | 19 个亮色 + 14 个暗色覆盖 | `src/assets/styles/core/theme.scss` |
| `--art-*` CSS 变量引用 | 50+ 文件 | 全项目 |
| `.art-*` CSS 类名（去重） | 21 个 | `app.scss`、`utilities.scss`、组件内 `<style>` |
| `ArtTableProps` 接口 | 1 处 | `src/components/core/tables/art-table/index.vue:122` |
| 显式 import 路径含 `art-` | 13 处 | `views/system/*`、`config/modules/component.ts`、`art-work-tab` |
| 品牌字符串 `Art Design Pro` | 5 处需改 + URL 保留 | 见批次 4 |

### 4.2 自动注册机制

- `unplugin-vue-components` 扫描 `src/components/core/` 下所有 `.vue`，按目录名推导组件名（`art-foo-bar` → `ArtFooBar`）
- 重命名目录为 `ao-foo-bar` 后，组件名自动变为 `AoFooBar`
- 类型声明文件 `src/types/import/components.d.ts` 自动重新生成
- `main.ts` 中无手动全局注册，无需改动

### 4.3 关键风险点

1. **`--art-*` 变量跨 50+ 文件**：必须用全局替换，遗漏一处即导致样式错乱
2. **动态生成的 CSS 变量名**：`src/hooks/core/useLayoutHeight.ts` 第 35、90 行的字符串 `'--art-full-height'` 必须同步改为 `'--ao-full-height'`
3. **JS 中动态查询的 CSS 选择器**：`src/components/core/layouts/art-header-bar/index.vue:323` 的 `target.closest('.art-notification-panel')` 必须同步改
4. **未定义就使用的 CSS 变量**（疑遗留 bug，重命名时一并改以保持一致性）：
   - `--art-code-bg`（`md.scss:69, 79`）
   - `--art-c-border-2`（`md.scss:833`）
   - `--art-bg-color`（`SettingActions.vue:243`）

## 五、批次执行计划

> 每批结束后必须执行：① `pnpm lint` ② `pnpm lint:stylelint`（涉及样式时）③ `pnpm dev` 启动后人工回归校验 ④ 校验通过后再进入下一批

---

### 批次 1：CSS 变量重命名（`--art-*` → `--ao-*`）

**目标**：将全部 `--art-` 开头的 CSS 变量重命名为 `--ao-`，覆盖定义与所有引用。

**改动文件清单**：

1. **定义文件**（必改）：
   - `src/assets/styles/core/theme.scss` —— 19 个亮色定义 + 14 个暗色覆盖
2. **引用文件**（按全局搜索 `--art-` 结果替换）：
   - `src/assets/styles/core/{app.scss, utilities.scss, md.scss, dark.scss, reset.scss, el-ui.scss, el-dark.scss, el-light.scss, mixin.scss, theme-animation.scss, theme-change.scss, router-transition.scss}`
   - `src/config/index.ts`（第 87、103 行）
   - `src/utils/sys/upgrade.ts`（第 136 行，内联 HTML 字符串中的 `var(--art-*)`）
   - `src/hooks/core/useLayoutHeight.ts`（第 35、90 行字符串字面量 `'--art-full-height'`）
   - `src/components/core/` 下所有 `.vue` / `.scss` 中含 `var(--art-*)` 的文件
   - `src/views/` 下所有含 `var(--art-*)` 的文件
3. **疑遗留变量**（一并重命名，保持一致）：
   - `--art-code-bg` → `--ao-code-bg`
   - `--art-c-border-2` → `--ao-c-border-2`
   - `--art-bg-color` → `--ao-bg-color`

**执行方式**：用 `Grep` 工具搜索 `--art-` 全量匹配，逐文件用 `Edit` 工具的 `replace_all` 替换为 `--ao-`。

**回归校验**：

- `pnpm lint` / `pnpm lint:stylelint` 通过
- `pnpm dev` 启动后切换亮色/暗色主题、切换主色调，确认颜色、灰阶、卡片边框、hover 态、active 态均正常
- 重点检查：登录页、控制台 dashboard、system/user、system/role、system/menu、user-center

---

### 批次 2：CSS 类名重命名（`.art-*` → `.ao-*`）

**目标**：将 `.art-` 开头的 CSS 类名重命名为 `.ao-`，覆盖定义、模板使用、JS 字符串选择器。

**改动文件清单**：

1. **类名定义位置**：
   - `src/assets/styles/core/app.scss` —— `.art-card`、`.art-card-sm`、`.art-card-xs`、`.art-table-card`、`.art-full-height`、`.art-badge`、`.art-badge-horizontal`、`.art-badge-mixed`、`.art-badge-dual`、`.art-text-badge`、`.art-loading-fix`
   - `src/assets/styles/core/utilities.scss` —— `.art-card-header`
   - `src/components/core/forms/art-search-bar/index.vue` —— `.art-search-bar`
   - `src/components/core/forms/art-button-table/index.vue` —— `.art-button-table`、`.art-btn-theme`、`.art-btn-secondary`、`.art-btn-error`、`.art-btn-info`
   - `src/components/core/tables/art-table/style.scss` —— `.art-table`
   - `src/components/core/base/art-svg-icon/index.vue` —— `.art-svg-icon`（含 `:deep(.art-svg-icon)`）
   - `src/components/core/layouts/art-page-content/index.vue` —— `.art-page-view`
   - `src/components/core/layouts/art-notification/index.vue` —— `.art-notification-panel`
2. **模板中使用上述类名的文件**（全局搜索每个类名定位）：
   - `views/system/user-center/index.vue`、`views/system/user/index.vue`、`views/system/role/index.vue`、`views/system/menu/index.vue`
   - `views/dashboard/console/modules/{todo-list,sales-overview,new-user,dynamic-stats}.vue`
   - `art-sidebar-menu/widget/SidebarSubmenu.vue`、`art-horizontal-menu/widget/HorizontalSubmenu.vue`
   - `art-notification/index.vue`、`art-header-bar/index.vue`、`art-menu-right/index.vue`、`ArtUserMenu.vue`
   - `art-sidebar-menu/style.scss`、`art-sidebar-menu/theme.scss`
   - `AuthTopBar.vue`（`Auth` 不改，但内部 `:deep(.art-svg-icon)` 需改）
3. **JS 字符串选择器**：
   - `src/components/core/layouts/art-header-bar/index.vue:323` —— `target.closest('.art-notification-panel')` → `target.closest('.ao-notification-panel')`

**执行方式**：

- 先用 `Grep` 列出每个类名的所有出现位置
- 对每个文件用 `Edit` + `replace_all` 替换（注意 SCSS 中 `.art-` 与 CSS 中 `.art-` 同步替换）
- 注意 `:deep(.art-svg-icon)` 这种特殊语法也要改

**回归校验**：

- `pnpm lint` / `pnpm lint:stylelint` 通过
- `pnpm dev` 启动后重点检查：
  - 卡片样式（`.art-card` 系列）：控制台、user-center
  - 表格容器（`.art-table-card`）：system/user、system/role、system/menu
  - 菜单徽章（`.art-badge` 系列）：侧边栏、水平菜单、混合菜单
  - 表格按钮（`.art-button-table`、`.art-btn-*`）：system/user 表格操作列、system/menu 表格操作列
  - 通知面板（`.art-notification-panel`）：header-bar 通知弹窗
  - SVG 图标（`.art-svg-icon`）：全局图标显示
  - 搜索栏（`.art-search-bar`）：system/user、system/role 搜索条

---

### 批次 3：组件目录/文件/组件名/类型重命名（`Art*` → `Ao*`）

**目标**：将 48 个 `art-` 目录、3 个 `Art*.vue` 文件、55 处 `defineOptions` 中的组件名、`ArtTableProps` 接口、所有 import 路径与模板引用全部重命名。

#### 3.1 目录与文件重命名

**48 个组件目录**（`art-xxx` → `ao-xxx`）：

```
src/components/core/banners/
  art-basic-banner      → ao-basic-banner
  art-card-banner       → ao-card-banner
src/components/core/base/
  art-back-to-top       → ao-back-to-top
  art-logo              → ao-logo
  art-svg-icon          → ao-svg-icon
src/components/core/cards/
  art-bar-chart-card    → ao-bar-chart-card
  art-data-list-card    → ao-data-list-card
  art-donut-chart-card  → ao-donut-chart-card
  art-image-card        → ao-image-card
  art-line-chart-card   → ao-line-chart-card
  art-progress-card     → ao-progress-card
  art-stats-card        → ao-stats-card
  art-timeline-list-card→ ao-timeline-list-card
src/components/core/charts/
  art-bar-chart         → ao-bar-chart
  art-dual-bar-compare-chart → ao-dual-bar-compare-chart
  art-h-bar-chart       → ao-h-bar-chart
  art-k-line-chart      → ao-k-line-chart
  art-line-chart        → ao-line-chart
  art-radar-chart       → ao-radar-chart
  art-ring-chart        → ao-ring-chart
  art-scatter-chart     → ao-scatter-chart
src/components/core/forms/
  art-button-more       → ao-button-more
  art-button-table      → ao-button-table
  art-excel-export      → ao-excel-export
  art-excel-import      → ao-excel-import
  art-form              → ao-form
  art-search-bar        → ao-search-bar
src/components/core/layouts/
  art-breadcrumb        → ao-breadcrumb
  art-chat-window       → ao-chat-window
  art-fast-enter        → ao-fast-enter
  art-fireworks-effect  → ao-fireworks-effect
  art-global-component  → ao-global-component
  art-global-search     → ao-global-search
  art-header-bar        → ao-header-bar
  art-menus/art-horizontal-menu → ao-menus/ao-horizontal-menu
  art-menus/art-mixed-menu     → ao-menus/ao-mixed-menu
  art-menus/art-sidebar-menu   → ao-menus/ao-sidebar-menu
  art-notification      → ao-notification
  art-page-content      → ao-page-content
  art-screen-lock       → ao-screen-lock
  art-settings-panel    → ao-settings-panel
  art-work-tab          → ao-work-tab
src/components/core/media/
  art-cutter-img        → ao-cutter-img
  art-video-player      → ao-video-player
src/components/core/others/
  art-menu-right        → ao-menu-right
  art-watermark         → ao-watermark
src/components/core/tables/
  art-table             → ao-table
  art-table-header      → ao-table-header
src/components/core/text-effect/
  art-count-to          → ao-count-to
  art-festival-text-scroll → ao-festival-text-scroll
  art-text-scroll       → ao-text-scroll
src/components/core/widget/
  art-icon-button       → ao-icon-button
```

**3 个 `Art*.vue` 文件**：

- `src/components/core/views/exception/ArtException.vue` → `AoException.vue`
- `src/components/core/views/result/ArtResultPage.vue` → `AoResultPage.vue`
- `src/components/core/layouts/art-header-bar/widget/ArtUserMenu.vue` → `AoUserMenu.vue`（目录已重命名为 `ao-header-bar/widget/`）

**外层 `art-menus/` 目录**：随子目录一起改为 `ao-menus/`

#### 3.2 组件 `defineOptions({ name: 'ArtXxx' })` 重命名

55 处全部改为 `AoXxx`，例如：

- `defineOptions({ name: 'ArtSvgIcon' })` → `defineOptions({ name: 'AoSvgIcon' })`
- `defineOptions({ name: 'ArtTable' })` → `defineOptions({ name: 'AoTable' })`
- `defineOptions({ name: 'ArtResultPage' })` → `defineOptions({ name: 'AoResultPage' })`
- `defineOptions({ name: 'ArtUserMenu' })` → `defineOptions({ name: 'AoUserMenu' })`
- 其余 51 处同理

#### 3.3 TypeScript 类型重命名

- `src/components/core/tables/art-table/index.vue`（重命名后为 `ao-table/index.vue`）第 122 行：
  ```ts
  interface ArtTableProps extends TableProps<Record<string, any>> { ... }
  ```
  →
  ```ts
  interface AoTableProps extends TableProps<Record<string, any>> { ... }
  ```
  同步修改同文件第 139 行的 `withDefaults(defineProps<ArtTableProps>(), ...)` 引用

#### 3.4 import 路径更新（13 处显式 import）

**`views/system/` 下**：

- `src/views/system/user/index.vue:45` —— `import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'` → `import AoButtonTable from '@/components/core/forms/ao-button-table/index.vue'`
- `src/views/system/role/index.vue:55` —— `import { ButtonMoreItem } from '@/components/core/forms/art-button-more/index.vue'` → `from '@/components/core/forms/ao-button-more/index.vue'`
- `src/views/system/role/index.vue:58` —— `import ArtButtonMore from '@/components/core/forms/art-button-more/index.vue'` → `import AoButtonMore from '@/components/core/forms/ao-button-more/index.vue'`
- `src/views/system/menu/modules/menu-dialog.vue:45` —— `import type { FormItem } from '@/components/core/forms/art-form/index.vue'` → `from '@/components/core/forms/ao-form/index.vue'`
- `src/views/system/menu/modules/menu-dialog.vue:46` —— `import ArtForm from '@/components/core/forms/art-form/index.vue'` → `import AoForm from '@/components/core/forms/ao-form/index.vue'`
- `src/views/system/menu/index.vue:54` —— `import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'` → `import AoButtonTable from '@/components/core/forms/ao-button-table/index.vue'`

**`art-work-tab` 下（重命名后为 `ao-work-tab`）**：

- `src/components/core/layouts/art-work-tab/index.vue:90` —— `import { MenuItemType } from '../../others/art-menu-right/index.vue'` → `from '../../others/ao-menu-right/index.vue'`

**`config/modules/component.ts` 下（6 处 `defineAsyncComponent`）**：

- `@/components/core/layouts/art-settings-panel/index.vue` → `@/components/core/layouts/ao-settings-panel/index.vue`
- `@/components/core/layouts/art-global-search/index.vue` → `@/components/core/layouts/ao-global-search/index.vue`
- `@/components/core/layouts/art-screen-lock/index.vue` → `@/components/core/layouts/ao-screen-lock/index.vue`
- `@/components/core/layouts/art-chat-window/index.vue` → `@/components/core/layouts/ao-chat-window/index.vue`
- `@/components/core/layouts/art-fireworks-effect/index.vue` → `@/components/core/layouts/ao-fireworks-effect/index.vue`
- `@/components/core/others/art-watermark/index.vue` → `@/components/core/others/ao-watermark/index.vue`

**注释中的路径**：

- `src/config/setting.ts:17` —— 注释引用 `art-settings-panel/widget/SettingActions.vue` → `ao-settings-panel/widget/SettingActions.vue`

#### 3.5 模板与 `h()` 引用更新

**模板中 `<ArtXxx />`** → `<AoXxx />`（全局搜索所有 `.vue` 文件中的 `<Art` 与 `</Art` 标签）：

- `src/views/index/index.vue`：`<ArtSidebarMenu>`、`<ArtHeaderBar>`、`<ArtPageContent>`、`<ArtGlobalComponent>`
- `src/views/system/{user,role,menu,user-center}/index.vue` 及各 `modules/*.vue`
- `src/views/dashboard/console/modules/*.vue`
- `src/views/exception/{403,404,500}/index.vue`
- `src/views/result/{success,fail}/index.vue`
- `src/components/core/` 下大量组件相互引用（如 `art-sidebar-menu` 内使用 `ArtLogo`、`ArtSvgIcon`、`ArtIconButton`，重命名后内部引用也要改）

**JS 中 `h(ArtXxx, ...)`** → `h(AoXxx, ...)`：

- `src/views/system/user/index.vue:172, 176` —— `h(ArtButtonTable, ...)` → `h(AoButtonTable, ...)`
- `src/views/system/menu/index.vue:202, 206, 214, 219, 223` —— `h(ArtButtonTable, ...)` → `h(AoButtonTable, ...)`
- `src/views/system/role/index.vue:158` —— `h(ArtButtonMore, ...)` → `h(AoButtonMore, ...)`

#### 3.6 执行顺序

1. **先改文件内容**（`defineOptions`、import 路径、模板引用、`h()` 调用、`ArtTableProps` 接口），保持目录名暂不动 —— 此时项目会因 import 路径找不到而报错，**这是中间状态**
2. **再用文件系统操作重命名目录与文件**（用 `RunCommand` 执行 PowerShell `Rename-Item` 或 `git mv`）
3. **启动 `pnpm dev`**：`unplugin-vue-components` 会自动扫描新目录名并重新生成 `src/types/import/components.d.ts`

> 实操建议：因为目录与文件重命名涉及 50+ 项，建议用 PowerShell 脚本批量执行 `Rename-Item`，避免逐个手改。脚本仅做 rename，不做内容修改。

**回归校验**：

- `pnpm lint` / `pnpm lint:stylelint` 通过
- `pnpm dev` 启动无报错，`src/types/import/components.d.ts` 自动重新生成且包含 `AoXxx` 组件名
- 浏览器逐页回归：
  - 登录页（`AuthTopBar` 内部用了 `ArtLogo`/`ArtSvgIcon`，重命名后应显示为 `AoLogo`/`AoSvgIcon`）
  - 控制台 dashboard（图表卡片、统计卡片、时间线卡片）
  - system/user、system/role、system/menu（表格、搜索栏、操作按钮、弹窗表单）
  - system/user-center
  - exception/403、404、500
  - result/success、fail
  - 设置面板（settings-panel）所有子组件
  - 通知面板、全局搜索、屏幕锁定、聊天窗口、烟花特效、水印
  - 切换菜单布局（vertical / horizontal / mixed / dual_column）
  - 切换菜单样式（dark / light / design）
  - 切换主题（dark / light / system）
- Vue DevTools 中组件树应显示 `AoXxx` 而非 `ArtXxx`

---

### 批次 4：品牌字符串替换（`Art Design Pro` → `Ao Design Pro`）

**目标**：将业务可见的品牌字符串替换为 `Ao Design Pro`，保留外部 URL 不动。

**改动文件清单**：

| 文件 | 行号 | 原内容 | 新内容 |
| --- | --- | --- | --- |
| `package.json` | 2 | `"name": "art-design-pro"` | `"name": "ao-design-pro"` |
| `src/config/index.ts` | 41 | `name: 'Art Design Pro'` | `name: 'Ao Design Pro'` |
| `src/utils/sys/console.ts` | 3 | `欢迎使用 Art Design Pro！` | `欢迎使用 Ao Design Pro！` |
| `src/views/system/user-center/index.vue` | 169 | `des: 'Art Design Pro 是一款兼具设计美学与高效开发的后台系统.'` | `des: 'Ao Design Pro 是一款兼具设计美学与高效开发的后台系统.'` |
| `src/components/core/forms/art-excel-export/index.vue`（重命名后为 `ao-excel-export/index.vue`） | 260 | `props.workbookOptions.creator \|\| 'Art Design Pro'` | `props.workbookOptions.creator \|\| 'Ao Design Pro'` |
| `src/config/modules/festival.ts` | 49 | 注释 `Merry Christmas！Art Design Pro 祝您...` | 注释 `Merry Christmas！Ao Design Pro 祝您...` |

**保留不动**：

- `src/utils/sys/console.ts:7` —— `GitHub: https://github.com/Daymychen/art-design-pro`（外部 URL）
- `src/utils/constants/links.ts:10, 13` —— `https://github.com/Daymychen/art-design-pro`（外部 URL）
- `src/utils/constants/links.ts:16, 19, 22, 25, 28, 34` —— `https://www.artd.pro/...`（外部官网 URL）
- 所有 `@author Art Design Pro Team` JSDoc 注释（按用户决策保留）

**回归校验**：

- `pnpm lint` 通过
- `pnpm dev` 启动后：
  - 浏览器控制台确认欢迎语显示 `Ao Design Pro`
  - 进入 user-center 页面确认介绍文案显示 `Ao Design Pro`
  - 测试 Excel 导出功能，打开导出的 xlsx 文件属性确认 creator 为 `Ao Design Pro`
  - festival 配置仅是注释，无运行时影响
- `package.json` name 字段变更不影响运行，但建议执行 `pnpm install` 确认 lock 文件同步

## 六、最终验收清单

全部 4 批完成后，执行最终验收：

1. **代码检查**：
   - `pnpm lint` 全量通过
   - `pnpm lint:stylelint` 全量通过
   - `pnpm lint:prettier` 全量通过
2. **全局残留扫描**：
   - `Grep` 搜索 `--art-` 应仅命中外部 URL 中的 `artd.pro`（保留项）
   - `Grep` 搜索 `.art-` 应仅命中外部 URL 与 `@author` 注释（保留项）
   - `Grep` 搜索 `Art[A-Z]` 应仅命中 `@author Art Design Pro Team` 注释与外部 URL（保留项）
   - `Grep` 搜索 `art-` 目录名应为 0 命中
3. **运行时验收**：
   - `pnpm dev` 启动无报错
   - `pnpm build` 构建无报错
   - 浏览器逐页访问，确认样式、布局、交互全部正常
   - Vue DevTools 组件树全部显示 `Ao*` 前缀
   - 亮色/暗色/系统主题切换正常
   - 菜单布局 4 种切换正常
   - 菜单样式 3 种切换正常
4. **Git 提交规范**（按 `.agents/rules/git-commit-message.md`）：
   - 每批单独提交一次，便于回滚
   - 建议提交信息：
     - 批次 1：`refactor(styles): rename CSS variables from --art-* to --ao-*`
     - 批次 2：`refactor(styles): rename CSS classes from .art-* to .ao-*`
     - 批次 3：`refactor(components): rename Art-prefixed components to Ao`
     - 批次 4：`chore: rename brand strings from Art Design Pro to Ao Design Pro`

## 七、风险与回滚

- 每批独立提交，若某批回归失败，可 `git revert` 该批提交后重新执行
- 批次 3 风险最高（涉及目录重命名 + 自动注册机制），若 `components.d.ts` 未正确重新生成，可手动删除该文件后重启 `pnpm dev`
- 批次 1 风险次高（CSS 变量跨 50+ 文件），遗漏一处会导致局部样式失效，需对照 `Grep` 全量结果逐项核对

## 八、假设与说明

1. 假设 `unplugin-vue-components` 配置不变，目录重命名后会自动按新目录名推导组件名
2. 假设 `src/types/import/components.d.ts` 在 `pnpm dev` 启动时自动重新生成（基于现有 Vite 配置）
3. 假设项目当前无其他依赖 `Art` 前缀的外部脚本或 CI 配置
4. 本计划仅涉及前端代码层面的重命名，不涉及后端接口字段（项目为纯前端模板，无后端）
5. 计划中所有路径均基于 Phase 1 探索结果，未做假设性引用
