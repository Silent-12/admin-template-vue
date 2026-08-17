# 规则加载

- 在新增或修改代码前，需要先检查当前目录下是否存在 `.agents` 目录。
- 如果存在，则必须读取并加载其中定义的 `rules` 与 `skills`。
- 当本次任务命中了对应规则、约束或技能范围时，后续代码实现与输出内容必须严格遵循相关规范执行。
- 若本文档规则与当前仓库实际目录结构或实现现状不一致，应以仓库现状为准，并先同步更新本文档后再继续执行。

# 项目规则

- 当前项目技术栈：`Vue 3 + Vite + TypeScript + Pinia + Vue Router + Element Plus + Axios + SCSS + vue-i18n`，包管理器使用 `pnpm`，Node 版本要求 `>=20.19.0`。

- 本项目为纯前端后台管理模板 `art-design-pro`，无后端、无数据库、无 Redis/MQ；所有数据通过 `src/api/` 调用后端接口，对接的响应结构由前端统一定义为 `BaseResponse<T>`（`code`、`msg`、`data`）。

- 修改/新增代码前，先搜索项目已有相关方法或组件，优先复用；无则新增。

- 用户开发环境是 Windows 系统，调试命令必须适配 Windows（PowerShell）。

- 所有新增、修改、重构的公共函数、业务函数、事件处理函数、数据加载函数及其他具有明确业务语义的方法，必须配套编写 / 更新标准 JSDoc 注释，使用 `/** */` 格式，优先包含 `@description`、`@param`、`@return` 标签并简要标注类型与业务说明；无参数或无返回值的场景可省略对应标签，代码变更同步更新注释，保持格式统一。Vue `<script setup>` 中的函数同样适用。
- 在 Vue `<script setup>` 中，`ref`、`reactive` 等响应式状态声明应按语义添加分组或用途注释（如“组件引用”“状态数据”“表单数据”“分页参数”等）；对外暴露方法、事件处理函数、数据加载函数及其他具有明确业务语义的箭头函数，必须补充标准 JSDoc 注释，并优先参考同目录已有文件的注释写法保持一致。

- 在函数入口或逻辑开始阶段，对非法状态 / 异常输入 / 不满足条件进行判断，并立即返回或抛错，禁止通过 `if/else` 嵌套处理主流程。

- 所有 HTTP 请求必须通过 `src/utils/http/index.ts` 封装的默认 `request` 实例发起，统一经过请求 / 响应拦截器；禁止在业务代码中直接 `import axios from 'axios'` 自建实例。API 方法定义统一放置在 `src/api/` 下，按业务模块分文件，方法名以 `fetch` / `get` / `update` / `create` / `delete` 等动词开头。

- 后端响应数据结构在前端统一以 `BaseResponse<T>` 描述（定义于 `src/types/common/response.ts`，字段为 `code`、`msg`、`data`）；新增 API 方法的返回类型必须显式声明泛型 `T`，禁止使用 `any`。

- 所有的 TS 类型定义统一放在 `src/types/` 下，按域分目录：`api/`、`common/`、`component/`、`config/`、`directive/`、`router/`、`store/`、`generated/`。接口类型应按业务域放在对应目录中（如 `src/types/api/auth.d.ts`、`src/types/api/systemManage.d.ts`）；通用响应结构定义在 `src/types/common/response.ts`。

- TypeScript 类型定义文件（`.ts` / `.d.ts`）的注释规则：`type`、`interface`、`class` 等类型声明前仅保留一段 JSDoc，第一行写简短说明，使用 `@description` 补充用途；字段注释统一使用字段上方的单行 `//` 注释，不在类型 JSDoc 中使用 `@param` 描述字段。类型声明前禁止额外添加与 JSDoc 重复的 `//` 标题注释。类方法和构造函数仍按函数注释规则使用 `@description`、`@param`、`@return`。
- `src/types/` 下多单词类型文件命名统一使用小驼峰命名，例如 `systemManage.d.ts`、`versionControl.d.ts`，禁止使用中划线命名。

