# AGENTS.md

## 核心目标

- 所有代码都要以低重复渲染、高可维护、高性能、高扩展为基础；可维护性优先于局部性能技巧，性能优化必须建立在清晰边界和可验证事实之上。
- 不写“当下能跑、后面难修”的代码：避免隐式副作用、重复状态、过度抽象、过深组件、过宽 Context、到处监听 state 的实现。
- 优先复用仓库已有组件、工具、样式、mock、配置；确实通用的能力要沉淀到对应 `packages/*`，不要在多个 app 里复制。
- 严禁用猜测来写代码或修 bug。遇到异常、样式偏移、交互错位、状态不同步等问题，必须先观察真实 DOM、事件、状态快照、computed style、日志或最小复现，定位根因后再改；不能因为“看起来可能是某个原因”就直接打补丁。

## 仓库定位

- 本仓库是 `pnpm + nx + monorepo` 项目，包管理器以根目录 `package.json` 中的 `pnpm@11.4.0` 为准。
- 根目录只放 workspace、Nx、TypeScript、格式化、lint 等跨项目配置；业务代码和组件代码放到对应 `apps/*`、`packages/*` 下。
- 优先遵循已有目录结构、命名方式和局部实现风格；新增抽象前先确认它能服务多个真实场景，而不是只为当前文件“显得高级”。

## 目录约定

- `apps/react-admin`：React 管理端应用，React 19，Vite。
- `apps/vue-admin`：Vue 管理端应用。
- `apps/solid-admin`：Solid 管理端应用。
- `apps/svelte-admin`：Svelte 管理端应用。
- `apps/angular-admin`：Angular 管理端应用。
- `apps/docs`：项目文档站。
- `packages/components/core`：跨框架组件内核、类型、纯逻辑能力。
- `packages/components/react`：React 组件库，对外导入前缀使用 `@fex/components/react/*`。
- `packages/components/vue`：Vue 组件库。
- `packages/components/solid`：Solid 组件库。
- `packages/components/svelte`：Svelte 组件库。
- `packages/components/angular`：Angular 组件库。
- `packages/styles`：全局样式、主题、Tailwind 相关 CSS，应用侧通过 `import '@fex/styles'` 引入。
- `packages/utils`：通用工具函数，包名 `@fex/utils`。
- `packages/mock`：通用 mock 能力。
- `configs/*`：通用配置包，例如 `@fex/config-oxc`、`@fex/config-tsconfig`。

## 工作方式

- 修改前先看相关目录里已有组件、工具、样式、配置和调用方式。
- 排查问题时先全局观察链路，再缩小范围：从用户行为、组件 API、状态来源、core 逻辑、框架适配、DOM 输出和样式结果逐层确认。不要只盯着报错点或视觉结果附近反复 patch。
- 每次修复都要能说清楚“根因是什么、证据是什么、为什么这个改动能解决”，不能把猜测写进代码，也不能用兼容性分支掩盖未确认的根因。
- 不要把另一个框架或另一个 app 的约定直接搬到当前目标；多框架实现要保持行为一致，但写法要符合各自框架最佳实践。
- 保持改动聚焦：只改和任务直接相关的文件，不做顺手重构、不改无关格式、不清理用户已有改动。
- 默认不运行 `typecheck`、`lint`、`build`、`format`，除非用户明确要求。需要检查运行效果时，优先使用已有本地服务地址；不要为了查看页面主动启动服务，除非用户要求。
- 新增依赖要谨慎，优先使用 workspace 内已有包和平台标准能力；确需新增时说明原因，并放到正确 package 的依赖字段。

## 代码组织

