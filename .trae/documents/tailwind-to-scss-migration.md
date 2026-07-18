# Tailwind CSS → SCSS 迁移计划

## 概述

将项目中所有使用 Tailwind CSS v4 的页面/组件迁移为 SCSS 方式，最终彻底移除 Tailwind CSS 依赖。采用"分批次迁移 + 每批验证"策略，自定义工具类保留为全局 SCSS，主题 CSS 变量保留并以 `var()` 引用。

## 当前状态分析

### 技术栈
- Vue 3 + TypeScript + Vite 7
- Tailwind CSS v4（CSS-first 配置，无 `tailwind.config.js`）
- Sass ^1.81.0（已配置全局注入 `el-light.scss` 和 `mixin.scss`）

### Tailwind 入口与配置
- **vite.config.ts** [第 11 行](file:///e:/hulihan/admin-template-pro/vite.config.ts#L11) `import tailwindcss from '@tailwindcss/vite'` + [第 70 行](file:///e:/hulihan/admin-template-pro/vite.config.ts#L70) `tailwindcss()` 插件
- **src/main.ts** [第 6 行](file:///e:/hulihan/admin-template-pro/src/main.ts#L6) `import '@styles/core/tailwind.css'`
- **src/assets/styles/core/tailwind.css**（208 行，核心配置文件）：
  - `@import 'tailwindcss'` + `@custom-variant dark`
  - `:root` / `.dark` 块：定义 `--art-primary`、`--art-gray-100~900`、`--default-border`、`--default-box-color`、`--art-hover-color` 等 CSS 变量
  - `@theme` 块：将颜色映射为 Tailwind 工具类（`bg-primary`→`--art-primary` 等）
  - `@utility rounded-custom-xs/sm`：自定义圆角工具类
  - `@layer utilities`：11 个自定义工具类（`.flex-c/.flex-b/.flex-cc/.flex-cb/.tad-200/.tad-300/.border-full-d/.border-b-d/.border-t-d/.border-l-d/.border-r-d/.c-p`）
  - `@layer components`：`.art-card-header` 复合组件类

### 使用 Tailwind 的文件清单（共 70 个）
- **页面组件（views）**：14 个（含 login/register/forget-password、dashboard/console/modules/* 7 个、result/fail、system/user-center、system/role/modules/role-permission-dialog、outside/Iframe）
- **公共组件（components）**：55 个，含 base(3)、banners(1)、cards(9)、charts(7)、forms(4)、layouts(20)、others(2)、tables(1)、text-effect(3)、views(4)、widget(1)
- **特殊文件**：`src/views/auth/login/style.css` 使用 `@reference '@styles/core/tailwind.css';` 引用 Tailwind
- **使用 `@apply` 的文件**：6 个（login/style.css、art-table-header、art-notification、art-mixed-menu、ArtUserMenu、art-global-search）

### 已有 SCSS 基础设施
- 全局 SCSS 入口：[src/assets/styles/index.scss](file:///e:/hulihan/admin-template-pro/src/assets/styles/index.scss)
- 全局 mixin：[src/assets/styles/core/mixin.scss](file:///e:/hulihan/admin-template-pro/src/assets/styles/core/mixin.scss)（9 个 mixin）
  - ⚠️ `backdropBlur` mixin 使用了 `--tw-backdrop-*` 变量，移除 Tailwind 后需重写为标准 `backdrop-filter`
- Vite SCSS 全局注入：`el-light.scss` + `mixin.scss`

## 迁移决策

| 决策项 | 方案 |
|--------|------|
| 自定义工具类（flex-c, border-*-d, c-p, art-card-header 等） | 保留为全局 SCSS 工具类，组件中继续以 `class="flex-c"` 形式使用 |
| 主题 CSS 变量（--art-primary, --art-gray-* 等） | 保留为 CSS 变量，迁移到全局 SCSS 文件，组件 SCSS 中用 `var(--art-primary)` 引用 |
| Tailwind 原生工具类（flex, items-center, text-lg, p-4 等） | 转换为组件内 `<style scoped lang="scss">` 中的样式 |
| 暗黑模式（`dark:` 变体） | 使用 `.dark &` 或 `:where(.dark, .dark *) &` 选择器在组件 SCSS 中实现 |
| 颜色类（bg-primary, text-g-900 等） | 转为 `var(--art-primary)`、`var(--art-gray-900)` 等 |
| 迁移节奏 | 分批次：基础组件 → 卡片 → 图表 → 表单 → 布局 → 其他组件 → 页面 → 移除依赖 |

## 迁移规则手册（适用于每个文件）

### R1. 模板中的 Tailwind 类迁移
- 识别 `<template>` 中所有 `class="..."`、`:class="..."` 内的 Tailwind 工具类
- 为元素添加语义化 class（如 `class="card-header"`），将原 Tailwind 类对应的样式写入 `<style scoped lang="scss">`
- **保留**自定义工具类引用（`flex-c`, `border-b-d`, `c-p`, `tad-200` 等），这些由全局 SCSS 提供
- **响应式断点**（`sm:`/`md:`/`lg:`/`max-sm:` 等）：转为 SCSS `@media` 查询
  - 默认断点：sm=40rem(640px), md=48rem(768px), lg=64rem(1024px), xl=80rem(1280px), 2xl=96rem(1536px)
  - `max-sm:` → `@media (max-width: 39.99rem)` 等

### R2. `@apply` 指令处理
- 将 `<style>` 中的 `@apply xxx yyy zzz` 展开为对应的 CSS 属性
- 例如 `@apply flex items-center justify-between` → `display: flex; align-items: center; justify-content: space-between;`
- 删除 `@reference '@styles/core/tailwind.css';` 引用语句

### R3. 颜色类映射表
| Tailwind 类 | SCSS 写法 |
|-------------|-----------|
| `bg-primary` / `text-primary` | `color/background: var(--art-primary)` |
| `bg-g-100` ~ `bg-g-900` | `background: var(--art-gray-100~900)` |
| `text-g-100` ~ `text-g-900` | `color: var(--art-gray-100~900)` |
| `bg-box` | `background: var(--default-box-color)` |
| `bg-theme` / `text-theme` | `var(--theme-color)` |
| `bg-hover-color` | `background: var(--art-hover-color)` |
| `bg-active-color` | `background: var(--art-active-color)` |
| `border-box` / `border-default` | `border-color: var(--default-border)` |

### R4. 暗黑模式迁移
- `dark:bg-x` → SCSS 中 `.dark & { background: ... }` 或 `:where(.dark, .dark *) & { ... }`
- 优先使用已有 CSS 变量（暗黑模式自动切换），避免手写 `.dark` 覆盖

### R5. 文件结构
- 每个 `.vue` 组件的 `<style>` 块改为 `<style scoped lang="scss">`
- 若原组件已有 `<style scoped lang="scss">`，将新样式合并进去
- 若原样式为 `<style lang="css">` 或独立 `.css` 文件，转为 scss 并合并

## 实施步骤

### 阶段 0：建立 SCSS 基础设施（不破坏现有 Tailwind）

**目标**：将 Tailwind 的自定义配置迁移到独立 SCSS 文件，使全局工具类在 Tailwind 移除后仍可用。

1. **新建** `src/assets/styles/core/theme.scss`
   - 迁移 `tailwind.css` 第 4-84 行的 `:root` 和 `.dark` 块（CSS 变量定义）
   - 内容为纯 CSS 变量声明，SCSS 兼容

2. **新建** `src/assets/styles/core/utilities.scss`
   - 迁移 `tailwind.css` 第 125-207 行的自定义工具类，转为 SCSS 写法：
     ```scss
     // Flexbox 布局工具类
     .flex-c { display: flex; align-items: center; }
     .flex-b { display: flex; justify-content: space-between; }
     .flex-cc { display: flex; align-items: center; justify-content: center; }
     .flex-cb { display: flex; align-items: center; justify-content: space-between; }
     // 过渡动画
     .tad-200 { transition: all 200ms; }
     .tad-300 { transition: all 300ms; }
     // 边框工具类
     .border-full-d { border: 1px solid var(--default-border); }
     .border-b-d { border-bottom: 1px solid var(--default-border); }
     .border-t-d { border-top: 1px solid var(--default-border); }
     .border-l-d { border-left: 1px solid var(--default-border); }
     .border-r-d { border-right: 1px solid var(--default-border); }
     // 光标
     .c-p { cursor: pointer; }
     // 自定义圆角
     .rounded-custom-xs { border-radius: calc(var(--custom-radius) / 2); }
     .rounded-custom-sm { border-radius: calc(var(--custom-radius) / 2 + 2px); }
     // art-card-header 组件类
     .art-card-header { ... }
     ```

3. **修改** `src/assets/styles/index.scss`
   - 在合适位置 `@use './core/theme.scss';` 和 `@use './core/utilities.scss';`

4. **修复** `src/assets/styles/core/mixin.scss` 的 `backdropBlur` mixin
   - 移除对 `--tw-backdrop-*` 变量的依赖，改为标准 `backdrop-filter: blur(30px);`

5. **验证**：启动 dev 服务器，确认现有页面无样式变化（Tailwind 仍可用，全局 SCSS 工具类已就绪）

### 阶段 1：基础组件迁移（base/，3 个文件）

迁移以下文件，将 Tailwind 类转为组件内 SCSS：
- `src/components/core/base/art-back-to-top/index.vue`
- `src/components/core/base/art-logo/index.vue`
- `src/components/core/base/art-svg-icon/index.vue`

**验证**：启动 dev，检查回到顶部按钮、Logo、SVG 图标显示正常。

### 阶段 2：卡片组件迁移（cards/，9 个文件）

- `art-bar-chart-card/index.vue`
- `art-data-list-card/index.vue`
- `art-donut-chart-card/index.vue`
- `art-image-card/index.vue`
- `art-line-chart-card/index.vue`
- `art-progress-card/index.vue`
- `art-stats-card/index.vue`
- `art-timeline-list-card/index.vue`

**验证**：访问 dashboard/console 页面，检查所有卡片展示正常。

### 阶段 3：图表组件迁移（charts/，7 个文件）

- `art-h-bar-chart/index.vue`
- `art-k-line-chart/index.vue`
- `art-line-chart/index.vue`
- `art-radar-chart/index.vue`
- `art-ring-chart/index.vue`
- `art-scatter-chart/index.vue`

**验证**：检查各图表组件容器样式与尺寸正确。

### 阶段 4：表单组件迁移（forms/，4 个文件）

- `art-button-more/index.vue`
- `art-drag-verify/index.vue`
- `art-excel-import/index.vue`
- `art-form/index.vue`

**验证**：检查表单组件交互、布局正常。

### 阶段 5：布局组件迁移（layouts/，20 个文件，最复杂）

按子模块分批：
- **5.1 菜单**：`art-menus/art-horizontal-menu/index.vue` + `widget/HorizontalSubmenu.vue` + `art-menus/art-mixed-menu/index.vue` + `art-menus/art-sidebar-menu/index.vue` + `widget/SidebarSubmenu.vue`
- **5.2 顶栏**：`art-header-bar/index.vue` + `widget/ArtUserMenu.vue`（含 `@apply`）
- **5.3 设置面板**：`art-settings-panel/widget/*` 共 7 个（BoxStyleSettings、ColorSettings、ContainerSettings、SectionTitle、SettingActions、SettingHeader、SettingItem）
- **5.4 其他布局**：`art-breadcrumb`、`art-chat-window`、`art-fast-enter`、`art-fireworks-effect`、`art-global-search`（含 `@apply`）、`art-notification`（含 `@apply`）、`art-page-content`、`art-screen-lock`、`art-work-tab`

**验证**：重点测试菜单展开/折叠、暗黑模式切换、设置面板、全局搜索、通知中心、工作台标签页等交互。

### 阶段 6：其他组件迁移
- `banners/art-card-banner/index.vue`
- `others/art-menu-right/index.vue`、`others/art-watermark/index.vue`
- `tables/art-table-header/index.vue`（含 `@apply`）
- `text-effect/art-count-to/index.vue`、`art-festival-text-scroll/index.vue`、`art-text-scroll/index.vue`
- `views/exception/ArtException.vue`、`views/login/AuthTopBar.vue`、`views/login/LoginLeftView.vue`、`views/result/ArtResultPage.vue`
- `widget/art-icon-button/index.vue`

**验证**：检查水印、表格头部、异常页、结果页等。

### 阶段 7：页面组件迁移（views/，14 个文件）

- **7.1 认证页**：`auth/login/index.vue` + `auth/login/style.css`（含 `@reference`，转为 scss）+ `auth/register/index.vue` + `auth/forget-password/index.vue`
- **7.2 Dashboard**：`dashboard/console/modules/` 下 7 个（todo-list、sales-overview、new-user、card-list、dynamic-stats、about-project、active-user）
- **7.3 其他页面**：`result/fail/index.vue`、`system/user-center/index.vue`、`system/role/modules/role-permission-dialog.vue`、`outside/Iframe.vue`

**验证**：逐页面访问，重点检查登录页、控制台、个人中心、角色权限弹窗等。

### 阶段 8：移除 Tailwind 依赖

1. **修改** `src/main.ts`：删除 [第 6 行](file:///e:/hulihan/admin-template-pro/src/main.ts#L6) `import '@styles/core/tailwind.css'`
2. **修改** `vite.config.ts`：
   - 删除 [第 11 行](file:///e:/hulihan/admin-template-pro/vite.config.ts#L11) `import tailwindcss from '@tailwindcss/vite'`
   - 删除 [第 70 行](file:///e:/hulihan/admin-template-pro/vite.config.ts#L70) `tailwindcss(),`
3. **删除** `src/assets/styles/core/tailwind.css` 文件
4. **删除** `src/views/auth/login/style.css` 文件（内容已在阶段 7.1 迁移到组件 scss）
5. **修改** `package.json`：移除 `"@tailwindcss/vite": "^4.1.14"` 依赖
6. **执行** `pnpm install` 更新依赖锁文件
7. **全局搜索** `tailwind`、`@apply`、`@reference`、`dark:`、`@layer`、`@theme`、`@utility`、`@custom-variant` 关键字，确认无残留

### 阶段 9：最终验证

1. 启动 dev 服务器，全量回归测试：
   - 亮色/暗黑模式切换
   - 主题色切换
   - 响应式布局（移动端/桌面端）
   - 所有页面路由访问
   - 所有交互组件（菜单、表单、弹窗、图表）
2. 执行 `pnpm build` 确认生产构建无错误
3. 检查打包产物中无 `tailwind` 相关代码

## 风险与注意事项

1. **回归风险**：70 个文件迁移工作量大，必须严格分批验证，每批完成后启动 dev 检查。
2. **暗黑模式**：原本依赖 Tailwind 的 `dark:` 变体，迁移后需手动编写 `.dark &` 选择器或依赖 CSS 变量自动切换。优先使用 CSS 变量。
3. **响应式断点**：Tailwind v4 默认断点需准确映射到 `@media` 查询，注意 `max-sm:` 等 max-variants 的边界值。
4. **`@apply` 展开正确性**：需准确将每个 Tailwind 工具类展开为标准 CSS 属性，注意 `transition-all`、`duration-200` 等的精确值。
5. **`mixin.scss` 的 `backdropBlur`**：当前依赖 Tailwind 内部变量，阶段 0 必须重写。
6. **scoped 样式与全局工具类共存**：组件 `<style scoped>` 不会影响全局工具类（`flex-c` 等）的生效，因为它们由全局 SCSS 提供。
7. **Element Plus 样式**：`el-light.scss` 全局注入不变，不影响 Element Plus 组件主题。
8. **保留 `--custom-radius` 变量**：`rounded-custom-xs/sm` 依赖此变量，需确认其定义位置（应在主题配置中保留）。

## 验证检查清单

- [ ] `theme.scss` 中 `:root` 和 `.dark` 变量与原 `tailwind.css` 完全一致
- [ ] `utilities.scss` 中所有自定义工具类已迁移
- [ ] `mixin.scss` 的 `backdropBlur` 已重写
- [ ] 70 个文件全部迁移完成，无残留 Tailwind 类
- [ ] 6 个 `@apply` 文件已展开为标准 CSS
- [ ] `login/style.css` 已转为 scss 并合并
- [ ] `main.ts` 已移除 tailwind.css 引入
- [ ] `vite.config.ts` 已移除 tailwind 插件
- [ ] `package.json` 已移除 `@tailwindcss/vite` 依赖
- [ ] `tailwind.css` 文件已删除
- [ ] 全局搜索 `tailwind`、`@apply`、`@reference` 无残留
- [ ] dev 服务器启动正常，所有页面样式无回归
- [ ] 暗黑模式切换正常
- [ ] 主题色切换正常
- [ ] 响应式布局正常
- [ ] `pnpm build` 构建成功
