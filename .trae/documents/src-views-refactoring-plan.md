# src/views 目录规范化重构计划

## 概述

将 `src/views/` 下所有页面统一调整为用户定义的 8 条规范，涉及样式内联、类型外移、目录重命名、组件重命名、import 规范等。

---

## 现状分析

### 1. 样式规范违规 — 独立样式文件

| 文件路径                          | 引入方式            |
| --------------------------------- | ------------------- |
| `src/views/auth/login/style.scss` | `@import './style'` |
| `src/views/index/style.scss`      | `@use './style'`    |

这两个页面将样式写在独立的 `.scss` 文件中，通过 `@import` / `@use` 引入，违反「禁止创建独立样式文件」的规范。

### 2. TypeScript 类型规范违规 — .vue 内声明类型

| 文件路径 | 违规类型声明 |
| --- | --- |
| `src/views/auth/login/index.vue` | `type AccountKey`、`export interface Account` |
| `src/views/system/user/index.vue` | `type UserListItem`（类型别名） |
| `src/views/system/role/index.vue` | `type RoleListItem`、`type RoleSearchFormParams` |
| `src/views/system/menu/index.vue` | `interface MenuFormData` |
| `src/views/system/role/modules/role-edit-dialog.vue` | `type RoleListItem`、`interface Props`、`interface Emits` |
| `src/views/system/role/modules/role-search.vue` | `type RoleSearchFormParams`、`interface Props`、`interface Emits` |
| `src/views/system/role/modules/role-permission-dialog.vue` | `type RoleListItem`、`interface Props`、`interface Emits`、`interface MenuNode` |
| `src/views/system/menu/modules/menu-dialog.vue` | `interface MenuFormData`、`interface Props`、`interface Emits` |
| `src/views/system/user/modules/user-search.vue` | `interface Props`、`interface Emits` |
| `src/views/system/user/modules/user-dialog.vue` | `interface Props`、`interface Emits` |

> 注意：`defineProps<Props>()` 和 `defineEmits<Emits>()` 中使用的 `Props`/`Emits` 接口属于 Vue 组件特有模式，按规范也应外移到 `types.ts`，然后在 .vue 中用 `import type` 引入。

### 3. 目录命名违规 — `modules/` 应为 `components/`

| 当前路径                               | 目标路径                                  |
| -------------------------------------- | ----------------------------------------- |
| `src/views/dashboard/console/modules/` | `src/views/dashboard/console/components/` |
| `src/views/system/user/modules/`       | `src/views/system/user/components/`       |
| `src/views/system/role/modules/`       | `src/views/system/role/components/`       |
| `src/views/system/menu/modules/`       | `src/views/system/menu/components/`       |

### 4. 组件命名违规 — kebab-case 应为 PascalCase

| 当前文件名                           | 目标文件名                            |
| ------------------------------------ | ------------------------------------- |
| `modules/about-project.vue`          | `components/AboutProject.vue`         |
| `modules/banner-showcase.vue`        | `components/BannerShowcase.vue`       |
| `modules/user-search.vue`            | `components/UserSearch.vue`           |
| `modules/user-dialog.vue`            | `components/UserDialog.vue`           |
| `modules/role-search.vue`            | `components/RoleSearch.vue`           |
| `modules/role-edit-dialog.vue`       | `components/RoleEditDialog.vue`       |
| `modules/role-permission-dialog.vue` | `components/RolePermissionDialog.vue` |
| `modules/menu-dialog.vue`            | `components/MenuDialog.vue`           |

### 5. Import 规范

当前 `import type` 使用基本规范，`element-plus` 类型已使用 `import type`，但部分类型别名声明在 .vue 中应外移后用 `import type` 引入。

### 6. 无 `api.ts` / `hooks.ts` / `types.ts` 等辅助文件

`src/views/` 下目前没有任何页面级别的 `api.ts`、`hooks.ts`、`types.ts`、`constants.ts`、`utils.ts` 文件，所有逻辑都内联在 `index.vue` 中。

---

## 变更计划

### 步骤 1：auth/login 页面重构

**1.1 创建 `src/views/auth/login/types.ts`**

- 从 `index.vue` 中提取 `AccountKey` 类型别名和 `Account` 接口
- `Account` 接口去掉 `export`（页面私有类型）

**1.2 将 `style.scss` 内联到 `index.vue`**

- 将 `src/views/auth/login/style.scss` 的内容合并到 `index.vue` 的 `<style scoped lang="scss">` 中
- 删除 `style.scss` 文件
- 删除 `@import './style'` 语句
- 保留 `.login-container`、`.login-right-side` 等已有样式
- 将 `.auth-right-wrap`、`.form`、`.title`、`.sub-title`、`.custom-height`、`@keyframes slideInRight` 等样式内联，使用 SCSS 嵌套

