# 公共组件清单

> 本文档列出 `src/components/core/` 下所有公共组件及其作用。
>
> 最后更新：2026-07-25（移除图表/卡片/节日滚动等组件后）

## 目录结构总览

| 子目录         | 数量   | 说明                      |
| -------------- | ------ | ------------------------- |
| `banners/`     | 2      | 横幅类                    |
| `base/`        | 3      | 基础类                    |
| `layouts/`     | 13     | 布局类（含 3 个菜单组件） |
| `forms/`       | 6      | 表单类                    |
| `media/`       | 2      | 媒体类                    |
| `others/`      | 2      | 其他类                    |
| `tables/`      | 2      | 表格类                    |
| `text-effect/` | 1      | 文本效果类                |
| `theme/`       | 1      | 主题类                    |
| `views/`       | 3      | 视图片段类                |
| `widget/`      | 1      | 小部件类                  |
| **合计**       | **36** |                           |

> 所有组件遵循「独立目录 + `index.vue`」入口约定，组件名通过 `defineOptions({ name: 'AoXxx' })` 声明（除少数遗留组件）。

---

## 1. `banners/` 横幅类

| 组件 | 路径 | 作用 | 主要 props |
| --- | --- | --- | --- |
| AoBasicBanner | [ao-basic-banner/index.vue](src/components/core/banners/ao-basic-banner/index.vue) | 基础横幅，支持标题/副标题/按钮插槽、背景图、装饰、暗黑模式流星动画 | `title`、`subtitle`、`height`、`decoration`、`boxStyle`、`meteorConfig`、`imageConfig`、`buttonConfig`；事件 `click`、`buttonClick` |
| AoCardBanner | [ao-card-banner/index.vue](src/components/core/banners/ao-card-banner/index.vue) | 卡片式横幅，左图 + 标题/描述 + 右侧主/取消按钮 | `height`、`image`、`title`、`description`、`button`、`cancelButton`；事件 `buttonClick`、`cancel` |

---

## 2. `base/` 基础类

| 组件 | 路径 | 作用 | 主要 props |
| --- | --- | --- | --- |
| AoBackToTop | [ao-back-to-top/index.vue](src/components/core/base/ao-back-to-top/index.vue) | 返回顶部按钮，监听 `#app-main` 滚动，超过 300px 显示 | 无 |
| AoLogo | [ao-logo/index.vue](src/components/core/base/ao-logo/index.vue) | 系统 Logo 展示，渲染 `@imgs/common/logo.webp` | `size?: number \| string`（默认 36） |
| AoSvgIcon | [ao-svg-icon/index.vue](src/components/core/base/ao-svg-icon/index.vue) | 基于 `@iconify/vue` 的图标组件，透传 class/style | `icon?: string`（Iconify 图标名） |

---

## 3. `layouts/` 布局类（13 个，含 3 个菜单组件）

| 组件 | 路径 | 作用 | 主要 props |
| --- | --- | --- | --- |
| AoBreadcrumb | [ao-breadcrumb/index.vue](src/components/core/layouts/ao-breadcrumb/index.vue) | 基于 `route.matched` 的面包屑导航 | 无 |
| AoFastEnter | [ao-fast-enter/index.vue](src/components/core/layouts/ao-fast-enter/index.vue) | 顶部快速入口面板（ElPopover），展示应用列表 + 快速链接 | 默认插槽作为触发器 |
| AoFireworksEffect | [ao-fireworks-effect/index.vue](src/components/core/layouts/ao-fireworks-effect/index.vue) | 烟花/礼花 canvas 动画，支持对象池、多形状、物理参数，由 mittBus 事件触发 | 无（由 mitt 事件驱动） |
| AoGlobalComponent | [ao-global-component/index.vue](src/components/core/layouts/ao-global-component/index.vue) | 全局组件容器，根据配置动态渲染启用的全局组件 | 无 |
| AoGlobalSearch | [ao-global-search/index.vue](src/components/core/layouts/ao-global-search/index.vue) | 全局搜索弹窗（ElDialog），支持菜单搜索、历史记录、键盘选择 | v-model 控制显示 |
| AoHeaderBar | [ao-header-bar/index.vue](src/components/core/layouts/ao-header-bar/index.vue) | 顶部栏，整合 Logo、菜单按钮、刷新、快速入口、面包屑、搜索、全屏、通知、设置、用户菜单（含子组件 AoUserMenu） | 无 |
| AoNotification | [ao-notification/index.vue](src/components/core/layouts/ao-notification/index.vue) | 通知面板，三 Tab（通知/消息/待办）切换 | `show?`、`visible?` |
| AoPageContent | [ao-page-content/index.vue](src/components/core/layouts/ao-page-content/index.vue) | 主内容区容器，承载 RouterView、KeepAlive、页面切换动画、全屏过渡遮罩 | 无 |
| AoSettingsPanel | [ao-settings-panel/index.vue](src/components/core/layouts/ao-settings-panel/index.vue) | 设置抽屉，聚合主题/菜单布局/菜单风格/主题色/盒子样式/容器宽度/基础配置等子面板 | `open?`；事件 `open`、`close` |
| AoWorkTab | [ao-work-tab/index.vue](src/components/core/layouts/ao-work-tab/index.vue) | 多标签页（工作标签），支持横向滚动、固定、关闭、右键菜单、Google/Card 风格 | 无 |
| AoHorizontalMenu | [ao-menus/ao-horizontal-menu/index.vue](src/components/core/layouts/ao-menus/ao-horizontal-menu/index.vue) | 顶部水平菜单，基于 ElMenu 横向模式，递归渲染子菜单 | `list: AppRouteRecord[]` |
| AoMixedMenu | [ao-menus/ao-mixed-menu/index.vue](src/components/core/layouts/ao-menus/ao-mixed-menu/index.vue) | 混合菜单（顶部一行），支持左右滚动、滚轮横向滚动、激活高亮、徽标 | `list: AppRouteRecord[]` |
| AoSidebarMenu | [ao-menus/ao-sidebar-menu/index.vue](src/components/core/layouts/ao-menus/ao-sidebar-menu/index.vue) | 左侧菜单或双列菜单（dual menu），双列模式下左侧只显示一级菜单图标 | 无 |