- 应用内通用 UI 放在对应 app 的 `src/components`；跨应用、跨框架或可沉淀的能力放到 `packages/*`。
- 页面级代码放在对应 app 的 `src/pages` 或该 app 既有路由目录中；服务请求放在 `src/service`；mock 数据放在 `src/mock`；布局放在 `src/layouts`。
- 组件示例页面默认使用目录化组织，避免后续示例覆盖更多特性时把所有内容塞进单文件；例如 React 使用 `src/pages/Button/index.tsx`，Vue 使用 `src/pages/Button/index.vue`，Solid 使用 `src/pages/Button/index.tsx`，Angular 使用 `src/pages/button/index.component.ts`。SvelteKit 按自身约定使用 `src/routes/<route>/+page.svelte`。
- 应用路由必须独立放在 `src/routes` 目录中，并按模块划分子目录，例如 `src/routes/base`、`src/routes/components`、`src/routes/system`；不要把路由表散落在 `App.tsx`、`main.tsx` 或页面文件里。应用入口只负责挂载 Router/Outlet/Routes，不承载具体业务路由清单。
- 路由页面默认按路由懒加载，避免首屏全量加载所有页面模块：React 必须封装统一的 lazy route helper，内部使用 `lazy`、`Suspense`、加载 fallback 和错误兜底，路由表里不要每次手写 `lazy(...then...)`；Vue Router 使用 `component: () => import(...)`，Solid 使用统一 lazy helper 或 `lazy`，Angular 使用 `loadComponent`，SvelteKit 依赖文件路由自动分块。只有极小的基础首页或框架限制场景可以同步导入，并要保持理由清晰。
- 新增页面后必须同步注册到该 app 的实际路由模块，例如 React/Solid/Vue/Angular 的 `src/routes/**`；SvelteKit 使用文件路由时也要按模块目录组织。不能只创建页面文件不接路由。
- 文件命名要清晰、稳定、便于搜索。组件名表达业务含义，避免用 `Base`、`Common`、`Manager` 这类过宽泛的名字承载复杂职责。
- 框架特有的通用逻辑要沉淀到对应框架组件包内，组件库和对应 app 都优先复用，不要在 app 里再写一套同类能力。
- React 通用 hook 放在 `packages/components/react/src/hooks`。
- Vue 通用组合式逻辑放在 `packages/components/vue/src/composables` 或该包既有同类目录。
- Solid 通用响应式 primitive、hook、store helper 放在 `packages/components/solid/src/primitives`、`packages/components/solid/src/hooks` 或该包既有同类目录。
- Svelte 通用 store、action、rune/helper 放在 `packages/components/svelte/src/stores`、`packages/components/svelte/src/actions`、`packages/components/svelte/src/utils` 或该包既有同类目录。
- Angular 通用 signal helper、service、directive、pipe、form helper 放在 `packages/components/angular/src` 下按能力分层，例如 `signals`、`services`、`directives`、`pipes`、`forms`。
- 新增框架公共能力后必须通过对应 package 的 `package.json` 子路径 `exports` 暴露，优先使用文件级 pattern，例如 `./hooks/*`、`./composables/*`、`./primitives/*`、`./stores/*`、`./actions/*`、`./signals/*`。不要用 `src/index.ts` 或 `src/hooks/index.ts` 这类桶文件聚合导出，也不要让业务侧使用深层私有路径。
- 同一框架组件包内不把 `primitive`、`ui`、`hooks`、`composables`、`icon`、`pro` 拆成独立 package；它们是同一个框架 package 下的公开分层目录，由该 package 的 `exports` 统一管理。
- 框架组件包的 `package.json` exports 必须按类别分组保持清晰，组件相关入口集中在一起：先集中列出 `./primitive/*`，再集中列出 `./ui/*`，再集中列出 `./pro/*`，再集中列出 `./icon/*`。组件入口不要再提供无层级的 `./button`、`./card` 这类根级快捷路径。非组件逻辑能力放在组件入口之后，再按类别集中列出 `./hooks/*` / `./composables/*` / `./primitives/*` / `./stores/*` / `./actions/*` 等。不要按单个组件把 `./primitive/button`、`./ui/button`、`./pro/button`、`./icon/loading`、`./primitive/card`、`./ui/card` 交错排列。
- 每个框架组件包都要沉淀本框架的通用能力，不允许只有 React 有 hooks，Vue/Solid/Svelte/Angular 在各组件里重复写同类逻辑。凡是两个以上组件需要的能力，例如 class 合并、受控/非受控状态、订阅 core store、合并 ref/element、读取最新值、挂载/卸载清理、portal/container 解析、外部点击关闭、键盘关闭等，都必须抽到对应框架公共目录并通过 exports 暴露。
- 只有跨组件、跨业务、可被用户直接复用的能力才能放到框架级 `hooks`、`composables`、`primitives`、`stores` 等公共目录。只服务某个组件族内部的 context、provider、use-xxx-context、slot props adapter、dismiss registry 等私有能力，必须放在该组件目录内，例如 `src/primitive/popover/context.ts` 或同目录私有 helper，不要放到全局 `src/composables` / `src/hooks` 造成“看似公共、实际私有”的 API。
- 多组件组合时区分容器组件和逻辑组件：
  - 容器组件只负责组装、布局、转发 props、协调兄弟组件。
  - 逻辑组件负责具体交互和 UI。
  - 复杂逻辑优先拆成 `use-xxx` hook、组合式函数、store 片段或纯函数，再由 UI 组件消费。
- 上面的分层适用于所有 UI 库，不只是 React。Vue、Solid、Svelte、Angular 都要区分容器、逻辑和展示边界。
- 复杂逻辑组件建议继续拆成“逻辑单元 + UI 展示”：
  - React：逻辑放到 `use-xxx` hook，组件只调用 hook 并渲染 UI。
  - Vue：逻辑放到 composable，组件只消费 composable 返回的状态和事件方法。
  - Solid：逻辑放到 primitive、store helper 或 resource 封装，组件只连接响应式数据和 UI。
  - Svelte：逻辑放到 store、action、rune/helper 或普通模块函数，组件只负责状态绑定和模板展示。
  - Angular：逻辑放到 signal helper、service、directive、form helper 或组件内清晰的私有方法，模板只绑定 signal/computed 和事件。
