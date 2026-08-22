# Fex Documentation Site Design

## 1. 产品定位

Fex 官网是一套组件系统的统一文档产品，不是五套相互复制的网站。

```text
一个 Solid 文档官网
+ 五个真实框架 Preview Runtime
```

Solid 官网负责文档内容和交互框架；React、Vue、Solid、Svelte、Angular Preview 只负责真实运行对应框架的 Demo。

## 2. 技术边界

```text
Solid Docs
├── 路由
├── 顶部导航
├── 左侧组件导航
├── 页面目录
├── Markdown/MDX 正文
├── 搜索
├── API Table
├── 框架切换
├── 属性编辑
├── Events JSON
└── Code 展示

Preview Runtime
├── React Demo
├── Vue Demo
├── Solid Demo
├── Svelte Demo
└── Angular Demo
```

五个 Preview 不维护导航、Markdown、搜索、API 页面和 CLI 文档。

Solid Demo 也在 iframe 中运行，确保五框架的 CSS、Portal、Escape、outside click、错误边界和 viewport 条件一致。

## 3. URL 设计

采用同一域名下的框架路径：

```text
https://fex.design/react/components/dialog
https://fex.design/vue/components/dialog
https://fex.design/solid/components/dialog
https://fex.design/svelte/components/dialog
https://fex.design/angular/components/dialog
```

这些地址都由同一个 Solid Docs 应用处理。URL 中的 framework 决定：

- 安装命令。
- import 路径。
- API 的框架表达。
- Demo Runtime。
- 示例代码。
- 框架专属说明。

切换框架时保持：

- 当前组件。
- 当前章节和滚动位置。
- 当前属性编辑值。
- Primitive/UI/Pro 层级。

独立 Demo URL：

```text
https://fex.design/examples/react/dialog/basic
https://fex.design/examples/vue/dialog/basic
https://fex.design/examples/solid/dialog/basic
https://fex.design/examples/svelte/dialog/basic
https://fex.design/examples/angular/dialog/basic
```

嵌入模式：

```text
/examples/vue/dialog/basic?embed=true
```

独立模式显示最小工具栏：

```text
返回文档
查看代码
主题
Viewport
```

## 4. 顶部导航

建议一级导航：

```text
Docs
Components
Patterns
CLI
AI
Themes
Playground
Changelog
```

全局框架选择器始终可见：

```text
React | Vue | Solid | Svelte | Angular
```

框架选择写入 URL；localStorage 只用于用户默认偏好，不能替代可分享 URL。

## 5. 左侧文档导航

```text
开始
├── 介绍
├── 安装
├── 五框架支持
├── 设计原则
└── 更新策略

基础
├── Tokens
├── Themes
├── Accessibility
└── Composition

Components
├── Primitive
├── UI
└── Pro

Patterns
├── Form
├── Search and Filter
├── Data Entry
├── Navigation
└── Async Data

工具
├── CLI
├── Registry
├── Skill
└── MCP

资源
├── Changelog
├── Migration
└── Roadmap
```

组件英文名称保持字母顺序。可以增加类别、层级、稳定状态和能力过滤，但不能破坏稳定导航顺序。

## 6. 组件页面结构

框架和层级是两个独立维度：

```text
Dialog

[Primitive] [UI] [Pro]
[React ▾]
```

组件没有 UI 或 Pro 时不显示对应层级，不为文档完整而创建无意义封装。

组件页建议顺序：

1. 组件定位。
2. Primitive/UI/Pro 边界。
3. 何时使用和不应使用。
4. 安装。
5. Anatomy。
6. 基础示例。
7. 特性示例。
8. 状态模型。
9. 组合示例。
10. 自定义 UI。
11. 异步与服务端边界。
12. 无障碍与键盘。
13. 性能注意事项。
14. API。
15. CSS Variables 和 data attributes。
16. 常见错误。
17. 迁移。
18. AI 使用说明。

页面重点是 Demo、API 和可观察结果，不以营销装饰为主。

## 7. 页面布局

桌面端三栏：

```text
顶部全局导航

左侧组件导航 | 文档正文和 Demo | 当前页面目录
```

移动端：

- 左侧导航进入 Drawer。
- 页面目录折叠。
- 框架选择始终可访问。
- 属性编辑区域允许折叠。
- Preview 保持真实交互。
- Code 横向滚动。

## 8. 开发和部署

开发架构上有六个应用：

```text
Solid Docs
React Preview
Vue Preview
Solid Preview
Svelte Preview
Angular Preview
```

日常只启动 Solid Docs 和当前开发框架的 Preview。完整五框架验证时才启动全部。

建议命令：

```text
dev:docs
dev:docs:react
dev:docs:vue
dev:docs:solid
dev:docs:svelte
dev:docs:angular
dev:docs:all
```

生产环境全部构建为静态资源：

```text
dist/
├── index.html
├── assets/
├── examples/
│   ├── react/
│   ├── vue/
│   ├── solid/
│   ├── svelte/
│   └── angular/
└── registry/
```

官网和 Demo 本身不要求常驻 Node.js。Node.js 只用于构建、生成 API、搜索索引和 Registry。在线保存、账号、AI 问答等未来功能再使用独立服务端。

## 9. 新目录约束

现有 `apps/*` 保持不动。新官网放在根目录 `docs/`：

```text
docs/
├── site/
├── content/
├── api/
├── examples/
├── preview/
├── schemas/
├── tooling/
└── generated/
```

后续通过根 `pnpm-workspace.yaml` 注册 `docs/site`、`docs/preview/*` 和必要 tooling，不在现有 Admin App 中继续扩展正式官网。

## 10. 内容来源

```text
Markdown/MDX
→ 解释、场景、边界和示例编排

API JSON
→ Props、Events、Slots、CSS Variables、Playground 和 API Table

五框架 Demo 源码
→ Preview 运行、Code 展示、测试、Registry 和 AI 示例
```

普通组件文档优先 Markdown 加声明式扩展。MDX 只用于确实需要复杂页面逻辑的内容，避免将文档绑定到任意 JSX。

示例：

```md
## 基础用法

::demo{#dialog-basic}

## API

::api{component="dialog" layer="primitive"}
```

## 11. SEO 和独立访问

- 每个框架组件页有独立 URL。
- 每个 Demo 有独立可运行 URL。
- 文档正文不复制五份，避免内容漂移。
- 构建时为框架路径生成正确 metadata 和 canonical 策略。
- 独立 Demo 可被浏览器测试、视觉测试、Issue 和 AI 直接引用。

## 12. 实施顺序

1. Solid Docs 最小 Shell 和框架路由。
2. 一个 iframe Preview 协议。
3. Button 的五框架 Demo。
4. Dialog 的 Portal/事件 Demo。
5. TreeTransfer 的复杂对象 Demo。
6. API JSON 渲染。
7. 属性添加与 Events JSON。
8. 搜索、导航、完整视觉设计。

导航本身不是第一阶段风险；API JSON、Demo Runtime、属性编辑和五框架一致性优先。