- 样式统一使用 SCSS，统一放在 `src/assets/styles/` 下管理；当前核心样式文件包括 `theme.scss`、`dark.scss`、`mixin.scss`、`reset.scss`、`el-ui.scss`、`el-light.scss` 等，入口为 `src/assets/styles/index.scss`；禁止引入 Tailwind 等原子化 CSS 框架，禁止使用内联 `style=""` 写大段样式（动态样式除外）。
- Vue 组件使用 `<style scoped>` 时，class 命名应尽量收敛：每个组件通常只声明一个顶层模块 class 作为样式作用域入口，内部子节点优先使用简短且语义明确的命名，避免重复携带模块前缀或大段 BEM 命名。
- `<style scoped>` 场景下，布局类名优先使用 `left`、`right`、`top`、`bottom`、`header`、`body`、`footer`、`content`、`main`、`aside`、`actions`、`item` 等简短命名；信息展示类名优先使用 `info`、`title`、`description`、`label`、`value`、`text`、`icon`、`tip` 等简短命名。
- 仅当存在跨组件复用、全局覆盖、Element Plus 深度覆盖、多层状态表达或样式作用域不适合依赖 `scoped` 时，才使用更完整的 BEM 命名；禁止在已具备清晰顶层作用域的 `<style scoped>` 组件内继续机械重复 `project-card__title` 这一类冗余前缀。

- 后续项目开发中，凡是需要使用弹窗组件的地方，**禁止直接使用原生的 `<el-dialog>`**，必须统一使用项目中已封装的基础组件 `<AoDialog>`（它默认继承了水平垂直居中及可拖拽特性，且已通过自动导入配置注册，可直接在模板中使用）。

## SCSS 样式整理规范

- 对于新增或重构的 Vue `<style scoped>` 组件，优先整理为“一个顶层 class + 内部短语义 class”的结构，再在该作用域内使用 SCSS 嵌套；只有确实需要更强语义隔离或跨组件复用时才保留 BEM。
- 同一 BEM 前缀的选择器必须优先使用 SCSS 嵌套，避免重复书写完整类名。例如：
  ```scss
  .breadcrumb {
    &__list {
    }
    &__item {
    }
    &__link {
      &:hover {
      }
    }
  }
  ```
- BEM 修饰符使用 `&--*`，BEM 子元素使用 `&__*`，连字符命名的子块使用 `&-*`；伪类、伪元素、状态类、直接子元素和媒体查询应归属对应父选择器。
- 只有在编译后的 CSS 选择器与原选择器完全一致时才能进行嵌套。禁止因嵌套新增后代层级或改变特异性；全局选择器、Element Plus 覆盖、动画、主题样式和跨组件覆盖必须保留原有作用域。必要时使用显式选择器（如 `& &__header`）保持原 CSS 语义。
- 不重命名现有 class，不改变声明数值、动画、层级和响应式断点；纯样式整理不得修改模板、脚本逻辑、接口、类型或公共 API。
- 同一个声明区块内部不插入无意义的空行。不同语义的选择器、注释、媒体查询和 `@keyframes` 区块之间可保留空行，以保持结构可读性。
- 涉及样式重构时，应扫描全部 `.vue` 和 `.scss` 文件，确认 BEM 选择器已归并、声明区块内部没有多余空行，并通过 Sass 编译或构建核对生成的 CSS 选择器。
- 样式中的颜色必须优先引用现有 CSS 变量；无法映射时，在 `theme.scss` 的 `:root` 和 `.dark` 中新增成对语义变量后再引用。脚本配置、组件 props 默认值和主题变量定义中的颜色值不按样式声明处理，但不得将脚本配置颜色误改为 CSS 变量。
- 样式整理完成后必须执行 `pnpm run lint`、`pnpm run lint:stylelint`、`pnpm run lint:prettier` 和 `pnpm run build`；涉及选择器归并时还应执行 `git diff --check` 并检查最终 diff 只包含预期的样式结构、格式和 CSS 变量调整。

### 样式整理语义变量