- UI 展示层不要直接混入请求、权限、复杂数据转换、跨组件通信和副作用监听；这些逻辑应在容器、service、adapter 或框架专属逻辑单元中处理。
- Popover、Dialog、Menu、Select、Tree、Table 等复杂组件必须提供可单独消费的逻辑层：React 暴露明确的 `useXxx` / `useXxxPart` hook，Vue 暴露面向自定义 UI 的 composable 或 slot props，Solid/Svelte/Angular 暴露各自框架等价能力。默认 UI 只能是这些逻辑能力的一个消费方，用户不喜欢默认 UI 时，应能基于逻辑层快速实现自己的 DOM 和样式。
- 组件私有 context hook 不等于可复用逻辑层。`usePopoverContext` 这类只读取内部 provider 的函数只能服务内置子组件，不能当作用户自定义 UI 的公开逻辑 API。
- 状态尽量靠近使用处；只在多个远距离节点确实共享时提升。不要为了“方便传参”创建过大的全局状态或 Context。
- 不保留重复状态。能由 props、路由参数、服务数据、表单值推导出来的数据，优先推导，不额外存一份。
- 复杂数据转换优先放在 service 层、adapter 函数或纯工具函数中，组件只消费适合渲染的数据结构。

## 事件优先

- 所有框架都要少用监听模式，多用事件模式。用户点击、分页变化、筛选变化、表单提交、弹窗开关、选择项变化等，都应在对应事件回调中直接处理。
- 不要先修改 state/signal/ref/store，再用 `useEffect`、`watch`、`createEffect`、Svelte reactive effect、Angular `effect` 去监听变化补业务逻辑。这样链路分散，追踪定位困难，长期会变得很难维护。
- 派生数据使用框架的派生能力：React 渲染期计算或必要时 `useMemo`，Vue `computed`，Solid `createMemo`，Svelte 派生机制，Angular `computed`。
- 副作用只用于同步外部系统，例如订阅、DOM 命令式 API、浏览器 API、WebSocket、第三方库实例、日志上报等。普通业务流转不要放进副作用监听里。
- 如果确实必须监听状态变化，要把原因、监听来源、触发条件、清理逻辑写清楚，并优先使用仓库已有的公共 hook/composable/primitive/helper。

## React 规范

- React 项目基于 React 19；优先使用 React 19 推荐 API 和新 hook。
- React API 使用具名导入，例如 `import { use, useActionState, useDeferredValue, useEffectEvent, useOptimistic, useState, useTransition } from 'react'`，避免在业务代码里写大量 `React.useState`。
- 写 React 逻辑前必须先查看 `packages/components/react/src/hooks` 是否已有 hook，已有能力直接复用，不要手写重复实现。
- 不新增 `forwardRef` 风格代码；React 19 中 ref 可作为 prop 传递时，优先按新模式设计组件 API。
- Context 使用 React 19 写法：渲染时优先使用 `<SomeContext value={value}>`，读取时优先使用 `use(SomeContext)`。
- 能使用 React 19 新 hook 改善可维护性时要优先使用：
  - `useEffectEvent`：用于 effect 内需要读取最新 props/state、但不应该把这些值加入依赖导致重复订阅或重复执行的事件逻辑。
  - `useActionState`：用于表单提交、异步 action、提交状态和错误状态管理，避免手写一堆提交中的 state。
  - `useOptimistic`：用于明确的乐观更新场景，避免把临时 UI 状态和服务端真实状态混在一起。
  - `useTransition`：用于非紧急 UI 更新，例如筛选大列表、切换复杂视图，避免阻塞输入和点击反馈。
  - `useDeferredValue`：用于输入值驱动昂贵渲染时延迟下游渲染，不要用防抖 state 代替所有场景。
  - `use`：用于读取 Context 或符合 React 19 模式的异步资源。
