# Art → Ao 前缀重命名收尾计划

## 背景与当前状态

本计划是 `art-design-pro` → `admin-template-pro` 二次开发中"统一前缀 art → ao"任务的收尾阶段。前序会话已完成批次 1（CSS 变量）、批次 2（CSS 类名）、批次 3 阶段 A（组件 defineOptions、模板标签、import 路径、TS 类型），但因上下文中断，批次 3 阶段 B（目录/文件重命名）和批次 4（品牌字符串）尚未完成。

### 已确认的用户决策（沿用前序会话）

| 项                                       | 决策                                                  |
| ---------------------------------------- | ----------------------------------------------------- |
| CSS 变量 `--art-*`                       | 全部重命名为 `--ao-*` ✓ 已完成                        |
| 品牌字符串 `Art Design Pro`              | 改为 `Ao Design Pro`，但 **GitHub/官网 URL 保留原样** |
| `@author Art Design Pro Team` JSDoc 注释 | **保留不动**                                          |
| 执行策略                                 | 分多批次，每批后回归校验                              |

### 已完成状态确认（Grep 验证，0 残留）

- `--art-` CSS 变量：0 处残留 ✓
- `.art-` CSS 类名：0 处残留 ✓
- `from '@/components/core/...art-` import 路径：0 处残留 ✓

### 剩余工作清单

#### 残留 1：`art-*` 目录（5 个）

| 当前路径 | 目标路径 |
| --- | --- |
| `src/components/core/layouts/art-header-bar/` | `src/components/core/layouts/ao-header-bar/` |
| `src/components/core/layouts/art-settings-panel/` | `src/components/core/layouts/ao-settings-panel/` |
| `src/components/core/layouts/art-menus/` | `src/components/core/layouts/ao-menus/` |
| `src/components/core/layouts/art-menus/art-sidebar-menu/` | `src/components/core/layouts/ao-menus/ao-sidebar-menu/` |
| `src/components/core/layouts/art-menus/art-horizontal-menu/` | `src/components/core/layouts/ao-menus/ao-horizontal-menu/` |

> 注：`art-menus/ao-mixed-menu/` 已重命名（子目录是 `ao-`），但父目录 `art-menus/` 仍是 `art-`。

#### 残留 2：`Art*.vue` 文件（3 个）

| 当前路径 | 目标路径 |
| --- | --- |
| `src/components/core/layouts/art-header-bar/widget/ArtUserMenu.vue` | `src/components/core/layouts/ao-header-bar/widget/AoUserMenu.vue` |
| `src/components/core/views/exception/ArtException.vue` | `src/components/core/views/exception/AoException.vue` |
| `src/components/core/views/result/ArtResultPage.vue` | `src/components/core/views/result/AoResultPage.vue` |

#### 残留 3：代码引用（1 处）

- `src/components/core/layouts/art-header-bar/index.vue:184`
  - 当前：`import AoUserMenu from './widget/ArtUserMenu.vue'`
  - 目标：`import AoUserMenu from './widget/AoUserMenu.vue'`

#### 残留 4：注释中的旧组件名（4 处，非阻塞但建议清理）

- `src/components/core/tables/ao-table/index.vue:121`：`/** ArtTable 组件的 Props 接口 */`
- `src/components/core/tables/ao-table/index.vue:135`：`/** 是否开启 ArtTableHeader，解决表格高度自适应问题 */`
- `src/components/core/tables/ao-table/index.vue:266`：`// Element Plus 默认值为 true，未显式传入时不应被 ArtTable 覆盖成 false。`
- `src/utils/ui/iconify-loader.ts:10`：`* 3. 在组件中使用：<ArtSvgIcon icon="ri:home-line" />`

#### 残留 5：品牌字符串 `Art Design Pro`（7 处需改）

> 注：82 个文件命中里 75 处是 `@author Art Design Pro Team` JSDoc 注释，保留不动。

