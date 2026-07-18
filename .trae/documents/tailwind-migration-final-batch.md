# Tailwind → SCSS 迁移计划（最后批次：3 个文件）

## 概述

完成剩余 3 个布局组件的 Tailwind CSS → SCSS 迁移工作：
1. `art-page-content/index.vue`（template 已迁移，缺 style 块）
2. `art-screen-lock/index.vue`（未迁移）
3. `art-work-tab/index.vue`（未迁移，含动态 `:class` 绑定与复杂 google-tab 样式）

## 当前状态分析

### 文件 1：art-page-content/index.vue
- **状态**：template 已迁移完成（`.layout-content--full-page` / `.route-info-debug` / `.transition-mask` 已替换原 Tailwind 类）
- **缺失**：尚无 `<style scoped lang="scss">` 块定义这三个类的样式
- **保留全局类**：`border-full-d`

### 文件 2：art-screen-lock/index.vue
- **状态**：template 仍使用大量 Tailwind 类，已有 `<style lang="scss" scoped>` 块（含 `.unlock-content` / `.animate-fade-in` / `.shake-animation` / keyframes）
- **需迁移的 template Tailwind 类**（按区块）：
  - 开发者工具警告覆盖层：`fixed top-0 left-0 z-[999999] flex-cc w-full h-full text-white bg-gradient-to-br from-[#1e1e1e] to-black animate-fade-in`
  - 警告内容：`p-5 text-center select-none`、`mb-7.5 text-5xl`、`m-0 mb-5 text-3xl font-semibold text-danger`、`max-w-125 m-0 text-lg leading-relaxed text-white`、`mt-7.5 text-sm text-gray-400`
  - 锁屏弹窗：`flex-c flex-col`、`w-16 h-16 rounded-full`、`mt-7.5 mb-3.5 text-base font-medium`、`w-[90%]`、`w-full mt-9`、`w-full mt-0.5`
  - 解锁界面：`flex-c flex-col w-80`、`w-16 h-16 mt-5 rounded-full`、`mt-3 mb-3.5 text-base font-medium`、`w-full !px-2.5`、`mt-5`、`w-full mt-2`、`w-full text-center`、`mt-2.5 !text-g-600 hover:!text-theme hover:!bg-transparent`
- **保留全局类**：`flex-cc`、`flex-c`、`c-p`
- **保留已有类**：`animate-fade-in`（已定义 keyframes）、`unlock-content`

### 文件 3：art-work-tab/index.vue
- **状态**：template 使用大量 Tailwind 类 + 动态 `:class` 绑定，已有 `<style scoped>`（**非 scss**）块含复杂 `.google-tab` 规则
- **需迁移的 template Tailwind 类**：
  - 容器：`box-border flex-b w-full px-5 mb-3 select-none max-sm:px-[15px]` + 动态 `py-1 border-b border-[var(--art-card-border)]` / `pt-1 pb-0 border-b border-[var(--art-card-border)]`
  - 滚动容器：`w-full overflow-hidden`
  - ul：`float-left whitespace-nowrap !bg-transparent flex` + 动态 `pl-1`
  - li：`art-card-xs inline-flex flex-cc h-8 mr-1.5 text-xs c-p hover:text-theme group` + 动态 `activ-tab !text-theme` / `text-g-600 dark:text-g-800` + 动态 `google-tab relative !h-8 !leading-8 !border-none`
  - 图标：`text-base mr-1 group-hover:text-theme` + 动态 `text-theme` / `text-g-600`
  - 关闭按钮：`inline-flex flex-cc relative ml-0.5 p-1 rounded-full tad-200 hover:bg-g-200`
  - 关闭图标：`text-[10px] text-g-600`
  - google 线条：`line absolute top-0 bottom-0 left-0 w-px h-4 my-auto bg-g-400 transition-opacity duration-150`
  - 下拉按钮：`flex-cc art-card-xs relative top-0 size-8 leading-8 text-center c-p tad-200 hover:!bg-hover-color`
  - 下拉图标：`text-2xl text-g-700`