- 少用 `useCallback`、`useMemo`、`useEffect`。这些 API 不是默认性能优化手段，只有在昂贵计算、订阅外部系统、同步非 React 状态等明确场景才使用。
- 稳定函数引用不要优先写 `useCallback`，统一优先使用 `use-memoized-fn.ts` 提供的 `useMemoizedFn`。只有它不能满足语义时，才考虑 `useCallback`，并说明原因。
- 需要读取最新值但避免闭包过期时，优先使用 `use-latest.ts`、`use-as-ref.ts` 或 React 19 的 `useEffectEvent`，不要手写 `useRef + useEffect` 同步最新值。
- mount/unmount 逻辑优先使用 `use-mount.ts`、`use-unmount.ts`，不要每次手写空依赖 `useEffect`。
- 只在依赖更新后执行的逻辑优先使用 `use-update-effect.ts`、`use-update-layout-effect.ts` 或 `create-update-effect.ts`，不要手写 `isFirstRender` 标记。
- 生命周期类逻辑必须优先使用 `packages/components/react/src/hooks` 中已有生命周期 hook，例如 `useMount`、`useUnmount`、`useUpdateEffect`、`useUpdateLayoutEffect`、`useIsomorphicLayoutEffect`、`useAsyncEffect`。不要直接手写 `useEffect` 来模拟生命周期。
- 需要强制刷新时优先使用 `use-update.ts`；需要懒初始化稳定对象时优先使用 `use-lazy-ref.ts`。
- 受控和非受控并存的组件必须优先使用 `use-controllable-state.ts`，不要在组件里手写两套状态分支。
- 异步 effect 优先使用 `use-async-effect.ts`；涉及 SSR/CSR layout effect 差异时使用 `use-isomorphic-layout-effect.ts`。
- 事件发布订阅优先使用 `use-event-emitter.ts`；复制文本优先使用 `use-copy-to-clipboard.ts`；移动端判断优先使用 `use-mobile.ts`。
- 如果必须使用 `useCallback`、`useMemo` 或原生 `useEffect`，要在附近写简短注释说明为什么需要、依赖来自哪里、哪些变化会触发重新计算或重新执行。
- 优先事件驱动，少用监听模式。例如分页、筛选、表单提交等逻辑应在对应事件回调中处理，不要先监听 state 变化再补做业务逻辑。
- effect 只处理外部系统同步，例如订阅、DOM 命令式 API、网络连接、浏览器 API。不要用 effect 做普通派生数据、表单联动、分页请求入口的替代品。
- 组件同时支持受控和非受控时，必须先复用 `useControllableState`；如果现有 hook 不满足需求，先考虑扩展公共 hook，而不是在业务组件里手写第二套。
- 列表渲染必须使用稳定 key；不要用数组下标作为可变列表 key。
- 避免在 render 中创建会导致子组件大面积重渲染的临时对象、临时数组和内联组件定义；确实需要稳定引用时再使用合适 hook，并说明原因。

## Vue 规范

- Vue 代码优先使用 Composition API 和 `<script setup>`，逻辑按可复用 composable 拆分。
- Vue UI 组件默认使用 SFC + `<template>` 表达结构，尤其是层级较多、slot 较多、状态分支较多的组件。不要为了和其它框架写法表面一致，把 Vue UI 写成大段 `h()` / render function；只有动态组件工厂、极小无结构封装、需要完全程序化生成 vnode 的明确场景才允许使用 `h()`，并要在代码附近说明原因。
- Vue 组件结构和交互逻辑要分离：复杂交互放 composable、组件私有 helper 或 core adapter，SFC 负责模板、绑定和事件转发。不要把大量状态机、DOM 订阅、跨组件通信和样式拼装混在同一个 SFC 里。
- 使用 `ref`、`computed`、`watch`、`watchEffect` 时要区分职责：派生数据用 `computed`，事件逻辑放事件回调，外部副作用才用 `watch`。
- Vue 也要少用 `watch`、`watchEffect`。不要用监听模式串联分页、筛选、表单、弹窗等普通业务流程，优先在事件回调里处理。
- 少用深度监听和大对象响应式。大型静态配置优先使用普通常量、`shallowRef`、`markRaw` 或拆成更小响应单元。
- `watch` / `watchEffect` 必须有明确原因，不要用它替代事件回调；如果监听多个来源，要保证依赖来源清晰。必须使用时要在附近写简短注释说明监听的是哪个外部系统或框架边界、为什么不能用事件回调或 `computed`、清理逻辑在哪里。
- 模板中避免调用昂贵函数；需要派生的展示值优先使用 `computed`。
- 组件 props 和 emits 要显式声明类型，双向绑定使用清晰的 `v-model` 命名，不要隐式修改 props。
- 列表渲染必须使用稳定 `:key`，不要用数组下标作为可变列表 key。

## Solid 规范

- Solid 以细粒度响应为核心，优先使用 signal、memo、resource 等原生响应能力，不要套用 React 的重渲染思路。
- 派生数据用 `createMemo`，外部副作用用 `createEffect`；不要用 effect 写普通数据转换。
- 事件回调中处理业务动作，避免通过 effect 监听 signal 再补做业务逻辑。
- 少用 `createEffect` 串联业务状态变化；它应主要服务外部副作用，而不是替代事件回调。
- props 解构要谨慎，避免破坏响应性；需要拆分 props 时使用框架推荐工具或保持访问器形式。
- 列表使用 `<For>`，条件渲染使用 `<Show>`、`<Switch>`，避免手写低效数组映射造成响应边界不清。
- 大型状态按业务边界拆分 store，避免一个 store 变化牵动无关 UI。

## Svelte 规范