| 变量 | 用途 |
| --- | --- |
| `--ao-white` / `--ao-black` | 白色、黑色及其透明混合的基础色 |
| `--ao-shadow-05` / `--ao-shadow-08` / `--ao-shadow-10` / `--ao-shadow-12` / `--ao-shadow-15` / `--ao-shadow-20` | 阴影透明度 |
| `--ao-badge-dot` / `--ao-badge-text-bg` | 徽章圆点和文字徽章背景 |
| `--ao-menu-dark-bg` / `--ao-menu-dark-hover-bg` / `--ao-popup-menu-dark-active-bg` | 暗色菜单状态背景 |
| `--ao-login-yellow-start` / `--ao-login-yellow-end` / `--ao-login-blue-shadow` | 登录页装饰色和阴影 |
| `--ao-login-dark-shadow` / `--ao-login-light-shadow` / `--ao-login-banner-dark` | 登录页暗色主题及横幅辅助色 |

- 组件目录分层规则：
  - 通用基础组件放在 `src/components/` 下，按类别（`base/`、`banners/`、`forms/`、`layouts/`、`media/`、`others/`、`tables/` 等）分子目录。
  - 无子组件或私有资源的通用组件直接使用大驼峰文件名（如 `src/components/layouts/AoFastEnter.vue`）；包含子组件或私有资源的组件保留大驼峰目录和 `index.vue` 入口，组件私有样式同名 `style.scss`，主题样式同名 `theme.scss`。
  - 仅服务单一业务的组件放在对应页面的 `src/views/<业务模块>/components/` 下，并由业务页面显式引入，不作为通用组件注册。
  - 业务页面放在 `src/views/` 下，按业务模块分子目录（如 `system/user/`、`system/role/`、`system/menu/`）；页面内的弹窗、搜索条等子模块放在对应模块的 `components/` 子目录中。

- 状态管理使用 Pinia，模块定义在 `src/store/modules/` 下，每个 store 一个文件，命名与业务域对应（如 `user.ts`、`menu.ts`、`setting.ts`、`worktab.ts`）；持久化通过 `pinia-plugin-persistedstate`，key 命名需语义清晰。
  - Pinia Setup Store 的持久化示例：
    ```ts
    import { defineStore } from 'pinia'
    import { ref } from 'vue'

    export const usePreferenceStore = defineStore(
      'preferenceStore',
      () => {
        const theme = ref('light')
        const draft = ref('')

        return { theme, draft }
      },
      {
        persist: {
          key: 'preference',
          storage: localStorage,
          pick: ['theme']
        }
      }
    )
    ```
  - `persist` 是 `defineStore` 的配置项：Setup Store 放在第三个参数，Options Store 放在第二个参数。插件已在 `src/store/index.ts` 注册；Store 状态变化后会自动持久化，业务代码不需要手动调用 `localStorage` 或 `$persist()`。
  - `key` 必须使用稳定且唯一的业务域名称，禁止拼接版本号；只需持久化部分字段时使用 `pick` 或 `omit`。临时会话状态使用 `sessionStorage`，需要跨浏览器刷新和重新打开页面保留的用户偏好才使用 `localStorage`。

- 本地存储（localStorage）操作规则：
  - 业务状态需要持久化时，必须通过 Pinia Store 的 `persist` 选项实现（`pinia-plugin-persistedstate`），key 使用语义清晰的业务域名称；禁止通过版本号拼接持久化 key 或自动迁移旧版本数据；**禁止在业务代码中直接调用 `localStorage.getItem/setItem/removeItem`**。
  - 仅在极少数需要在 Vue 应用加载前生效的场景（如主题键 `StorageConfig.THEME_KEY` 对应 `sys-theme`、上次登录用户 ID `StorageConfig.LAST_USER_ID_KEY` 对应 `sys-last-user-id`）才允许直接操作 localStorage，且键名必须引用 `StorageConfig` 常量（定义于 `src/utils/storage/storageConfig.ts`），禁止硬编码字符串键名。