- **保留全局类**：`flex-b`、`flex-cc`、`c-p`、`tad-200`、`art-card-xs`（定义在 `src/assets/styles/core/app.scss`）
- **保留已有类**：`google-tab`、`activ-tab`、`line`（已被现有 SCSS 引用）
- **现有 SCSS 问题**：媒体查询选择器 `.box-border.flex.justify-between` 迁移后失效，需改为 `.work-tab`

## 实施方案

### 文件 1：art-page-content/index.vue

**改动**：在 `</script>` 后追加 `<style scoped lang="scss">` 块。

**新增 SCSS 规则**：
```scss
<style scoped lang="scss">
  // 路由信息调试显示框（原: px-2 py-1.5 mb-3 text-sm text-g-500 bg-g-200 rounded-md）
  .route-info-debug {
    padding-left: 0.5rem;       // px-2
    padding-right: 0.5rem;
    padding-top: 0.375rem;      // py-1.5
    padding-bottom: 0.375rem;
    margin-bottom: 0.75rem;     // mb-3
    font-size: 0.875rem;        // text-sm
    line-height: 1.25rem;
    color: var(--art-gray-500); // text-g-500
    background: var(--art-gray-200); // bg-g-200
    border-radius: 0.375rem;    // rounded-md
  }

  // 全屏切换过渡遮罩（原: fixed top-0 left-0 z-[2000] w-screen h-screen pointer-events-none bg-box）
  .transition-mask {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2000;              // z-[2000]
    width: 100vw;               // w-screen
    height: 100vh;              // h-screen
    pointer-events: none;       // pointer-events-none
    background: var(--default-box-color); // bg-box
  }

  // 全屏页面模式：内容区可滚动（原: overflow-auto）
  .layout-content--full-page {
    overflow: auto;
  }
</style>
```

### 文件 2：art-screen-lock/index.vue

**改动 1**：template 中为元素添加语义化 class（保留 `flex-cc`/`flex-c`/`c-p`/`animate-fade-in`）。

| 原始 Tailwind 类 | 新增语义类 | 保留全局类 |
|---|---|---|
| `fixed top-0 left-0 z-[999999] flex-cc w-full h-full text-white bg-gradient-to-br from-[#1e1e1e] to-black animate-fade-in` | `devtools-warning` | `flex-cc` `animate-fade-in` |
| `p-5 text-center select-none` | `devtools-warning__content` | - |
| `mb-7.5 text-5xl` | `devtools-warning__icon` | - |
| `m-0 mb-5 text-3xl font-semibold text-danger` | `devtools-warning__title` | - |
| `max-w-125 m-0 text-lg leading-relaxed text-white` | `devtools-warning__desc` | - |
| `mt-7.5 text-sm text-gray-400` | `devtools-warning__subtitle` | - |
| `flex-c flex-col` | `lock-dialog` | `flex-c` |
| `w-16 h-16 rounded-full`（锁屏弹窗头像） | `lock-dialog__avatar` | - |
| `mt-7.5 mb-3.5 text-base font-medium`（锁屏弹窗用户名） | `lock-dialog__name` | - |
| `w-[90%]`（锁屏弹窗表单） | `lock-dialog__form` | - |
| `w-full mt-9`（锁屏弹窗输入框） | `lock-dialog__input` | - |
| `w-full mt-0.5`（锁屏弹窗按钮） | `lock-dialog__btn` | - |
| `flex-c flex-col w-80`（解锁界面） | `unlock-form` | `flex-c` |
| `w-16 h-16 mt-5 rounded-full`（解锁头像） | `unlock-form__avatar` | - |
| `mt-3 mb-3.5 text-base font-medium`（解锁用户名） | `unlock-form__name` | - |
| `w-full !px-2.5`（解锁表单） | `unlock-form__form` | - |
| `mt-5`（解锁输入框） | `unlock-form__input` | - |
| `w-full mt-2`（解锁按钮） | `unlock-form__btn` | - |
| `w-full text-center`（返回按钮容器） | `unlock-form__back-wrap` | - |
| `mt-2.5 !text-g-600 hover:!text-theme hover:!bg-transparent`（返回按钮） | `unlock-form__back-btn` | - |

