# Tailwind CSS → SCSS 迁移：收尾阶段计划

> 本计划承接前序已完成的部分（阶段 0-7 主体迁移），聚焦于：
> 1. 阶段 7 查漏补缺：修复 3 个在 `render 函数 h()` 与动态 `class` 中仍残留 Tailwind 原生类的文件
> 2. 阶段 8：彻底移除 Tailwind CSS 依赖
> 3. 阶段 9：最终验证

---

## 一、当前状态分析

### 1.1 已完成的工作
- **阶段 0（SCSS 基础设施）**：
  - 创建 [theme.scss](file:///e:/hulihan/admin-template-pro/src/assets/styles/core/theme.scss)，迁移了 `:root` 与 `.dark` 块的所有 CSS 变量
  - 创建 [utilities.scss](file:///e:/hulihan/admin-template-pro/src/assets/styles/core/utilities.scss)，迁移了 `flex-c / flex-b / flex-cc / flex-cb / tad-200 / tad-300 / border-full-d / border-b-d / border-t-d / border-l-d / border-r-d / c-p / rounded-custom-xs / rounded-custom-sm / art-card-header` 等自定义工具类
  - 在 [index.scss](file:///e:/hulihan/admin-template-pro/src/assets/styles/index.scss) 中通过 `@use './core/theme.scss';` 和 `@use './core/utilities.scss';` 引入
  - 修改 [mixin.scss](file:///e:/hulihan/admin-template-pro/src/assets/styles/core/mixin.scss) 的 `backdropBlur` mixin，移除 `--tw-backdrop-*` 依赖

- **阶段 1-7（组件迁移）**：约 70 个组件/页面文件已将 template 中的 `class="..."` Tailwind 类迁移为 scoped SCSS

### 1.2 待修复的遗漏点（3 个文件）

通过 Grep 全局搜索 `class:\s*['"][^'"]*\b(ml-|mr-|...)` 发现，以下 3 个文件在 **render 函数 `h()` 或动态 class 字符串** 中仍残留 Tailwind 原子类（之前子代理主要搜索 `template` 中的 `class="..."`，未覆盖这些场景）：

| 文件 | 位置 | 残留内容 |
|------|------|----------|
| [menu-dialog.vue](file:///e:/hulihan/admin-template-pro/src/views/system/menu/modules/menu-dialog.vue) | 第 67 行 | `class: 'ml-0.5 cursor-help'`（第 59 行已改为 `label-tooltip`） |
| [system/user/index.vue](file:///e:/hulihan/admin-template-pro/src/views/system/user/index.vue) | 第 132、138 行 | `class: 'size-9.5 rounded-md'`、`class: 'ml-2'` |
| [art-button-table/index.vue](file:///e:/hulihan/admin-template-pro/src/components/core/forms/art-button-table/index.vue) | 第 5、39-42 行 | 模板：`'inline-flex items-center justify-center min-w-8 h-8 px-2.5 mr-2.5 text-sm c-p rounded-md align-middle'`；动态类：`'bg-theme/12 text-theme'` 等 4 个 |

### 1.3 Tailwind 依赖现状

| 文件 | 行号 | 内容 |
|------|------|------|
| [main.ts](file:///e:/hulihan/admin-template-pro/src/main.ts) | 第 6 行 | `import '@styles/core/tailwind.css'` |
| [vite.config.ts](file:///e:/hulihan/admin-template-pro/vite.config.ts) | 第 11 行 | `import tailwindcss from '@tailwindcss/vite'` |
| [vite.config.ts](file:///e:/hulihan/admin-template-pro/vite.config.ts) | 第 70 行 | `tailwindcss(),` |
| [package.json](file:///e:/hulihan/admin-template-pro/package.json) | 第 57 行 | `"@tailwindcss/vite": "^4.1.14",` |
| [tailwind.css](file:///e:/hulihan/admin-template-pro/src/assets/styles/core/tailwind.css) | 整个文件 | 含 `@import 'tailwindcss'`、`@theme`、`@utility`、`@layer` 等指令（已迁移至 theme.scss / utilities.scss） |

### 1.4 关键变量溯源
- `--main-color: var(--el-color-primary)` 定义在 [el-ui.scss](file:///e:/hulihan/admin-template-pro/src/assets/styles/core/el-ui.scss) 第 5 行
- `--theme-color: var(--main-color)` 定义在 [theme.scss](file:///e:/hulihan/admin-template-pro/src/assets/styles/core/theme.scss) 第 11 行
- 因此原 Tailwind `bg-theme` / `text-theme` → `var(--theme-color)`
- 原 `bg-secondary` / `text-secondary` → `var(--art-secondary)`，依此类推

---

## 二、迁移规则与映射约定（沿用前序阶段）

| Tailwind 类 | SCSS 等价 |
|-------------|----------|
| `ml-0.5` | `margin-left: 0.125rem` |
| `ml-2` | `margin-left: 0.5rem` |
| `cursor-help` | `cursor: help` |
| `size-9.5` | `width: 2.375rem; height: 2.375rem` |
| `rounded-md` | `border-radius: 0.375rem` |
| `inline-flex items-center justify-center` | `display: inline-flex; align-items: center; justify-content: center` |
| `min-w-8 h-8` | `min-width: 2rem; height: 2rem` |
| `px-2.5 mr-2.5` | `padding-left: 0.625rem; padding-right: 0.625rem; margin-right: 0.625rem` |
| `text-sm` | `font-size: 0.875rem; line-height: 1.25rem` |
| `rounded-md align-middle` | `border-radius: 0.375rem; vertical-align: middle` |
| `bg-theme/12 text-theme` | `background-color: color-mix(in oklab, var(--theme-color) 12%, transparent); color: var(--theme-color)` |
| `bg-secondary/12 text-secondary` | `background-color: color-mix(in oklab, var(--art-secondary) 12%, transparent); color: var(--art-secondary)` |
| `bg-error/12 text-error` | `background-color: color-mix(in oklab, var(--art-error) 12%, transparent); color: var(--art-error)` |
| `bg-info/12 text-info` | `background-color: color-mix(in oklab, var(--art-info) 12%, transparent); color: var(--art-info)` |

**保留策略**：自定义工具类（`flex-c / c-p / tad-300` 等）继续以全局 SCSS class 形式使用，不展开。

---

## 三、实施步骤

### 步骤 1：修复 menu-dialog.vue

**文件**：[src/views/system/menu/modules/menu-dialog.vue](file:///e:/hulihan/admin-template-pro/src/views/system/menu/modules/menu-dialog.vue)

**修改 1**：第 67 行，将 `class: 'ml-0.5 cursor-help'` 改为 `class: 'help-icon'`

**修改 2**：在文件末尾 `</script>` 标签后追加 scoped scss 块：
```scss
<style scoped lang="scss">
// 带 tooltip 的表单标签容器（原 flex items-center）
.label-tooltip {
  display: flex;
  align-items: center;
}

// 帮助图标（原 ml-0.5 cursor-help）
.help-icon {
  margin-left: 0.125rem;
  cursor: help;
}
</style>
```

### 步骤 2：修复 system/user/index.vue

**文件**：[src/views/system/user/index.vue](file:///e:/hulihan/admin-template-pro/src/views/system/user/index.vue)

**修改 1**：第 132 行，`class: 'size-9.5 rounded-md'` → `class: 'user-avatar'`

**修改 2**：第 138 行，`class: 'ml-2'` → `class: 'user-info'`

**修改 3**：在文件末尾 `</script>` 标签后追加 scoped scss 块：
```scss
<style scoped lang="scss">
// 用户头像（原 size-9.5 rounded-md）
.user-avatar {
  width: 2.375rem;
  height: 2.375rem;
  border-radius: 0.375rem;
}

// 用户名与邮箱容器（原 ml-2）
.user-info {
  margin-left: 0.5rem;
}
</style>
```

> 说明：第 130 行 `class: 'user flex-c'` 中 `flex-c` 为保留的全局工具类，无需修改。

### 步骤 3：修复 art-button-table/index.vue

**文件**：[src/components/core/forms/art-button-table/index.vue](file:///e:/hulihan/admin-template-pro/src/components/core/forms/art-button-table/index.vue)

**修改 1**：模板第 5 行，将 Tailwind 原子类替换为单一 BEM 类名（保留全局 `c-p`）：
```vue
'class: 'art-button-table c-p',
```
即将原 `'inline-flex items-center justify-center min-w-8 h-8 px-2.5 mr-2.5 text-sm c-p rounded-md align-middle'` 改为 `'art-button-table c-p'`。

**修改 2**：第 39-42 行的动态颜色类，将 Tailwind 透明度类替换为语义化 class 名：
```ts
add: { icon: 'ri:add-fill', class: 'art-btn-theme' },
edit: { icon: 'ri:pencil-line', class: 'art-btn-secondary' },
delete: { icon: 'ri:delete-bin-5-line', class: 'art-btn-error' },
view: { icon: 'ri:eye-line', class: 'art-btn-info' },
```

**修改 3**：在文件末尾 `</script>` 标签后追加 scoped scss 块：
```scss
<style scoped lang="scss">
// 表格按钮基础样式（原 inline-flex items-center justify-center min-w-8 h-8 px-2.5 mr-2.5 text-sm rounded-md align-middle）
.art-button-table {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  padding-left: 0.625rem;
  padding-right: 0.625rem;
  margin-right: 0.625rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  border-radius: 0.375rem;
  vertical-align: middle;
}

// 主题色按钮（原 bg-theme/12 text-theme）
.art-btn-theme {
  background-color: color-mix(in oklab, var(--theme-color) 12%, transparent);
  color: var(--theme-color);
}

// 次要色按钮（原 bg-secondary/12 text-secondary）
.art-btn-secondary {
  background-color: color-mix(in oklab, var(--art-secondary) 12%, transparent);
  color: var(--art-secondary);
}

// 错误色按钮（原 bg-error/12 text-error）
.art-btn-error {
  background-color: color-mix(in oklab, var(--art-error) 12%, transparent);
  color: var(--art-error);
}

// 信息色按钮（原 bg-info/12 text-info）
.art-btn-info {
  background-color: color-mix(in oklab, var(--art-info) 12%, transparent);
  color: var(--art-info);
}
</style>
```

### 步骤 4：移除 main.ts 中的 Tailwind 引入

**文件**：[src/main.ts](file:///e:/hulihan/admin-template-pro/src/main.ts)

**修改**：删除第 6 行 `import '@styles/core/tailwind.css' // tailwind`

### 步骤 5：移除 vite.config.ts 中的 Tailwind 插件

**文件**：[vite.config.ts](file:///e:/hulihan/admin-template-pro/vite.config.ts)

**修改 1**：删除第 11 行 `import tailwindcss from '@tailwindcss/vite'`

**修改 2**：删除第 70 行 `tailwindcss(),`

### 步骤 6：移除 package.json 中的依赖

**文件**：[package.json](file:///e:/hulihan/admin-template-pro/package.json)

**修改**：删除第 57 行 `"@tailwindcss/vite": "^4.1.14",`

> 注意：该依赖原本放在 `dependencies` 中（非 `devDependencies`），删除即可。

### 步骤 7：删除 tailwind.css 文件

**文件**：[src/assets/styles/core/tailwind.css](file:///e:/hulihan/admin-template-pro/src/assets/styles/core/tailwind.css)

**操作**：使用 DeleteFile 工具彻底删除该文件。

> 验证依据：该文件中的 `:root` / `.dark` 变量已全部迁移至 [theme.scss](file:///e:/hulihan/admin-template-pro/src/assets/styles/core/theme.scss)；`@utility` / `@layer` 中的自定义工具类已全部迁移至 [utilities.scss](file:///e:/hulihan/admin-template-pro/src/assets/styles/core/utilities.scss)；`@theme` 中的 `--color-*` 映射变量仅服务于 Tailwind 类生成，删除后不影响（组件已直接用 `var(--art-*)`）。

### 步骤 8：重新安装依赖

执行 `pnpm install` 清理 node_modules 中的 `@tailwindcss/vite` 包。

---

## 四、验证步骤（阶段 9）

### 4.1 静态验证
1. **Grep 残留检查**：在 `src/` 下搜索以下模式，确认无残留：
   - `@apply|@reference|@theme|@utility|@custom-variant`（Tailwind 指令）
   - `@tailwindcss/vite|from 'tailwindcss'`（依赖导入）
   - `class:\s*['"][^'"]*\b(ml-|mr-|mt-|mb-|p[xytrbl]?-|w-|h-|text-|bg-|border|rounded-|flex|items-|justify-|gap-|opacity-|duration-)`（render 函数中的 Tailwind 原子类）
   - `class=['\"][^'\"]*\b(sm:|md:|lg:|xl:|2xl:|dark:|hover:|focus:)`（响应式/状态前缀）

2. **文件存在性检查**：确认 `src/assets/styles/core/tailwind.css` 已删除。

### 4.2 构建验证
1. 执行 `pnpm dev` 启动开发服务器，确认无编译错误、无运行时错误。
2. 执行 `pnpm build` 确认生产构建通过。

### 4.3 视觉回归验证（人工）
重点检查以下页面/组件：
- **菜单管理**：菜单弹窗中带问号图标的表单标签（验证 `.label-tooltip` 和 `.help-icon`）
- **用户管理**：表格中用户头像与用户名/邮箱的布局（验证 `.user-avatar` 和 `.user-info`）
- **任意含表格操作的页面**：增删改查按钮的颜色（验证 `.art-btn-theme` 等 4 个动态颜色类）
- **暗黑模式切换**：确认主题色与灰阶变量正常切换

---

## 五、假设与决策

1. **假设**：前序阶段已完成主体迁移，仅剩 3 个文件遗漏。通过 Grep 已确认无其他 template 静态类残留（搜索结果均为 SCSS 注释或已迁移完成的文件）。
2. **决策**：`bg-theme/12` 中的 `theme` 对应 `var(--theme-color)`（而非 `var(--art-primary)`），依据是原 `tailwind.css` 中 `@theme` 块的 `--color-theme: var(--theme-color)` 定义。
3. **决策**：动态颜色类采用 BEM 语义化类名（`art-btn-theme` 等），而非内联 style，以保持与项目其他组件一致的风格。
4. **决策**：不修改 `el-ui.scss` 中的 `--main-color` 定义，保持现有主题色链路 `--el-color-primary → --main-color → --theme-color` 不变。
5. **决策**：`pnpm install` 步骤可选——若用户未授权运行命令，可由用户后续手动执行；删除 `package.json` 中的依赖条目后，下次 install 时会自动清理。

---

## 六、改动文件清单

| # | 文件 | 操作 |
|---|------|------|
| 1 | src/views/system/menu/modules/menu-dialog.vue | 修改（第 67 行 + 追加 style 块） |
| 2 | src/views/system/user/index.vue | 修改（第 132、138 行 + 追加 style 块） |
| 3 | src/components/core/forms/art-button-table/index.vue | 修改（第 5、39-42 行 + 追加 style 块） |
| 4 | src/main.ts | 修改（删除第 6 行） |
| 5 | vite.config.ts | 修改（删除第 11、70 行） |
| 6 | package.json | 修改（删除第 57 行依赖） |
| 7 | src/assets/styles/core/tailwind.css | 删除 |

共计 **6 个文件修改 + 1 个文件删除**。
