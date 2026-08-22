# Fex Component Documentation and Source Delivery Design

## 1. 核心定义

Fex 不是五个相似组件库，而是一套组件系统的五种框架适配：

```text
公共语义一致
公共行为一致
公共视觉一致
框架表达符合各自最佳实践
```

组件不发布为公共 npm 组件包。`packages/@fex-design/*` 是 monorepo 中的源码母版，CLI 通过 Registry 将源码复制到用户项目，类似 shadcn 的源码交付模式。

用户可能在公司内部将取得的源码重新封装为 npm 包，因此公开 API、CSS Variables、class/style、部件定制和无障碍契约仍必须稳定。

## 2. 五框架一致性边界

必须一致：

- 组件和部件语义。
- 属性名称和含义。
- 默认值和枚举值。
- 受控/非受控规则。
- 事件触发时机和 payload。
- disabled、loading、readonly 等状态。
- 键盘、焦点、Portal、dismiss 行为。
- role、aria、data-slot、data-state 等公开 DOM 契约。
- CSS Variables 和视觉规格。
- Primitive/UI/Pro 边界。
- Demo 场景与初始数据。

允许不同：

```text
React children / hooks
Vue slots / composables
Solid children/accessors / primitives
Svelte snippets/actions/stores
Angular content projection/directives/signals/services
```

框架语法可以不同，能力和结果不能不同。

## 3. 分层

```text
Themes
→ 全局 token、主题、Tailwind 映射和 CSS

Shared Styles
→ 五框架唯一组件 class、variant、size 和 data-state 样式事实源

Core
→ 框架无关状态、controller、模型、键盘和纯逻辑

Framework Adapter
→ 响应式、生命周期、DOM ref、Portal、slot/template 和事件绑定

Primitive
→ 最小 DOM、行为、ARIA 和组合部件

UI
→ Primitive 的推荐组合和业务友好默认结构

Pro
→ 仅用于明确、复杂、高复用的工作流
```

依赖方向：

```text
Pro → UI → Primitive → Core/Styles/Utils
```

禁止反向依赖。

## 4. API JSON 是文档数据源

每个组件维护一份框架无关 API JSON：

```text
docs/api/primitive/button.json
docs/api/primitive/dialog.json
docs/api/ui/tree-transfer.json
docs/api/pro/data-grid.json
```

用途：

- 官网 API Table。
- 属性添加器。
- 属性值编辑控件。
- Events JSON 面板。
- Markdown/AI 文档生成。
- Registry 和 CLI 查询。
- 五框架 API 一致性校验。

推荐结构：

```json
{
  "$schema": "../../schemas/component-api.schema.json",
  "name": "Dialog",
  "slug": "dialog",
  "layer": "primitive",
  "status": "stable",
  "description": "",
  "components": [],
  "props": [],
  "events": [],
  "slots": [],
  "methods": [],
  "cssVariables": [],
  "dataAttributes": [],
  "accessibility": {
    "roles": [],
    "keyboard": []
  },
  "demos": [],
  "frameworkNotes": {}
}
```

类型使用结构化数据，不只写 TypeScript 字符串：

```json
{
  "name": "size",
  "type": {
    "kind": "enum",
    "values": ["xs", "sm", "default", "lg", "xl"]
  },
  "defaultValue": "default",
  "description": "控件尺寸。",
  "playground": {
    "enabled": true,
    "editor": "select",
    "initialValue": "lg"
  }
}
```

事件：

```json
{
  "name": "change",
  "description": "值发生变化时触发。",
  "parameters": [
    {
      "name": "value",
      "type": { "kind": "string" }
    }
  ],
  "playground": {
    "log": true
  }
}
```

API JSON 是产品/API 设计契约，五框架源码是实现。构建时双向校验：

```text
JSON 声明但某框架缺失 → 失败
源码新增公开 API 但 JSON 未记录 → 失败
默认值、枚举或事件参数不同 → 失败
JSON 指向不存在 Demo → 失败
Playground editor 与类型不兼容 → 失败
```