**1.3 更新 `index.vue` 中的 import**

- 添加 `import type { AccountKey, Account } from './types'`
- 移除 `.vue` 文件内的 `type AccountKey` 和 `interface Account` 声明

### 步骤 2：dashboard/console 页面重构

**2.1 重命名目录 `modules/` → `components/`**

**2.2 重命名组件文件**

- `modules/about-project.vue` → `components/AboutProject.vue`
- `modules/banner-showcase.vue` → `components/BannerShowcase.vue`

**2.3 更新 `index.vue` 中的 import 路径**

```ts
// 旧
import AboutProject from './modules/about-project.vue'
import BannerShowcase from './modules/banner-showcase.vue'

// 新
import AboutProject from './components/AboutProject.vue'
import BannerShowcase from './components/BannerShowcase.vue'
```

### 步骤 3：system/user 页面重构

**3.1 创建 `src/views/system/user/types.ts`**

- 提取 `UserListItem` 类型别名（如果仅为 `Api.SystemManage.UserListItem` 的别名，可以直接在 .vue 中用 `import type` 引入原始类型，不需要额外别名；但按规范，页面私有类型别名也可放 `types.ts`）
- 考虑 `USER_STATUS_CONFIG` 常量和 `getUserStatusConfig` 函数是否应抽取到 `constants.ts` 或 `utils.ts`

**3.2 重命名目录 `modules/` → `components/`**

**3.3 重命名组件文件**

- `modules/user-search.vue` → `components/UserSearch.vue`
- `modules/user-dialog.vue` → `components/UserDialog.vue`

**3.4 创建 `src/views/system/user/components/types.ts`（子组件共享类型）**

- 从 `user-search.vue` 中提取 `Props` 和 `Emits` 接口
- 从 `user-dialog.vue` 中提取 `Props` 和 `Emits` 接口

> 注意：如果类型仅在单个组件内使用，也可以在该组件目录下单独放 `types.ts`。但当前组件是平铺在 `components/` 下，没有子目录，因此创建一个共享的 `components/types.ts` 更合理。或者，每个组件的 Props/Emits 可以直接内联使用（Vue `defineProps`/`defineEmits` 的类型声明在 .vue 中是常见做法）。
>
> **决策**：对于 Vue 组件的 `Props`/`Emits` 接口，按照规范必须外移到 `types.ts`。由于这些类型只在各自组件中使用，在 `components/` 下创建一个 `types.ts` 集中管理所有子组件的类型。

**3.5 更新所有 import 路径和类型引用**

### 步骤 4：system/role 页面重构

**4.1 创建 `src/views/system/role/types.ts`**

- 从 `index.vue` 提取 `RoleListItem`、`RoleSearchFormParams` 类型别名
- 从子组件提取 `Props`/`Emits` 接口（`RoleEditDialogProps`/`RoleEditDialogEmits`、`RoleSearchProps`/`RoleSearchEmits`、`RolePermissionDialogProps`/`RolePermissionDialogEmits`）
- 提取 `MenuNode` 接口（来自 `role-permission-dialog.vue`）

**4.2 重命名目录 `modules/` → `components/`**

**4.3 重命名组件文件**

- `modules/role-search.vue` → `components/RoleSearch.vue`
- `modules/role-edit-dialog.vue` → `components/RoleEditDialog.vue`
- `modules/role-permission-dialog.vue` → `components/RolePermissionDialog.vue`

**4.4 更新所有 import 路径和类型引用**

### 步骤 5：system/menu 页面重构

**5.1 创建 `src/views/system/menu/types.ts`**

- 从 `index.vue` 提取 `MenuFormData` 接口
- 从 `menu-dialog.vue` 提取 `MenuFormData`（组件版）、`Props`、`Emits` 接口

**5.2 重命名目录 `modules/` → `components/`**

**5.3 重命名组件文件**

- `modules/menu-dialog.vue` → `components/MenuDialog.vue`

**5.4 更新所有 import 路径和类型引用**

### 步骤 6：src/views/index 布局页面重构

**6.1 将 `style.scss` 内联到 `index.vue`**

- 将 `src/views/index/style.scss` 内容合并到 `index.vue` 的 `<style lang="scss" scoped>` 中
- 删除 `style.scss` 文件
- 删除 `@use './style'` 语句

### 步骤 7：验证 & 清理