- 路由相关：
  - 公共路由定义在 `src/router/routes/public.ts`，业务路由定义在 `src/router/routes/applications/` 下。
  - 路由核心能力（组件加载、菜单处理、配置校验、路由注册等）在 `src/router/services/` 下，扩展时优先复用既有 `RouteRegistry`、`RouteComponentLoader`、`RouteConfigValidator`、`RouteTransformer`、`MenuRouteService` 等能力。
  - 路由守卫在 `src/router/guards/`，禁止在业务页面内手写路由拦截。

- 国际化：所有用户可见文案应使用 `vue-i18n` 的 `$t` / `t` 函数，语言包位于 `src/locales/langs/`（`zh.json`、`en.json`）；禁止在模板或代码中硬编码中文展示文案（注释、日志除外）。

- 自定义指令统一放在 `src/directives/` 根目录（`auth`、`highlight`、`ripple`），通过 `src/directives/index.ts` 统一注册。

- 复用逻辑优先抽成 Composable，放置在 `src/hooks/core/` 下，命名以 `use` 开头（如 `useTable`、`useAuth`、`useTheme`）；不要在组件内重复实现已存在的 hook 能力。

- 修改/新增代码时，不要无故删除仍然有效的注释内容；若原注释已失效、与实现不一致或会产生误导，必须同步更新或删除。

- 提交 git 时，需要遵守 `.agents/rules/git-commit-message.md` 生成 commit 说明规范。

- 项目还未上线，可以直接新增/修改/重构，保持最佳架构实现。

- 对于无用的字段、变量、引入、组件应立即删除，无需做兼容。

- 表单必填字段除了在视图层做必填校验（`rules`），还应在提交前于业务层显式判空；对关键业务操作（删除、批量操作等）必须二次确认。

- 涉及源码改动的任务完成后，都需要执行 `package.json` 中与改动范围对应的检查；默认至少执行 `pnpm run lint`。涉及样式改动时一并执行 `pnpm run lint:stylelint`，存在格式化差异时执行 `pnpm run lint:prettier`；涉及构建链路、路由装配、类型声明或样式变量调整时，应补充执行 `pnpm run build`。

- 后续凡是在 `.env` / `.env.development` / `.env.production` 中新增环境变量，必须以 `VITE_` 前缀开头，并同步更新到其余两个环境文件保持字段对齐；新增的环境变量在代码中使用前需在 `src/env.d.ts` 或 `src/types/` 中补充类型声明。

# 深色模式与 CSS 变量

## 实现原理

系统通过切换 `<html>` 元素的 `class="dark"` 实现主题切换。CSS 变量在 `:root`（亮色）和 `.dark`（暗色）选择器下分别定义不同值，class 切换时自动生效。

**核心要求：凡涉及颜色的样式（背景色、文字色、边框色、阴影色等），必须使用 CSS 变量，禁止硬编码色值（如 `#fff`、`#000`、`rgba(0,0,0,0.1)` 等）。**

## 项目 CSS 变量速查表

### 语义色变量（`src/assets/styles/theme.scss`）

| 变量名           | 亮色值 (`:root`)         | 暗色值 (`.dark`) | 典型用途 |
| ---------------- | ------------------------ | ---------------- | -------- |
| `--ao-primary`   | `oklch(0.7 0.23 260)`    | 继承亮色         | 主色调   |
| `--ao-secondary` | `oklch(0.72 0.19 231.6)` | 继承亮色         | 次要色   |
| `--ao-error`     | `oklch(0.73 0.15 25.3)`  | 继承亮色         | 错误色   |
| `--ao-info`      | `oklch(0.58 0.03 254.1)` | 继承亮色         | 信息色   |
| `--ao-success`   | `oklch(0.78 0.17 166.1)` | 继承亮色         | 成功色   |
| `--ao-warning`   | `oklch(0.78 0.14 75.5)`  | 继承亮色         | 警告色   |
| `--ao-danger`    | `oklch(0.68 0.22 25.3)`  | 继承亮色         | 危险色   |

### 灰度色阶变量（亮暗反转）