---

## 4. `forms/` 表单类

| 组件 | 路径 | 作用 | 主要 props |
| --- | --- | --- | --- |
| AoButtonMore | [ao-button-more/index.vue](src/components/core/forms/ao-button-more/index.vue) | 「更多」下拉按钮，基于 ElDropdown，支持每项独立权限控制 | `list: ButtonMoreItem[]`、`auth?`；事件 `click(item)` |
| AoButtonTable | [ao-button-table/index.vue](src/components/core/forms/ao-button-table/index.vue) | 表格行内操作按钮，预设 add/edit/delete/view/more 五种类型 | `type?`、`icon?`、`iconClass?`、`iconColor?`、`buttonBgColor?`；事件 `click` |
| AoExcelExport | [ao-excel-export/index.vue](src/components/core/forms/ao-excel-export/index.vue) | Excel 导出按钮，基于 xlsx + file-saver，支持列配置、序号列、最大行数、节流 | `ExportOptions`（data、filename、columns、headers、maxRows 等） |
| AoExcelImport | [ao-excel-import/index.vue](src/components/core/forms/ao-excel-import/index.vue) | Excel 导入按钮，使用 ElUpload 选择文件后通过 xlsx 解析为 JSON | 无；事件 `import-success(data)`、`import-error(error)` |
| AoForm | [ao-form/index.vue](src/components/core/forms/ao-form/index.vue) | 通用表单组件，配置式 `formItems` 渲染 Element Plus 表单控件 | `modelValue`、`formItems`、`labelPosition`、`labelWidth`、`gutter`、`span`、`showReset`、`showSubmit` |
| AoSearchBar | [ao-search-bar/index.vue](src/components/core/forms/ao-search-bar/index.vue) | 表格搜索栏，与 AoForm 配置式写法一致，支持展开/收起、搜索/重置 | 与 AoForm 类似，含 `isExpanded`、`showSearch`、`showReset` |

---

## 5. `media/` 媒体类

| 组件 | 路径 | 作用 | 主要 props |
| --- | --- | --- | --- |
| AoCutterImg | [ao-cutter-img/index.vue](src/components/core/media/ao-cutter-img/index.vue) | 图片裁剪组件，封装 vue-img-cutter，提供预览框与下载按钮 | `CutterProps`（isModal、boxWidth/Height、cutWidth/Height、sizeChange 等） |
| AoVideoPlayer | [ao-video-player/index.vue](src/components/core/media/ao-video-player/index.vue) | 视频播放器，封装 xgplayer（西瓜播放器），支持截图、流式布局 | `playerId`、`videoUrl`、`posterUrl`、`autoplay?`、`volume?`、`playbackRates?`、`loop?`、`muted?` |

---

## 6. `others/` 其他类

| 组件 | 路径 | 作用 | 主要 props |
| --- | --- | --- | --- |
| AoMenuRight | [ao-menu-right/index.vue](src/components/core/others/ao-menu-right/index.vue) | 右键菜单 / 自定义上下文菜单，支持子菜单、禁用、分割线、动画 | `menuItems: MenuItemType[]`、`menuWidth?`、`submenuWidth?`、`itemHeight?`；事件 `select(item)` |
| AoWatermark | [ao-watermark/index.vue](src/components/core/others/ao-watermark/index.vue) | 全局水印组件，封装 ElWatermark | `content?`、`visible?`、`fontSize?`、`fontColor?`、`rotate?`、`gapX?`、`gapY?`、`zIndex?` |

---

## 7. `tables/` 表格类