| 文件 | 行 | 当前 | 目标 |
| --- | --- | --- | --- |
| `index.html` | 4 | `<title>Art Design Pro</title>` | `<title>Ao Design Pro</title>` |
| `index.html` | 9 | `content="Art Design Pro - A modern..."` | `content="Ao Design Pro - A modern..."` |
| `src/config/index.ts` | 41 | `name: 'Art Design Pro'` | `name: 'Ao Design Pro'` |
| `src/utils/sys/console.ts` | 3 | `\x1b[32m欢迎使用 Art Design Pro！` | `\x1b[32m欢迎使用 Ao Design Pro！` |
| `src/views/system/user-center/index.vue` | 169 | `des: 'Art Design Pro 是一款兼具设计美学与高效开发的后台系统.'` | `des: 'Ao Design Pro 是一款兼具设计美学与高效开发的后台系统.'` |
| `src/components/core/forms/ao-excel-export/index.vue` | 260 | `Author: props.workbookOptions.creator \|\| 'Art Design Pro'` | `Author: props.workbookOptions.creator \|\| 'Ao Design Pro'` |
| `src/config/modules/festival.ts` | 49 | 注释 `Merry Christmas！Art Design Pro 祝您...` | 注释 `Merry Christmas！Ao Design Pro 祝您...` |

#### 不变更范围（保留原样）

- 所有 `@author Art Design Pro Team` JSDoc 注释（75 处）
- 外部 URL：`https://github.com/Daymychen/art-design-pro`、`https://www.artd.pro/...`
- `package.json` 中的 `"name": "art-design-pro"`（属于 npm 包名，不在本次重命名范围）
- `AuthTopBar`、`LoginLeftView`、`ThemeSvg` 等不含 Art 前缀的组件

---

## 执行计划

### 批次 3 阶段 B：目录与文件重命名

**目标**：将 5 个 `art-*` 目录 + 3 个 `Art*.vue` 文件重命名为 `ao-*` / `Ao*`。

**步骤**（按依赖顺序，先子目录后父目录）：

1. **重命名 `Art*.vue` 文件**（3 个，使用 `Rename-Item`）
   - `ArtUserMenu.vue` → `AoUserMenu.vue`
   - `ArtException.vue` → `AoException.vue`
   - `ArtResultPage.vue` → `AoResultPage.vue`

2. **重命名子目录**（2 个）
   - `art-sidebar-menu/` → `ao-sidebar-menu/`
   - `art-horizontal-menu/` → `ao-horizontal-menu/`

3. **重命名父目录**（3 个，从内到外）
   - `art-header-bar/` → `ao-header-bar/`
   - `art-settings-panel/` → `ao-settings-panel/`
   - `art-menus/` → `ao-menus/`

**PowerShell 命令**（在 `e:\hulihan\admin-template-pro` 下执行）：

```powershell
# 步骤 1：重命名 .vue 文件
Rename-Item -Path "src\components\core\layouts\art-header-bar\widget\ArtUserMenu.vue" -NewName "AoUserMenu.vue"
Rename-Item -Path "src\components\core\views\exception\ArtException.vue" -NewName "AoException.vue"
Rename-Item -Path "src\components\core\views\result\ArtResultPage.vue" -NewName "AoResultPage.vue"

# 步骤 2：重命名子目录
Rename-Item -Path "src\components\core\layouts\art-menus\art-sidebar-menu" -NewName "ao-sidebar-menu"
Rename-Item -Path "src\components\core\layouts\art-menus\art-horizontal-menu" -NewName "ao-horizontal-menu"

# 步骤 3：重命名父目录
Rename-Item -Path "src\components\core\layouts\art-header-bar" -NewName "ao-header-bar"
Rename-Item -Path "src\components\core\layouts\art-settings-panel" -NewName "ao-settings-panel"
Rename-Item -Path "src\components\core\layouts\art-menus" -NewName "ao-menus"
```

**验证**：

- `Glob` 搜索 `src/components/core/**/art-*/**` 应返回空
- `Glob` 搜索 `src/components/core/**/Art*.vue` 应返回空

### 批次 3 阶段 C：清理代码引用与注释残留

**目标**：修复因目录/文件重命名导致的引用断裂，并清理注释中的旧组件名。

**修改清单**（共 5 个文件，5 处修改）：