- Svelte 代码要利用编译期响应能力，保持状态声明简单直接，避免把简单交互写成复杂 store。
- 派生值使用框架推荐的派生机制；副作用只用于外部系统同步，不要用副作用替代普通赋值或事件回调。
- store 只用于跨组件共享或复杂领域状态，局部 UI 状态放在组件本地。
- 事件处理函数中完成用户动作对应逻辑，不要绕到全局订阅再处理。
- 少用订阅或 reactive effect 串联普通业务流程；能在事件里完成的逻辑不要拆到监听里。
- 列表渲染使用稳定 keyed each，避免可变列表复用错误 DOM。
- 组件 props、事件和 slot 要保持明确，避免一个组件同时承担页面、数据请求、布局、复杂交互四种职责。

## Angular 规范

- Angular 代码采用 Signal-first 思路：优先使用 `signal`、`computed`、`effect`、signal inputs/outputs、resource 等现代 Angular 响应能力组织状态和异步数据。
- Angular 顶层或核心元素的用户扩展 class 必须通过原生 `class="..."` 传入并自动合并，不设计 `customClass`、`hostClass`、`xxxClass` 这类替代属性。多个组件都需要读取并合并宿主初始 class 时，必须沉淀为 Angular 公共 signal/helper/directive，不要在每个组件里重复写 `ElementRef + getAttribute('class') + cn(...)`。
- `signal` 管理本地可变状态，`computed` 管理派生数据，`effect` 只用于外部系统同步；不要用 `effect` 监听 signal 再补做普通业务逻辑。
- Angular 也要少用监听式 `effect` 串联业务流程；用户动作、表单变化、分页筛选等优先在事件处理或表单回调中完成。
- 组件优先使用 standalone component、强类型表单和清晰的依赖注入边界。
- 组件按 `OnPush` 和细粒度响应的思路设计，减少不必要的模板重算和子树更新。
- 模板表达式保持轻量，不调用昂贵函数；复杂展示值放到 signal、computed、pipe 或组件字段中。
- 列表渲染必须使用 `trackBy` 或新控制流的 `track`，不要让 Angular 以对象引用猜测列表身份。
- RxJS 仍然可以使用，但不再作为普通组件状态的默认方案。它适合事件流、复杂异步流、取消/合并/节流、WebSocket、路由或第三方库 Observable 边界。
- RxJS 和 Signal 互通时优先使用 `@angular/core/rxjs-interop`，例如 `toSignal`、`toObservable`、`rxResource`；不要在组件里反复手写订阅同步状态。
- 订阅要有清晰生命周期，优先使用 `async` pipe、`takeUntilDestroyed`、`toSignal` 自动清理或框架提供的清理能力。
- Angular 的 inline template 只允许用于极短的单节点投影或空模板，例如 `<ng-content />`、`''` 这类一眼能读完的场景。只要模板包含多个并列元素、结构分支、绑定较多、插值、重复 SVG、或需要换行排版，就必须使用独立 `.html` 文件；不要把 10 行、20 行甚至更长的模板字符串塞在 `.ts` metadata 里。如果一段模板代码重复出现了两次，应提取为组件、模板片段或共享 icon，而不是在多个地方复制；SVG 也遵循同样规则，比如有两个地方使用相同 icon 必须提取后引用。
- 如果是顶层或者核心元素需要扩展`class`，不要自定义一个属性名传入`class`，而是做合并，顶层或者核心元素用户扩展`class`只能是`class='bg-muted-background'`

## 跨框架组件与性能