| 组件 | 路径 | 作用 | 主要 props |
| --- | --- | --- | --- |
| AoTable | [ao-table/index.vue](src/components/core/tables/ao-table/index.vue) | 核心表格组件，封装 ElTable + ElPagination，支持全局序号列、展开行、自定义列插槽、表头插槽、空状态、loading | `columns: ColumnOption[]`、`loading`、`pagination?`、`showPagination?`、`emptyText?`；分页事件 `size-change`、`current-change` |
| AoTableHeader | [ao-table-header/index.vue](src/components/core/tables/ao-table-header/index.vue) | 表格头部工具条，包含搜索切换、刷新、表格尺寸切换、全屏、列设置（拖拽排序/固定/显隐） | `showSearchBar?`、`loading?`、`tableSize?`、`columns`；事件 `search`、`refresh`、`size-change`、`fullscreen` |

---

## 8. `text-effect/` 文本效果类

| 组件 | 路径 | 作用 | 主要 props |
| --- | --- | --- | --- |
| AoCountTo | [ao-count-to/index.vue](src/components/core/text-effect/ao-count-to/index.vue) | 数字滚动动画组件，基于 useTransition + TransitionPresets，支持前缀/后缀/分隔符/小数/缓动函数 | `target`、`duration?`、`autoStart?`、`decimals?`、`separator?`、`prefix?`、`suffix?`、`easing?`；expose `start/pause/reset/stop/setTarget` |

---

## 9. `theme/` 主题类

| 组件 | 路径 | 作用 | 主要 props |
| --- | --- | --- | --- |
| ThemeSvg | [theme-svg/index.vue](src/components/core/theme/theme-svg/index.vue) | 让特定 SVG 图片跟随主题色变化的组件（通过正则替换 SVG 内 fill/stroke 颜色为 CSS 变量） | `size?: string \| number`（默认 500）、`themeColor?: string`（默认 `var(--el-color-primary)`）、`src?: string` |

> **保留说明**：注释标注「不建议开发者使用」，但仍被 [LoginLeftView.vue](src/components/core/views/login/LoginLeftView.vue) 和 [AoException.vue](src/components/core/views/exception/AoException.vue) 使用，暂保留。

---

## 10. `views/` 视图片段类

| 组件 | 路径 | 作用 | 主要 props |
| --- | --- | --- | --- |
| AoException | [AoException.vue](src/components/core/views/exception/AoException.vue) | 异常页（404/403 等），展示主题化 SVG 图 + 描述 + 「返回首页」按钮，未登录时跳转登录页 | `data: ExceptionData`（title、desc、btnText、imgUrl） |
| LoginLeftView | [LoginLeftView.vue](src/components/core/views/login/LoginLeftView.vue) | 登录页左侧背景视图，含 Logo、主题化插画、标题文案、几何装饰元素与动画 | `hideContent?: boolean` |
| AuthTopBar | [AuthTopBar.vue](src/components/core/views/login/AuthTopBar.vue) | 授权页（登录/注册等）右上角顶栏，含 Logo、主题色选择、语言切换、主题明暗切换 | 无 |

---

## 11. `widget/` 小部件类

| 组件 | 路径 | 作用 | 主要 props |
| --- | --- | --- | --- |
| AoIconButton | [ao-icon-button/index.vue](src/components/core/widget/ao-icon-button/index.vue) | 纯图标按钮（基于 AoSvgIcon），支持圆形/圆角、默认插槽 | `icon: string`、`circle?: boolean` |

---

## 已移除组件记录

以下组件已在 2026-07-25 的功能移除中删除，此处仅作记录便于追溯：

| 类别 | 已移除组件 | 移除原因 |
| --- | --- | --- |
| `cards/`（8 个） | AoBarChartCard、AoDataListCard、AoDonutChartCard、AoImageCard、AoLineChartCard、AoProgressCard、AoStatsCard、AoTimelineListCard | 用户要求移除图表/卡片类组件 |
| `charts/`（8 个） | AoBarChart、AoDualBarCompareChart、AoHBarChart、AoKLineChart、AoLineChart、AoRadarChart、AoRingChart、AoScatterChart | 用户要求移除图表类组件 |
| `text-effect/`（2 个） | AoFestivalTextScroll、AoTextScroll | 用户要求移除节日滚动与跑马灯组件 |

## 命名规范遗留提示

以下 3 个组件未完全遵循 `Ao` 前缀命名约定，后续可统一：

| 文件 | 当前名称 | 建议名称 |
| --- | --- | --- |
| [theme-svg/index.vue](src/components/core/theme/theme-svg/index.vue) | `ThemeSvg` | `AoThemeSvg` |
| [LoginLeftView.vue](src/components/core/views/login/LoginLeftView.vue) | `LoginLeftView` | `AoLoginLeftView` |
| [AuthTopBar.vue](src/components/core/views/login/AuthTopBar.vue) | `AuthTopBar` | `AoAuthTopBar` |