1. **`src/components/core/layouts/ao-header-bar/index.vue`**（第 184 行）
   - 修改：`import AoUserMenu from './widget/ArtUserMenu.vue'`
   - 为：`import AoUserMenu from './widget/AoUserMenu.vue'`

2. **`src/components/core/tables/ao-table/index.vue`**（3 处注释）
   - 第 121 行：`/** ArtTable 组件的 Props 接口 */` → `/** AoTable 组件的 Props 接口 */`
   - 第 135 行：`/** 是否开启 ArtTableHeader，解决表格高度自适应问题 */` → `/** 是否开启 AoTableHeader，解决表格高度自适应问题 */`
   - 第 266 行：`// Element Plus 默认值为 true，未显式传入时不应被 ArtTable 覆盖成 false。` → `// Element Plus 默认值为 true，未显式传入时不应被 AoTable 覆盖成 false。`

3. **`src/utils/ui/iconify-loader.ts`**（第 10 行）
   - 修改：`* 3. 在组件中使用：<ArtSvgIcon icon="ri:home-line" />`
   - 为：`* 3. 在组件中使用：<AoSvgIcon icon="ri:home-line" />`

**验证**：

- `Grep` 搜索 `Art[A-Z][a-zA-Z]+` 在 `src/` 下，应仅命中 `@author Art Design Pro Team` 注释和 `AuthTopBar`（保留项）

### 批次 3 回归校验

**目标**：确保目录重命名后项目可正常启动，`components.d.ts` 自动重新生成。

**步骤**：

1. **启动 dev server**（让 `unplugin-vue-components` 重新扫描并生成 `components.d.ts`）
   - 命令：`pnpm dev`（非阻塞执行）
   - 等待几秒后用 `CheckCommandStatus` 查看输出，确认无报错
   - 验证 `src/types/import/components.d.ts` 中已无 `Art*` 组件名（除 `@author` 注释外），所有路径均为 `ao-*`

2. **停止 dev server**（`StopCommand`）

3. **运行 ESLint**（绕过 pnpm sqlite 问题，直接调用本地二进制）
   - 命令：`node_modules\.bin\eslint . --fix`
   - 验证：exit code 0，无 error

4. **运行 Stylelint**（如涉及样式改动）
   - 命令：`node_modules\.bin\stylelint "**/*.{css,scss,vue}" --fix`
   - 验证：exit code 0

5. **残留扫描**
   - `Grep` 搜索 `--art-`：应为 0 命中
   - `Grep` 搜索 `\.art-`：应为 0 命中
   - `Grep` 搜索 `Art[A-Z]` 在 `src/` 下：应仅命中 `@author Art Design Pro Team` 注释和 `AuthTopBar`
   - `Glob` 搜索 `src/components/core/**/art-*/**`：应为空
   - `Glob` 搜索 `src/components/core/**/Art*.vue`：应为空

### 批次 4：品牌字符串替换（`Art Design Pro` → `Ao Design Pro`）

**目标**：将 7 处实际品牌字符串替换为 `Ao Design Pro`，保留 `@author` 注释和外部 URL。

**修改清单**（共 6 个文件，7 处修改）：

1. **`index.html`**（2 处）
   - 第 4 行：`<title>Art Design Pro</title>` → `<title>Ao Design Pro</title>`
   - 第 9 行：`content="Art Design Pro - A modern..."` → `content="Ao Design Pro - A modern..."`

2. **`src/config/index.ts`**（1 处）
   - 第 41 行：`name: 'Art Design Pro'` → `name: 'Ao Design Pro'`

3. **`src/utils/sys/console.ts`**（1 处）
   - 第 3 行：`\x1b[32m欢迎使用 Art Design Pro！` → `\x1b[32m欢迎使用 Ao Design Pro！`

4. **`src/views/system/user-center/index.vue`**（1 处）
   - 第 169 行：`des: 'Art Design Pro 是一款兼具设计美学与高效开发的后台系统.'` → `des: 'Ao Design Pro 是一款兼具设计美学与高效开发的后台系统.'`

5. **`src/components/core/forms/ao-excel-export/index.vue`**（1 处）
   - 第 260 行：`Author: props.workbookOptions.creator || 'Art Design Pro'` → `Author: props.workbookOptions.creator || 'Ao Design Pro'`