- 跨框架组件应优先把无框架逻辑沉淀到 `packages/components/core`，再在各框架包里适配。
- 同一类能力如果 React、Vue、Solid、Svelte、Angular 都会用，先抽出纯逻辑、类型和算法到 `packages/components/core` 或 `packages/utils`；各框架包只封装生命周期、响应式绑定、DOM 适配和框架 API。
- 纯展示组件如果没有跨框架共享的状态机、算法、交互协议、数据转换或复杂可访问性行为，不要为了“统一”强行创建 core 层；设计 token、全局变量和基础 Tailwind source 配置放在 `packages/styles`，组件自身的 class 组合、variant、size、状态样式和 data attribute 规则必须沉淀到 `packages/components/styles`，各框架组件只做 props、slot/children、class 合并、原生属性透传和事件透传等薄封装。
- 只有当展示组件演进出必须跨框架保持一致的行为逻辑时，才引入 `packages/components/core`，例如受控/非受控状态、键盘导航、选择模型、焦点管理、弹层协议、复杂 ARIA 行为或非平凡 variant 计算；不要仅仅为了复用 class 字符串或简单 props 映射而增加 core 抽象。
- 简单组件优先使用单文件实现和文件级子路径导出，例如 `src/button.tsx`，Props 类型、组件类型和少量局部 helper 直接在组件文件内声明并按需导出，通过 `package.json` 的 `exports` 暴露 `./button`；不要为了单个组件提前创建 `button/index.ts`、`button/index.tsx`、`button.types.ts` 或模板化目录。只有当组件出现多个强相关文件、子组件、feature、hook/composable/primitive、locale、adapter、测试或文档需要共同归组时，才升级为 `src/button/button.tsx` 等目录结构；目录内也不要使用 `index.ts` 作为桶文件，类型文件只在多文件共享复杂公共类型时按需创建。
- 复杂跨框架组件如果需要在 core 中维护可变状态并通知 UI 刷新，必须优先沉淀一套可复用的 core store/subscription 基础设施，例如 `getSnapshot`、`subscribe`、`setSnapshot`、`updateSnapshot`，由 Tree、Dialog、Popover、Menu、Table 等 controller 复用；不要在每个组件里重复实现一套发布订阅、监听集合、通知循环或状态快照管理。
- 各框架包也必须沉淀统一的 core store 适配层，例如 React hook、Vue composable、Solid primitive、Svelte store/action、Angular signal helper，用来桥接 core 的 `getSnapshot + subscribe` 到本框架响应式系统；不要在每个组件适配层里重复写订阅、取消订阅和快照同步逻辑。
- core store/subscription 只负责通知“状态快照已变化”，业务语义必须通过明确的 controller action 和纯 reducer 表达，例如 `expand`、`collapse`、`open`、`close`、`select`、`moveFocus`；不要把普通业务流转设计成到处 `emit/on` 的事件总线。
- 框架特有的通用能力必须放回该框架组件包，例如 React hooks、Vue composables、Solid primitives、Svelte stores/actions、Angular signal helpers/services/directives，不要散落在 app 里。
- 公共组件 API 要稳定、语义清晰、少暴露内部实现。不要让调用方依赖 DOM 结构、私有 class 或内部状态名。
- 大列表、表格、树、选择器等高频组件要关注渲染规模，必要时使用虚拟列表、懒渲染、分页、局部更新或增量计算。
- 组件输入数据要保持结构清晰；不要让组件内部猜字段、改原对象或悄悄补数据。
- UI 组件要支持可组合，不要把请求、权限、路由、埋点、弹窗状态全部塞进一个基础组件。

## 组件与样式