| 变量名          | 亮色值    | 暗色值    | 典型用途        |
| --------------- | --------- | --------- | --------------- |
| `--ao-gray-100` | `#f9fafb` | `#110f0f` | 最浅背景/填充   |
| `--ao-gray-200` | `#f2f4f5` | `#17171c` | 浅背景/分隔     |
| `--ao-gray-300` | `#e6eaeb` | `#393946` | 边框/分割线背景 |
| `--ao-gray-400` | `#dbdfe1` | `#505062` | 中等边框        |
| `--ao-gray-500` | `#949eb7` | `#73738c` | 占位文字/禁用态 |
| `--ao-gray-600` | `#7987a1` | `#8f8fa3` | 辅助文字颜色    |
| `--ao-gray-700` | `#4d5875` | `#ababba` | 次要文字颜色    |
| `--ao-gray-800` | `#383853` | `#c7c7d1` | 主要文字颜色    |
| `--ao-gray-900` | `#323251` | `#e3e3e8` | 最深文字/标题色 |

### 背景与容器变量

| 变量名                | 亮色值    | 暗色值    | 典型用途             |
| --------------------- | --------- | --------- | -------------------- |
| `--ao-color`          | `#ffffff` | `#000000` | 基础色（组件内底色） |
| `--default-bg-color`  | `#fafbfc` | `#070707` | 页面全局背景         |
| `--default-box-color` | `#ffffff` | `#161618` | 卡片/弹窗/容器背景   |

### 边框变量

| 变量名                    | 亮色值             | 暗色值                   | 典型用途      |
| ------------------------- | ------------------ | ------------------------ | ------------- |
| `--default-border`        | `#e2e8ee`          | `rgba(255,255,255,0.1)`  | 实线默认边框  |
| `--default-border-dashed` | `#dbdfe9`          | `#363843`                | 虚线/分隔边框 |
| `--ao-card-border`        | `rgba(0,0,0,0.08)` | `rgba(255,255,255,0.08)` | 卡片边框      |

### 交互状态变量

| 变量名                 | 亮色值    | 暗色值    | 典型用途            |
| ---------------------- | --------- | --------- | ------------------- |
| `--ao-hover-color`     | `#edeff0` | `#252530` | 鼠标悬停背景        |
| `--ao-active-color`    | `#f2f4f5` | `#202226` | 点击激活背景        |
| `--ao-el-active-color` | `#f2f4f5` | `#2e2e38` | Element组件选中背景 |

### Element Plus 桥接变量（`src/assets/styles/el-ui.scss`）

| 变量名                         | 说明                                          |
| ------------------------------ | --------------------------------------------- |
| `--main-color`                 | 指向 `var(--el-color-primary)`，主题色别名    |
| `--theme-color`                | 指向 `var(--main-color)`                      |
| `--el-component-custom-height` | 组件统一高度（固定 `36px`）                   |
| `--el-component-size`          | Element Plus 组件尺寸（跟随上面）             |
| `--custom-radius`              | 全局圆角基数（固定 `0.75rem`）                |
| `--el-border-radius-base`      | Element 基础圆角（由 `--custom-radius` 计算） |
| `--el-border-radius-small`     | Element 小圆角（由 `--custom-radius` 计算）   |

### Element Plus 暗色覆盖（`src/assets/styles/dark.scss`，仅 `html.dark` 下生效）

| 变量名                    | 暗色值                     |
| ------------------------- | -------------------------- |
| `--el-bg-color`           | `var(--default-box-color)` |
| `--el-text-color-regular` | `rgba(255,255,255,0.85)`   |

### 富文本编辑器变量（仅 `html.dark` 下生效）

