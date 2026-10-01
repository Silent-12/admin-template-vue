# 目录、路由与组件

[返回主索引](../../AGENTS.md)。本文中的源码路径均相对仓库根目录。

- 组件目录分层规则：
  - 通用基础组件放在 `src/components/` 下，按类别（`base/`、`banners/`、`forms/`、`layouts/`、`media/`、`others/`、`tables/` 等）分子目录。
  - 无子组件或私有资源的通用组件直接使用大驼峰文件名（如 `src/components/layouts/AoFastEnter.vue`）；包含子组件或私有资源的组件保留大驼峰目录和 `index.vue` 入口，组件私有样式同名 `style.scss`，主题样式同名 `theme.scss`。
  - 仅服务单一业务的组件放在对应页面的 `src/views/<业务模块>/components/` 下，并由业务页面显式引入，不作为通用组件注册。
  - 业务页面放在 `src/views/` 下，按业务模块分子目录（如 `system/user/`、`system/role/`、`system/menu/`）；页面内的弹窗、抽屉等子模块放在对应模块的 `components/` 子目录中。

- 路由相关：
  - 公共路由定义在 `src/router/routes/public.ts`；本地业务系统路由定义在 `src/router/routes/applications/` 下。
  - 路由核心能力放在 `src/router/services/` 下，扩展时优先复用既有 `RouteRegistry`、`MenuRouteService`、`RouteTransformer`、`RouteComponentLoader`、`RouteConfigValidator` 等能力。
  - 路由守卫在 `src/router/guards/`，禁止在业务页面内手写路由拦截。

- 自定义指令统一放在 `src/directives/` 根目录（`auth`、`highlight`、`ripple`），通过 `src/directives/index.ts` 统一注册。

- 复用逻辑优先抽成 Composable，放置在 `src/hooks/core/` 下，命名以 `use` 开头（如 `useTable`、`useAuth`、`useTheme`）；不要在组件内重复实现已存在的 hook 能力。

## 业务表格与搜索

- 所有业务表格统一使用项目封装的 `AoTable`，页面布局参考 `src/views/system/user/index.vue`：页面容器使用 `ao-full-height`，`ao-table-card` 表格卡片与表格头部由 `AoTable` 内部按需渲染，业务页面只需传入 `:search-items` / `:search-rules` / `v-model:search-form` / `v-model:column-checks` 并编写 `#header-left` / `#header-right` 插槽；搜索栏需支持显隐切换时额外绑定 `v-model:show-search-bar`；禁止在业务页面直接使用 `el-table`。

- 所有业务搜索区域统一使用项目封装的 `AoSearchBar`，它已由 `AoTable` 通过 `search-items` 集成，业务页面无需再单独引入；搜索项配置以 `searchItems` 内联在对应业务页面中，不再为每个页面创建 `components/XxxSearch.vue` 包装组件；弹窗、抽屉等卡片附加内容放入 `AoTable` 的 `#footer` 插槽。

## 表单与关键操作

- 表单必填字段除了在视图层做必填校验（`rules`），还应在提交前于业务层显式判空；对关键业务操作（删除、批量操作等）必须二次确认。