**改动 2**：在已有 `<style lang="scss" scoped>` 块中追加新语义类的 SCSS 规则。

**关键映射**：
- `bg-gradient-to-br from-[#1e1e1e] to-black` → `background-image: linear-gradient(to bottom right, #1e1e1e, #000);`
- `text-danger` → `color: var(--art-danger);`
- `text-gray-400` → `color: var(--art-gray-400);`（项目灰色变量，暗黑模式自动切换）
- `text-white` → `color: #fff;`
- `z-[999999]` → `z-index: 999999;`
- `max-w-125` → `max-width: 31.25rem;`
- `mb-7.5` → `margin-bottom: 1.875rem;`
- `mt-7.5` → `margin-top: 1.875rem;`
- `w-16 h-16` → `width: 4rem; height: 4rem;`
- `w-80` → `width: 20rem;`
- `w-[90%]` → `width: 90%;`
- `!px-2.5` → `padding-left: 0.625rem !important; padding-right: 0.625rem !important;`
- `mt-9` → `margin-top: 2.25rem;`
- `!text-g-600` → `color: var(--art-gray-600) !important;`
- `hover:!text-theme` → `&:hover { color: var(--theme-color) !important; }`
- `hover:!bg-transparent` → `&:hover { background: transparent !important; }`

### 文件 3：art-work-tab/index.vue

**改动 1**：template 中为元素添加语义化 class，转换动态 `:class` 绑定。

| 元素 | 原 Tailwind 类 | 新增语义类 | 保留全局类 | 动态类处理 |
|---|---|---|---|---|
| 容器 div | `box-border flex-b w-full px-5 mb-3 select-none max-sm:px-[15px]` | `work-tab` | `flex-b` | `tabStyle==='tab-card'` → `work-tab--card`；`tabStyle==='tab-google'` → `work-tab--google` |
| 滚动容器 | `w-full overflow-hidden` | `work-tab__scroll` | - | - |
| ul | `float-left whitespace-nowrap !bg-transparent flex` | `work-tab__list` | - | `tabStyle==='tab-google'` → `work-tab__list--google`（替代 `pl-1`） |
| li | `art-card-xs inline-flex flex-cc h-8 mr-1.5 text-xs c-p hover:text-theme group` | `work-tab__item` | `art-card-xs` `flex-cc` `c-p` | 激活 → `activ-tab`（保留）；google → `google-tab`（保留） |
| 图标 | `text-base mr-1 group-hover:text-theme` | `work-tab__item-icon` | - | 激活/非激活颜色由 SCSS 处理 |
| 关闭按钮 span | `inline-flex flex-cc relative ml-0.5 p-1 rounded-full tad-200 hover:bg-g-200` | `work-tab__close` | `flex-cc` `tad-200` | - |
| 关闭图标 | `text-[10px] text-g-600` | `work-tab__close-icon` | - | - |
| google 线条 div | `line absolute top-0 bottom-0 left-0 w-px h-4 my-auto bg-g-400 transition-opacity duration-150` | 保留 `line`（已被现有 SCSS 引用） | - | - |
| 下拉按钮 div | `flex-cc art-card-xs relative top-0 size-8 leading-8 text-center c-p tad-200 hover:!bg-hover-color` | `work-tab__dropdown` | `flex-cc` `art-card-xs` `c-p` `tad-200` | - |
| 下拉图标 | `text-2xl text-g-700` | `work-tab__dropdown-icon` | - | - |