- 执行 `pnpm lint` 检查代码规范
- 执行 `pnpm lint:stylelint` 检查样式规范
- 执行 `pnpm lint:prettier` 检查格式
- 确认所有页面功能正常
- 检查深色模式适配（硬编码颜色值）

---

## 假设与决策

1. **Props/Emits 接口外移**：按规范，所有 `interface` 必须从 `.vue` 文件中移出。对于 `defineProps<Props>()` 中的 `Props` 接口，同样外移到 `types.ts`，通过 `import type` 引入。

2. **类型别名去重**：`type UserListItem = Api.SystemManage.UserListItem` 这类纯别名在 `types.ts` 中保留，因为它让页面代码更简洁。但如果只是简单重导出，也可以直接在使用处 `import type` 原始类型。选择保留别名以保持代码可读性。

3. **共享子组件类型**：多个子组件（如 `UserSearch`、`UserDialog`）的 Props/Emits 接口统一放在页面级别的 `types.ts` 中，而不是每个子组件单独建 `types.ts`。如果后续子组件变多，可以考虑在 `components/` 下再建 `types.ts`。

4. **`Account` 接口去掉 `export`**：原代码中 `export interface Account` 是页面私有类型，不应 export，移到 `types.ts` 后自然不需要 export。

5. **样式内联方式**：将外部 `.scss` 文件内容直接粘贴到 `<style scoped lang="scss">` 中，并使用 SCSS 嵌套优化结构。

6. **`@keyframes` 处理**：`slideInRight` 动画关键帧在 scoped 样式中仍然有效，直接内联即可。

7. **目录/文件重命名**：采用 Git 可追踪的方式（先删除旧文件，再创建新文件），确保 import 路径全部更新。

---

## 文件变更汇总

### 新建文件

| 文件路径 | 说明 |
| --- | --- |
| `src/views/auth/login/types.ts` | 登录页类型定义 |
| `src/views/system/user/types.ts` | 用户管理页类型定义 |
| `src/views/system/role/types.ts` | 角色管理页类型定义 |
| `src/views/system/menu/types.ts` | 菜单管理页类型定义 |
| `src/views/dashboard/console/components/AboutProject.vue` | 替代旧 modules/about-project.vue |
| `src/views/dashboard/console/components/BannerShowcase.vue` | 替代旧 modules/banner-showcase.vue |
| `src/views/system/user/components/UserSearch.vue` | 替代旧 modules/user-search.vue |
| `src/views/system/user/components/UserDialog.vue` | 替代旧 modules/user-dialog.vue |
| `src/views/system/role/components/RoleSearch.vue` | 替代旧 modules/role-search.vue |
| `src/views/system/role/components/RoleEditDialog.vue` | 替代旧 modules/role-edit-dialog.vue |
| `src/views/system/role/components/RolePermissionDialog.vue` | 替代旧 modules/role-permission-dialog.vue |
| `src/views/system/menu/components/MenuDialog.vue` | 替代旧 modules/menu-dialog.vue |

### 修改文件

| 文件路径 | 变更内容 |
| --- | --- |
| `src/views/auth/login/index.vue` | 内联 style.scss 样式、移除类型声明改用 import type、移除 @import |
| `src/views/index/index.vue` | 内联 style.scss 样式、移除 @use |
| `src/views/dashboard/console/index.vue` | 更新 import 路径 |
| `src/views/system/user/index.vue` | 移除类型声明、更新 import 路径 |
| `src/views/system/role/index.vue` | 移除类型声明、更新 import 路径 |
| `src/views/system/menu/index.vue` | 移除类型声明、更新 import 路径 |

### 删除文件

| 文件路径                                          | 原因                 |
| ------------------------------------------------- | -------------------- |
| `src/views/auth/login/style.scss`                 | 样式内联到 index.vue |
| `src/views/index/style.scss`                      | 样式内联到 index.vue |
| `src/views/dashboard/console/modules/` (整个目录) | 重命名为 components/ |
| `src/views/system/user/modules/` (整个目录)       | 重命名为 components/ |
| `src/views/system/role/modules/` (整个目录)       | 重命名为 components/ |
| `src/views/system/menu/modules/` (整个目录)       | 重命名为 components/ |

---

## 验证步骤

1. `pnpm lint` — ESLint 检查通过
2. `pnpm lint:stylelint` — Stylelint 检查通过
3. `pnpm lint:prettier` — Prettier 格式检查通过
4. 手动验证各页面功能正常（登录、工作台、用户管理、角色管理、菜单管理、个人中心、异常页、Iframe 页）
5. 检查深色模式下各页面显示正常