| 变量名                            | 暗色值                         |
| --------------------------------- | ------------------------------ |
| `--w-e-toolbar-bg-color`          | `#18191c`                      |
| `--w-e-toolbar-color`             | `var(--ao-gray-600)`           |
| `--w-e-toolbar-active-bg-color`   | `#25262b`                      |
| `--w-e-toolbar-active-color`      | `var(--ao-gray-800)`           |
| `--w-e-toolbar-border-color`      | `var(--default-border-dashed)` |
| `--w-e-textarea-bg-color`         | `#090909`                      |
| `--w-e-textarea-border-color`     | `var(--default-border-dashed)` |
| `--w-e-textarea-slight-bg-color`  | `#090909`                      |
| `--w-e-modal-button-bg-color`     | `#090909`                      |
| `--w-e-modal-button-border-color` | `var(--default-border-dashed)` |

### 预定义工具类（可直接复用，无需自定义颜色）

| 工具类               | 效果                                                  |
| -------------------- | ----------------------------------------------------- |
| `.border-full-d`     | `border: 1px solid var(--default-border)`             |
| `.border-b-d`        | `border-bottom: 1px solid var(--default-border)`      |
| `.border-t-d`        | `border-top: 1px solid var(--default-border)`         |
| `.border-l-d`        | `border-left: 1px solid var(--default-border)`        |
| `.border-r-d`        | `border-right: 1px solid var(--default-border)`       |
| `.rounded-custom-xs` | `border-radius: calc(var(--custom-radius) / 2)`       |
| `.rounded-custom-sm` | `border-radius: calc(var(--custom-radius) / 2 + 2px)` |

## 深色模式适配强制检查规则

**在新增或修改任何 `.vue` / `.scss` 文件时，必须执行以下检查：**

1. **扫描硬编码颜色值**：检查 `<style>` / `<style scoped>` 块中是否存在裸色值（如 `#fff`、`#ffffff`、`#000`、`#000000`、`#cccccc`、`rgba(0,0,0,...)`、`rgba(255,255,255,...)` 等）。

2. **排除合法场景**：
   - 上述"CSS 变量速查表"中已定义的变量定义代码本身（即 `theme.scss`、`dark.scss` 中的 `:root` / `.dark` 块）可豁免。
   - 纯透明 `transparent`、`rgba(0,0,0,0)` 等完全无视觉影响的颜色可豁免。
   - `box-shadow` 中确实需要固定不随主题变化的阴影（极少场景）可豁免，但需在注释中说明原因。

3. **提醒与替换要求**：一旦检测到不符合条件的硬编码颜色，必须：
   - 明确列出每个硬编码色值所在文件与行号。
   - 给出推荐替换的 CSS 变量名（对照上方速查表）。
   - 如现有变量无法覆盖，应在 `theme.scss` 的 `:root` 和 `.dark` 中同时新增变量，再引用。
   - **示例输出格式**：
     ```
     ⚠ 深色模式适配警告：以下位置存在硬编码颜色值，暗色模式下可能出现显示异常：

     1. `src/views/xxx/index.vue` 第 45 行 — `color: #333` → 建议替换为 `var(--ao-gray-900)`
     2. `src/views/xxx/index.vue` 第 52 行 — `background: #f5f5f5` → 建议替换为 `var(--ao-gray-200)`
     3. `src/views/xxx/style.scss` 第 10 行 — `border: 1px solid #ddd` → 建议替换为 `.border-full-d` 或 `var(--default-border)`
     ```

4. **不需要等待用户确认**：检测到问题后直接给出警告和替换建议，继续执行后续任务。

# 编码规则

- 所有新增和修改的源码文件必须使用 UTF-8 无 BOM 编码。
- 不允许使用 GBK、ANSI 编码保存文件。
- 修改已有文件前，如果发现文件不是 UTF-8，应先提示并转换为 UTF-8。
- 中文注释必须保持 UTF-8，不得产生乱码。

- 涉及文本截断、溢出隐藏、多行省略等文本溢出场景时，必须优先使用 `src/assets/styles/mixin.scss` 中定义的 `@include ellipsis` 混入，禁止手动编写 `overflow: hidden; text-overflow: ellipsis; white-space: nowrap;` 等重复代码。单行省略调用 `@include ellipsis`，多行省略调用 `@include ellipsis($rowCount)`（如 `@include ellipsis(3)`）。