## 5. 组件文档和 Demo

每个组件页面重点解决：用户看到属性后可以立即观察效果，不需要复制项目或跳到依赖库文档猜测。

每个 Demo 提供：

```text
真实 Preview
+ 添加属性
+ Code
+ Events
```

### 5.1 添加属性

每个 Demo 右上角有 `添加属性`：

```text
点击
→ 搜索/多选当前 Demo 支持的属性
→ 在 Preview 下方生成属性名和编辑控件
→ 修改后立即发送给 iframe Preview
→ Code 同步更新
```

编辑器根据 API JSON 自动选择：

```text
boolean → Switch
enum    → Select
string  → Input
number  → InputNumber
color   → Color Input
简单数组 → Tags Input
复杂数组/对象 → JSON Editor
function → 不进入属性选择器
slot/render/hook → 专门 Demo
```

每个 Demo 可以默认使用组件全部安全可编辑属性，也可以用少量 include/exclude 限制当前场景。

### 5.2 对象属性

第一版使用经过 Schema 校验的 JSON Editor：

```json
{
  "checkable": true,
  "defaultExpandAll": true
}
```

例如 TreeTransfer：

```text
treeProps
transferProps
```

API JSON 使用 reference 指向 TreeProps/TransferProps，并排除由 TreeTransfer 自己拥有的 data、value、defaultValue、onChange 等状态来源。

非法 JSON 不发送给 Preview，继续使用最后一次合法值并显示错误位置。

### 5.3 回调

回调不进入属性选择器，不允许用户在线编写任意函数。

Preview Harness 自动连接当前 Demo 相关业务事件，触发后显示 JSON：

```json
{
  "event": "change",
  "arguments": {
    "value": ["node-1", "node-2"],
    "detail": {
      "action": "add"
    }
  }
}
```

事件序列化必须处理 DOM Element、Event、Function 和循环引用。高频原生事件如 pointermove、mousemove、scroll 不默认记录。

所有公开事件在 API Table 中说明参数，并链接到可以触发它的 Demo。

### 5.4 不支持在线编辑的能力

以下使用官方 Demo 和源码展示：

```text
Hook
自定义 render
slot/children/template
异步 request
自定义组件
多组件复杂组合
```

例如 `useDraggable + Dialog` 是组合 Demo。官网直接展示五框架真实效果和代码；用户需要自由修改时再打开外部 Sandbox。

第一阶段不建设五框架浏览器内代码编译器。

## 6. Demo 源码

Demo 不能写成 MDX 内的字符串。真实源码按框架保存，并同时服务 Preview、Code、测试、Registry 和 AI：

```text
docs/examples/dialog/basic/
├── meta.json
├── react.tsx
├── vue.vue
├── solid.tsx
├── svelte.svelte
├── angular.ts
└── angular.html
```

每个 Demo 只回答一个明确问题：

```text
基础用法
禁用
受控模式
多选
搜索
异步
自定义 Trigger
表单组合
键盘行为
```

复杂组件允许有多个基础 Harness，如 Select 的 Basic、Multiple、Search、Async。

公开属性必须至少满足一项：

```text
有独立 Demo
可在属性编辑器中立即试用
标记为结构型 API，并链接真实组合 Demo
```

不允许只留一行类型和说明而没有可观察方式。

## 7. Preview Runtime 协议

Solid Docs 和 iframe 使用同源 `postMessage`：

```text
Docs → Preview
- SET_PROPS
- SET_THEME
- SET_VIEWPORT
- RESET

Preview → Docs
- READY
- RESIZE
- EVENT
- ERROR
- STATE_CHANGE
```

Props 只传经过 API Schema 校验的 JSON。回调函数不跨 iframe 传递，由 Preview Harness 本地连接。

iframe 进入视口附近再加载，默认只加载当前框架。五框架比较由用户显式触发。

## 8. Registry 和源码交付

组件不作为公共 npm 组件包发布。CLI 从 Registry 复制当前框架源码和共享依赖。

Registry Item 负责：