**li 元素 `:class` 绑定调整**：
```html
<!-- 原 -->
:class="[
  item.path === activeTab ? 'activ-tab !text-theme' : 'text-g-600 dark:text-g-800',
  tabStyle === 'tab-google' ? 'google-tab relative !h-8 !leading-8 !border-none' : ''
]"
<!-- 改为 -->
:class="[
  item.path === activeTab ? 'activ-tab' : '',
  tabStyle === 'tab-google' ? 'google-tab' : ''
]"
```

**图标 `:class` 绑定调整**：
```html
<!-- 原 -->
:class="item.path === activeTab ? 'text-theme' : 'text-g-600'"
<!-- 改为：删除动态类，颜色由 SCSS 根据父级 .activ-tab 状态处理 -->
```

**改动 2**：将 `<style scoped>` 改为 `<style scoped lang="scss">`，保留全部已有 `.google-tab` 规则，追加新语义类规则，修正媒体查询选择器。

**新增 SCSS 规则**（关键部分）：
```scss
// 工作台标签页容器
.work-tab {
  box-sizing: border-box;
  width: 100%;
  padding-left: 1.25rem;  // px-5
  padding-right: 1.25rem;
  margin-bottom: 0.75rem; // mb-3
  user-select: none;      // select-none

  // max-sm:px-[15px]
  @media (max-width: 39.99rem) {
    padding-left: 15px;
    padding-right: 15px;
  }

  // tab-card 样式（原: py-1 border-b border-[var(--art-card-border)]）
  &--card {
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    border-bottom: 1px solid var(--art-card-border);
  }

  // tab-google 样式（原: pt-1 pb-0 border-b border-[var(--art-card-border)]）
  &--google {
    padding-top: 0.25rem;
    padding-bottom: 0;
    border-bottom: 1px solid var(--art-card-border);
  }
}

// 滚动容器
.work-tab__scroll {
  width: 100%;
  overflow: hidden;
}

// 标签列表 ul
.work-tab__list {
  float: left;
  white-space: nowrap;
  display: flex;
  background: transparent !important; // !bg-transparent

  &--google {
    padding-left: 0.25rem; // pl-1
  }
}

// 单个标签项
.work-tab__item {
  display: inline-flex;
  height: 2rem;            // h-8
  margin-right: 0.375rem;  // mr-1.5
  font-size: 0.75rem;      // text-xs
  line-height: 1rem;
  color: var(--art-gray-600); // text-g-600（默认非激活）

  // dark:text-g-800
  .dark & {
    color: var(--art-gray-800);
  }

  // hover:text-theme
  &:hover {
    color: var(--theme-color);
  }

  // 激活状态：!text-theme
  &.activ-tab {
    color: var(--theme-color) !important;
  }
}

// 标签图标
.work-tab__item-icon {
  font-size: 1rem;        // text-base
  line-height: 1.5rem;
  margin-right: 0.25rem;  // mr-1
  color: var(--art-gray-600); // 默认非激活

  // 激活状态
  .work-tab__item.activ-tab & {
    color: var(--theme-color);
  }

  // group-hover:text-theme（父级 .work-tab__item 悬停时）
  .work-tab__item:hover & {
    color: var(--theme-color);
  }
}

// 关闭按钮
.work-tab__close {
  position: relative;
  margin-left: 0.125rem;  // ml-0.5
  padding: 0.25rem;       // p-1
  border-radius: 9999px;  // rounded-full

  &:hover {
    background: var(--art-gray-200); // hover:bg-g-200
  }
}

// 关闭图标
.work-tab__close-icon {
  font-size: 10px;        // text-[10px]
  color: var(--art-gray-600);
}

// google 样式线条（保留 .line 类名，已被现有 SCSS 引用）
.line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 1px;             // w-px
  height: 1rem;           // h-4
  margin-top: auto;       // my-auto
  margin-bottom: auto;
  background: var(--art-gray-400); // bg-g-400
  transition-property: opacity;
  transition-duration: 150ms; // duration-150
}

// 下拉按钮
.work-tab__dropdown {
  position: relative;
  top: 0;
  width: 2rem;            // size-8
  height: 2rem;
  line-height: 2rem;      // leading-8
  text-align: center;

  &:hover {
    background: var(--art-hover-color) !important; // hover:!bg-hover-color
  }
}

// 下拉图标
.work-tab__dropdown-icon {
  font-size: 1.5rem;      // text-2xl
  line-height: 2rem;
  color: var(--art-gray-700); // text-g-700
}
```