- 写 UI 前先查 `packages/components/*` 和当前 app 的 `src/components` 是否已有可复用组件，特别是按钮、弹窗、表单项、表格、布局类组件。
- 样式优先使用 `@fex/styles` 提供的全局变量、主题、工具类和既有 CSS 分层；不要在业务组件中复制大段主题色、阴影、间距规则。
- `packages/components/*` 中的 UI 组件实现文件不要直接书写具体 Tailwind 样式；组件默认样式、尺寸、variant、状态样式、slot 样式必须统一放到 `packages/components/styles/src/<component>.ts`，通过 `class-variance-authority` 导出类似 `buttonClassName` 的 className 生成函数，各框架组件只调用这些函数，并必须使用 `@fex/utils` 的 `cn` 显式合并用户传入的 `class`/`className`，不要依赖 `cva` 或框架自身的隐式合并。
- `packages/components/styles` 中每新增一个组件样式模块，都必须同步在该包 `package.json` 的 `exports` 中暴露文件级子路径，例如 `./button`、`./card`；业务和框架组件只能通过公开子路径导入，不要导入 `src/**` 私有路径。
- 页面级布局、组件与组件之间、示例区块之间的 padding、margin、gap 优先使用系统 spacing token，并受密度策略影响；但组件内部的规格化尺寸和间距，例如 Button 的高度、内部 px/gap、Card 的 content inset/header gap/footer padding，必须按组件设计规格使用固定值或组件私有 CSS 变量，不要直接绑定 `--space-*`，避免切换 density 后基础组件内部视觉被动变形。
- 组件默认圆角统一使用 `rounded-md` / `var(--radius-md)`，当前为 8px。Button、Input、Select、Textarea、Card、Dialog、Popover、Dropdown、Sheet 等基础控件和容器组件默认都用 md；只有明确的组件设计规格或特殊场景需要更大/更小圆角时，才允许局部覆盖，并要保持同类组件一致。
- padding、margin、gap 等 spacing class 要优先使用最简表达；四边相同写 `p-space-*`，横纵不同才写 `px-space-* py-space-*`，单边不同才写具体方向，避免无意义重复。
- 每个 UI 库都必须显式分层为 `primitive` 和 `ui`，其中 `primitive` 只承载底层结构、基础行为和最小样式协议，`ui` 承载面向业务的推荐封装和默认组合；少数真正复杂且高复用的工作流型组件可以额外有 `pro` 层，但 `pro` 只用于数据表、复杂表单、远程选择器这类明确的工作流封装。
- 当前约定不把同一框架内的 `primitive`、`ui`、`hooks`、`icon` 拆成多个 package；按框架一个 package 管理，包内按类别目录分层。边界以该框架 package 的公开 `exports` 为准，业务侧和示例侧都只能通过公开子路径导入。
- 跨框架 primitive 中凡是需要把行为挂到调用方元素上的能力，例如 Trigger、Close、Item、Anchor 等，统一使用 render prop / slot props / template context 传出 `props`、`ref` 或框架等价绑定能力、`state`；禁止把 `asChild` 作为公共 API，也不要用 clone child、隐式增强子节点或要求用户组件转发 ref 作为基础范式。
- 组件的 demo 和文档必须同时覆盖 `primitive`、`ui`，如果某个组件存在 `pro` 层也必须一并覆盖；demo 页面要用统一的 `Card` 容器承载各段示例，不能再手写散落的 section 容器。
- `ui` 层的结构化 API 要优先采用显式对象形态来承载部件级样式与状态，例如 `partClassName`、`partStyle`、`slotProps` 之类的清晰结构，不要把 header/content/footer 等部件的样式塞进扁平 props，也不要让调用方依赖 DOM 深层 class。
- `ui` 组件如果暴露多个部件的 class/style，必须使用结构化对象 API，不要新增 `headerClassName`、`contentClassName`、`footerClassName`、`headerStyle`、`contentStyle` 这类扁平 props。统一优先使用类似 `className={{ header, content, footer }}` / `class={{ header, content, footer }}`、`style={{ header, content, footer }}`、`partClassName`、`partStyle` 的对象形态；具体命名按框架习惯保持一致。primitive 层优先只承载宿主元素 class/style 合并，复杂部件定制主要放在 ui 层。
- 新增组件样式前必须先参考 `packages/components/styles/src/button.ts` 的组织方式：基础 class 用数组拼接，variant/size/effect 等用 `cva` 表达，组件包实现只消费样式函数，不把默认样式散落在 React/Vue/Solid/Svelte/Angular 文件里。
- 样式命名和组件结构要支持扩展，不要依赖脆弱的深层选择器覆盖。
- 管理后台界面应以信息密度、可扫描性、稳定布局和可维护交互为优先，不做营销页式的大面积装饰。
- `packages/components/*` 下新增或修改对外组件时，必须同步补充详细完整的 Markdown 文档。
- 组件文档必须包含组件用途、导入路径、核心使用示例、Props 表格、事件/回调说明、受控/非受控说明、注意事项和常见组合方式。
- 新增或修改对外组件时，必须同步在对应框架 app 中增加同名示例路由，例如 Button 对应 `/button`；示例页必须按组件示例页面目录化规则放置，例如 `src/pages/Button/index.tsx`、`src/pages/Button/index.vue`、`src/pages/button/index.component.ts` 或 SvelteKit 的 `src/routes/button/+page.svelte`，不要另起不符合项目结构的页面文件位置。暂时不要依赖 docs app 承载组件示例。示例必须完整覆盖组件公开 props、每个 variant/size/effect、loading、icon、禁用态、受控/非受控等关键状态，不能只放一个最小用法。
- 组件实现、Markdown 文档和各框架 app 示例必须作为同一批改动一起完成；如果组件支持多框架实现，各框架示例都要使用本框架组件包的公开 exports 子路径，不要导入 `src/**` 私有路径。
- 多框架组件 demo 以 React demo 为唯一基准：优先先更新 React 组件代码和 React demo；只有在用户明确要求“同步其它框架”时，才同步 Vue/Solid/Svelte/Angular demo。同步时其它框架 demo 的样式、布局、排版、交互方式、示例顺序、展示文案和使用方式必须与 React demo 保持一致，只允许因框架语法差异做等价改写。
- Props 必须使用 Markdown table 展示，至少包含参数名、类型、默认值、是否必填、说明。
- 核心使用示例必须是可复制粘贴即可运行的完整代码片段，不能只写伪代码或省略关键导入。
- 如果组件支持多框架实现，各框架示例要分别给出对应导入路径和最小可运行用法。
- `packages/components/core` 中的核心逻辑、算法、状态机、数据结构转换、边界处理必须写必要注释，说明设计原因、输入输出约束和关键分支，不要只靠调用方猜。
- 复杂组件或特性很多的组件必须采用按需特性实现：核心组件只保留基础能力，扩展能力拆成独立 feature、hook/composable/primitive、子组件、插件式配置或子路径导出。
- 不要把表格、筛选、选择、弹窗、权限、请求、虚拟滚动、拖拽等所有能力堆进一个巨大组件；按业务和渲染边界拆分，调用方按需组合。

## TypeScript 与 API