```text
组件 ID
layer
framework files
target path
registry dependencies
第三方 dependencies
CSS/theme dependencies
API JSON ID
Demo IDs
import 转换
```

API JSON 和 Registry JSON 职责分离，通过组件 ID 关联：

```text
API JSON      → 如何使用和展示
Registry JSON → 如何安装源码
```

用户项目保留共享分层：

```text
src/fex/
├── core/
├── themes/
├── utils/
├── icons/
├── framework helpers/
└── components/
    ├── primitive/
    ├── ui/
    └── pro/
```

Core、Utils 和全局 Theme 只复制一份，不内联进每个组件。

## 9. Shared Styles 的分发

仓库母版继续使用一份 `@fex-design/styles` 保证五框架一致。

CLI 分发时：

```text
简单组件
→ 将静态 Tailwind class 和 CVA 定义放入组件文件

复杂组件
→ 放入组件同目录的 component.styles.ts

全局 token/theme
→ 保留共享 CSS

Core
→ 保留共享目录
```

用户打开组件或组件目录即可看到 Tailwind 样式，不需要跳转全局 styles 目录。生成物必须由同一 Styles 母版产生，不能让五个框架分别手写 class。

## 10. CLI 冲突策略

CLI 不做自动逻辑合并、Tailwind 语义合并或 AST 合并。

```text
文件不存在 → 添加
文件存在，无参数 → 询问是否覆盖
用户选择否 → 跳过
用户选择是 → 覆盖
--overwrite / -o → 直接覆盖
--dry-run → 预览变更
--diff → 查看差异
--view → 查看 Registry 源码
```

`--yes` 不隐式覆盖已有组件。覆盖必须明确使用 `--overwrite`。

安装完成后代码归用户所有。用户改过逻辑时，CLI 不猜测如何合并；用户先查看 diff，再决定保留或覆盖。

## 11. Skill、MCP 和 llms

不是每个组件各维护一套。

整个 Fex 提供：

```text
一个 Fex Skill
一个 Fex MCP Server
一个 /llms.txt
可选一个 /llms-full.txt
每个组件一份 API JSON 和生成的 AI Markdown
```

Skill 说明：

- 如何识别项目框架。
- 如何选择 Primitive/UI/Pro。
- 如何查询 Registry/API/Demo。
- 如何运行 CLI 安装。
- 如何遵循公共 API 和验证要求。

MCP 工具建议：

```text
search_components
get_component
get_component_api
get_component_files
get_component_dependencies
get_component_demos
get_install_command
compare_frameworks
```

`llms.txt` 是索引。每组件 AI Markdown 由 API JSON、公共正文和真实 Demo 生成，不人工复制维护。

## 12. 逐组件交付流程

每次重构或新增组件按固定顺序：

1. 审计 Primitive 五框架 API、行为、DOM、视觉和 exports。
2. 确定 Primitive/UI/Pro 边界。
3. 先写或更新 API JSON。
4. 设计共享 Core 和 Styles。
5. 实现五框架 Adapter/UI/Pro。
6. 写五框架同场景 Demo。
7. 接入属性编辑和 Events JSON。
8. 校验 API JSON 与五框架实现。
9. 运行公共行为、无障碍和关键视觉验证。
10. 生成文档、Registry 和 AI 数据。

完成标准：

```text
公共 Contract 已确定
Core/Styles 边界明确
五框架 API 对齐
五框架行为对齐
五框架视觉对齐
API JSON 完整
Demo 覆盖公开能力
Registry 依赖闭包完整
独立 Demo URL 可运行
验证证据明确
```

## 13. 首批验证组件

先用三个组件验证整套架构：

```text
Button
- 简单 Props、size、class/style、事件

Dialog
- 组合部件、受控状态、Portal、Escape、outside click

TreeTransfer
- UI 组合、treeProps/transferProps、对象编辑、多个事件
```

三者跑通后再批量推进 UI/Pro 和文档，避免 API Schema、Preview 协议和 Registry 结构反复返工。