6. **`src/config/modules/festival.ts`**（1 处）
   - 第 49 行：注释 `Merry Christmas！Art Design Pro 祝您...` → `Merry Christmas！Ao Design Pro 祝您...`

**验证**：

- `Grep` 搜索 `Art Design Pro` 应仅命中：
  - 75 处 `@author Art Design Pro Team` JSDoc 注释（保留）
  - `.trae/documents/` 下的计划文件（不影响）
  - 外部 URL 中的 `art-design-pro`（保留）

### 批次 4 回归校验

1. **运行 ESLint**
   - 命令：`node_modules\.bin\eslint . --fix`
   - 验证：exit code 0

2. **运行 Prettier**（确保格式正确）
   - 命令：`node_modules\.bin\prettier --write "**/*.{js,cjs,ts,json,tsx,css,less,scss,vue,html,md}"`
   - 验证：exit code 0

### 最终验收

1. **全量 lint**
   - `node_modules\.bin\eslint .` → exit code 0
   - `node_modules\.bin\stylelint "**/*.{css,scss,vue}"` → exit code 0

2. **启动 dev server 验证**
   - `pnpm dev` → 无报错，页面可正常访问
   - 重点回归测试：菜单管理弹窗、用户头像下拉、表格操作按钮、暗黑模式切换、设置面板、异常页、结果页

3. **构建验证**
   - `pnpm build` → 无报错（包含 `vue-tsc --noEmit` 类型检查）

4. **最终残留扫描**
   - `--art-` CSS 变量：0 命中
   - `.art-` CSS 类名：0 命中
   - `Art[A-Z]` 组件名：仅 `@author Art Design Pro Team` 注释和 `AuthTopBar`
   - `art-` 目录名：0 命中
   - `Art*.vue` 文件名：0 命中
   - `Art Design Pro` 品牌字符串：仅 `@author` 注释和外部 URL

---

## 风险与回滚

### 风险

1. **`components.d.ts` 未及时重新生成**：dev server 启动时会自动重新扫描，若未启动则 `Art*` 组件名仍残留在类型声明中，TS 类型检查会报错。
   - 缓解：批次 3 回归校验步骤 1 强制启动 dev server 触发重新生成。

2. **相对路径 import 断裂**：重命名 `ArtUserMenu.vue` 后，`ao-header-bar/index.vue` 中的 import 路径需要同步更新。
   - 缓解：批次 3 阶段 C 步骤 1 同步修复。

3. **`pnpm` sqlite 数据库错误**：前序会话曾遇到 `pnpm lint` 失败提示 `unable to open database file`。
   - 缓解：直接调用 `node_modules\.bin\eslint .` 绕过 pnpm 依赖检查。

### 回滚

- 若重命名后出现严重问题，可使用 `git status` 查看变更，`git checkout .` 撤销所有未提交的修改（仅限未 commit 的状态）。
- 若已 commit，使用 `git revert <commit-hash>` 回滚特定 commit。

---

## 假设与说明

1. 假设 `package.json` 中的 `"name": "art-design-pro"` 不在本次重命名范围（属于 npm 包名，需单独决策）。
2. 假设 `.trae/documents/art-to-ao-prefix-rename.md`（前序计划文件）已不存在或被忽略，本计划是唯一权威文档。
3. 假设前序会话已完成的批次 1、2、3 阶段 A 修改已保存到磁盘（Grep 验证 0 残留已确认）。
4. 所有 PowerShell 命令在 `e:\hulihan\admin-template-pro` 目录下执行。
5. 重命名顺序严格按"先子后父"执行，避免路径不存在错误。

---

## 执行顺序总览

```
批次 3 阶段 B（目录/文件重命名）
  ↓
批次 3 阶段 C（清理代码引用与注释残留）
  ↓
批次 3 回归校验（dev server + lint + 残留扫描）
  ↓
批次 4（品牌字符串替换）
  ↓
批次 4 回归校验（lint + prettier）
  ↓
最终验收（全量 lint + dev + build + 残留扫描）
```
