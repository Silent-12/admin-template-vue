# 规则加载

- 在新增或修改代码前，需要先检查当前目录下是否存在 `.agents` 目录。
- 如果存在，则必须读取并加载其中定义的 `rules` 与 `skills`。
- 当本次任务命中了对应规则、约束或技能范围时，后续代码实现与输出内容必须严格遵循相关规范执行。

# 项目规则

- 当前项目技术栈：`Vue 3 + Vite + TypeScript + Pinia + Vue Router + Element Plus + ECharts + Axios + SCSS + vue-i18n`，包管理器使用 `pnpm`，Node 版本要求 `>=20.19.0`。

- 本项目为纯前端后台管理模板 `art-design-pro`，无后端、无数据库、无 Redis/MQ；所有数据通过 `src/api/` 调用后端接口，对接的响应结构由前端统一定义为 `BaseResponse<T>`（`code`、`msg`、`data`）。

- 修改/新增代码前，先搜索项目已有相关方法或组件，优先复用；无则新增。

- 用户开发环境是 Windows 系统，调试命令必须适配 Windows（PowerShell）。

- 所有新增、修改、重构函数 / 方法时，必须配套编写 / 更新标准 JSDoc 注释，使用 `/** */` 格式，包含 `@description`、`@param`、`@return` 完整标签，简要标注类型与业务说明，代码变更同步更新注释，保持格式统一。Vue `<script setup>` 中的函数同样适用。

- 在函数入口或逻辑开始阶段，对非法状态 / 异常输入 / 不满足条件进行判断，并立即返回或抛错，禁止通过 `if/else` 嵌套处理主流程。

- 所有 HTTP 请求必须通过 `src/utils/http/index.ts` 封装的默认 `request` 实例发起，统一经过请求 / 响应拦截器；禁止在业务代码中直接 `import axios from 'axios'` 自建实例。API 方法定义统一放置在 `src/api/` 下，按业务模块分文件，方法名以 `fetch` / `get` / `update` / `create` / `delete` 等动词开头。

- 后端响应数据结构在前端统一以 `BaseResponse<T>` 描述（定义于 `src/types/common/response.ts`，字段为 `code`、`msg`、`data`）；新增 API 方法的返回类型必须显式声明泛型 `T`，禁止使用 `any`。

- 所有的 TS 类型定义统一放在 `src/types/` 下，按域分目录：`api/`、`common/`、`component/`、`config/`、`directive/`、`router/`、`store/`。全局命名空间类型（如 `Api.Auth.*`）在 `src/types/api/api.d.ts` 中声明；通用业务类型在 `src/types/common/index.ts`。

- 样式统一使用 SCSS，按域组织在 `src/assets/styles/`：核心样式在 `core/`（`theme.scss`、`utilities.scss`、`reset.scss`、`el-dark.scss`、`el-light.scss` 等），入口为 `src/assets/styles/index.scss`；禁止引入 Tailwind 等原子化 CSS 框架，禁止使用内联 `style=""` 写大段样式（动态样式除外）。

- 组件目录分层规则：
  - 通用基础组件放在 `src/components/core/` 下，按类别（`base/`、`banners/`、`cards/`、`charts/`、`forms/`、`layouts/`、`tables/` 等）分子目录。
  - 每个组件必须独立成目录，入口文件统一为 `index.vue`，组件私有样式同名 `style.scss`，主题样式同名 `theme.scss`。
  - 业务页面放在 `src/views/` 下，按业务模块分子目录（如 `system/user/`、`system/role/`、`system/menu/`）；页面内的弹窗、搜索条等子模块放在对应模块的 `modules/` 子目录中。

- 状态管理使用 Pinia，模块定义在 `src/store/modules/` 下，每个 store 一个文件，命名与业务域对应（如 `user.ts`、`menu.ts`、`setting.ts`、`worktab.ts`）；持久化通过 `pinia-plugin-persistedstate`，key 命名需语义清晰。

- 本地存储（localStorage）操作规则：
  - 业务状态需要持久化时，必须通过 Pinia Store 的 `persist` 选项实现（`pinia-plugin-persistedstate`），由 `StorageKeyManager` 自动生成版本化键名 `sys-v{version}-{storeId}`，并自动处理跨版本数据迁移；**禁止在业务代码中直接调用 `localStorage.getItem/setItem/removeItem`**。
  - 仅在极少数需要在 Vue 应用加载前生效的场景（如主题键 `StorageConfig.THEME_KEY` 对应 `sys-theme`、上次登录用户 ID `StorageConfig.LAST_USER_ID_KEY` 对应 `sys-last-user-id`）才允许直接操作 localStorage，且键名必须引用 `StorageConfig` 常量（定义于 `src/utils/storage/storage-config.ts`），禁止硬编码字符串键名。

- 路由相关：
  - 静态路由在 `src/router/routes/staticRoutes.ts`，动态（异步）路由在 `src/router/routes/asyncRoutes.ts`。
  - 路由模块定义在 `src/router/modules/` 下；路由核心能力（组件加载、菜单处理、权限校验、路由注册）在 `src/router/core/` 下，扩展时优先复用既有 `RouteRegistry`、`RoutePermissionValidator`、`MenuProcessor` 等能力。
  - 路由守卫在 `src/router/guards/`，禁止在业务页面内手写路由拦截。

- 国际化：所有用户可见文案应使用 `vue-i18n` 的 `$t` / `t` 函数，语言包位于 `src/locales/langs/`（`zh.json`、`en.json`）；禁止在模板或代码中硬编码中文展示文案（注释、日志除外）。

- 自定义指令统一在 `src/directives/` 下按 `core/`（`auth`、`roles`）与 `business/`（`highlight`、`ripple`）分类，通过 `src/directives/index.ts` 统一注册。

- 复用逻辑优先抽成 Composable，放置在 `src/hooks/core/` 下，命名以 `use` 开头（如 `useTable`、`useAuth`、`useTheme`）；不要在组件内重复实现已存在的 hook 能力。

- 修改/新增代码时，不要删除原有的注释内容。

- 提交 git 时，需要遵守 `.agents/rules/git-commit-message.md` 生成 commit 说明规范。

- 项目还未上线，可以直接新增/修改/重构，保持最佳架构实现。

- 对于无用的字段、变量、引入、组件应立即删除，无需做兼容。

- 表单必填字段除了在视图层做必填校验（`rules`），还应在提交前于业务层显式判空；对关键业务操作（删除、批量操作等）必须二次确认。

- 每次执行完任务后，都需要执行 `package.json` 中的 `lint` 检查，如果存在报错，需要修复；涉及样式改动时一并执行 `lint:stylelint`，格式问题统一执行 `lint:prettier`。

- 后续凡是在 `.env` / `.env.development` / `.env.production` 中新增环境变量，必须以 `VITE_` 前缀开头，并同步更新到其余两个环境文件保持字段对齐；新增的环境变量在代码中使用前需在 `src/types/` 或 `vite-env.d.ts` 中补充类型声明。

# 编码规则

- 所有新增和修改的源码文件必须使用 UTF-8 无 BOM 编码。
- 不允许使用 GBK、ANSI 编码保存文件。
- 修改已有文件前，如果发现文件不是 UTF-8，应先提示并转换为 UTF-8。
- 中文注释必须保持 UTF-8，不得产生乱码。