- 类型应服务可读性和约束力，避免为了炫技写难以维护的复杂泛型。
- 所有代码必须保证类型安全。能写明确类型的地方就写明确类型，让类型约束真实业务结构，不要靠猜和补丁通过。
- 尽量少用甚至不用 `any`。如果确实需要接收未知外部数据，优先使用 `unknown`，并通过类型守卫、schema 校验或明确的 adapter 转成业务类型。
- 尽量少用 `as` 类型断言。优先通过函数返回类型、泛型约束、类型守卫、判空收窄、判别联合、`satisfies` 等方式让 TypeScript 自然推导。
- 不要使用 `as unknown as Xxx`、`as any` 这类绕过类型系统的写法，除非是在极少数框架或第三方库类型缺陷场景，并且必须写注释说明原因、边界和后续可移除条件。
- 对象字面量满足某个配置或映射类型时，优先使用 `satisfies`，避免把真实字段类型强行抹平。
- 公共 API、组件 props、事件参数、服务返回值、mock 数据和工具函数返回值必须有清晰类型，不要把类型压力留给调用方。
- 组件 props 类型放在组件附近；多处共享的领域类型放到对应 app 的 `src/types` 或合适的 package 中。
- 公共包的 API 边界以 `package.json` 的 `exports` 为准。按能力设置文件级子路径导出，例如 `@fex/components/react/hooks/use-memoized-fn`、`@fex/components/vue/composables/use-xxx`、`@fex/utils/tree`。
- 避免把所有内容塞进 `src/index.ts` 或 `src/**/index.ts` 大桶文件；`index.ts` 只保留非常稳定、体积极小、确实属于包根入口的 API。
- 业务代码只能导入 package 暴露的 exports 子路径，不要导入 `src/**`、`dist/**` 或组件包内部私有文件。
- 工具函数保持纯净、可测试、无 UI 框架依赖；涉及 DOM、浏览器 API 或框架生命周期的逻辑不要放进通用 utils。

## Mock、服务与数据流

- mock 能力优先放在 `packages/mock` 或对应 app 的 `src/mock`，不要把假数据硬编码在组件深处。
- 服务请求放在对应 app 的 `src/service`，页面和组件通过清晰的函数调用获取数据，不直接散落 fetch 细节。
- 数据转换优先放在 service 层或专门的 adapter 函数中，组件只消费适合渲染的数据结构。

## 配置与脚本

- Nx target 以各 package/app 的 `project.json` 为准。
- 通用 lint/format/tsconfig 配置优先从 `configs/*` 复用，不在单个项目里复制一份。
- 常用脚本：
  - `pnpm dev`：并行启动所有 dev target。
  - `pnpm dev:react`、`pnpm dev:vue`、`pnpm dev:solid`、`pnpm dev:svelte`、`pnpm dev:angular`：启动单个管理端。
  - `pnpm dev:docs`：启动文档站。
  - `pnpm typecheck`、`pnpm lint`、`pnpm build`、`pnpm check`：只在用户要求时运行。

## 文档与注释

- 公共能力、新组件、新约定需要补充必要文档，优先放在 `apps/docs/content` 或相关 package 附近的现有文档位置。
- 注释只解释“不明显的原因”和“约束”，不要复述代码做了什么。
- 临时方案、兼容逻辑、非直觉依赖必须说明原因，避免后续维护者误删或误改。

## 本地访问端口

- 本地预览和浏览器验证必须优先使用固定端口，不要猜测 Vite 或框架默认端口。
- Angular admin：`http://127.0.0.1:4000`。
- React admin：`http://127.0.0.1:4001`。
- Solid admin：`http://127.0.0.1:4002`。
- Svelte admin：`http://127.0.0.1:4003`。
- Vue admin：`http://127.0.0.1:4004`。
- 访问组件示例时直接在对应端口拼接组件路由，例如 React Button 使用 `http://127.0.0.1:4001/button`，Vue Button 使用 `http://127.0.0.1:4004/button`。

## 开发阶段验证

- 开发阶段默认不要运行 `build`。除非用户明确要求构建、发布前验证、排查仅生产构建出现的问题，或者用户直接要求运行对应命令，否则不要主动执行 `pnpm build`、`nx build` 或各 app/package 的 build target。
- 修改组件、样式和示例页后的优先验证方式是使用固定本地端口打开真实页面，直接在浏览器里检查 DOM、computed style、动画和交互表现。
- 新增或修改组件 demo、示例路由、导航入口后，必须在对应固定端口用浏览器实际打开页面验证，不能只依赖 typecheck 或凭代码判断。验证至少包括：页面能打开且无运行时红屏/控制台错误；示例入口能点击；弹窗、浮层、菜单等交互组件必须实际触发一次打开和关闭；React/Vue/Solid/Svelte/Angular 多框架同步 demo 时，必须抽查各框架页面的关键样式规格是否一致，例如按钮尺寸、间距、弹层位置、footer 布局和遮罩效果。发现任一框架打不开或视觉明显不一致，必须先修复并重新浏览器验证后再交付。
- 需要做类型层面的快速确认时，优先只跑受影响项目的 `typecheck`；不要把 `build` 当作日常开发验证手段。
- `@fex/styles` 的 Tailwind `@source` 必须统一配置在 `packages/styles/src/index.css`，覆盖 apps 和 packages/components 下所有会书写 class 的源码文件类型，例如 `ts`、`tsx`、`vue`、`svelte`、`html`。不要在具体组件、具体组件样式文件或 `packages/components/styles` 里维护人工 `@source inline(...)` 清单。