**修正现有媒体查询**：
```scss
// 原: .box-border.flex.justify-between（迁移后选择器失效）
// 改: .work-tab
@media (max-width: 768px) {
  .work-tab {
    padding-right: 0.625rem;
    padding-left: 0.625rem;
  }
}

@media (max-width: 640px) {
  .work-tab {
    padding-right: 0.9375rem;
    padding-left: 0.9375rem;
  }
}
```

## 假设与决策

1. **`text-gray-400` 映射**：`art-screen-lock` 中的 `text-gray-400`（Tailwind 默认灰）映射为 `var(--art-gray-400)`，保持与项目灰色体系一致，暗黑模式自动切换。
2. **`art-card-xs` 保留**：定义在全局 `src/assets/styles/core/app.scss`，作为全局类在 template 中保留（同 `flex-c` 等）。
3. **`group`/`group-hover:` 转换**：Tailwind 的 `group` + `group-hover:` 模式转为 SCSS 嵌套 `&:hover .child { ... }`。
4. **动态颜色类处理**：`art-work-tab` 中 li 的动态颜色类（`!text-theme` / `text-g-600 dark:text-g-800`）转为 SCSS 中基于 `.activ-tab` 的条件规则，简化 `:class` 绑定。
5. **`!important` 保留**：原 Tailwind 类中的 `!` 前缀（如 `!text-theme`、`!bg-transparent`、`!bg-hover-color`）在 SCSS 中保留 `!important`。
6. **现有 google-tab SCSS 保留**：`art-work-tab` 现有的 `.google-tab` 相关复杂规则（含 `::before`/`::after`、暗黑模式）全部保留不动，仅修正媒体查询选择器。
7. **响应式断点**：`max-sm:` → `@media (max-width: 39.99rem)`；保留现有 768px/640px 媒体查询。
8. **`bg-gradient-to-br from-[#1e1e1e] to-black`**：转为 `background-image: linear-gradient(to bottom right, #1e1e1e, #000);`（Tailwind v4 gradient 语法）。

## 验证步骤

每个文件迁移完成后：
1. **语法检查**：确认 `<style scoped lang="scss">` 块无 SCSS 语法错误
2. **类引用一致性**：template 中的 class 与 SCSS 中定义的类名一一对应
3. **全局类保留**：确认 `flex-c`/`flex-b`/`flex-cc`/`flex-cb`/`c-p`/`tad-200`/`border-*-d`/`art-card-xs`/`rounded-custom-*` 等全局类未被移入 scoped SCSS
4. **动态类处理**：确认 `:class` 绑定中已无 Tailwind 工具类，仅保留语义化类名
5. **颜色变量**：确认所有颜色类已映射为 `var(--art-*)` / `var(--theme-color)` / `var(--default-box-color)` 等
6. **暗黑模式**：确认 `dark:` 变体已转为 `.dark &` 嵌套
7. **响应式**：确认 `max-sm:` 等已转为 `@media` 查询

全部完成后：
8. 启动 dev 服务器，检查锁屏、解锁、工作台标签页、页面内容切换等功能正常
9. 检查暗黑模式下各组件显示正常
10. 检查响应式布局（移动端/桌面端）工作台标签页显示正常
