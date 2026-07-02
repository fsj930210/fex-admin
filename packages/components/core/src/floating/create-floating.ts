import {
  arrow,
  autoUpdate,
  computePosition,
  flip,
  hide,
  limitShift,
  offset,
  shift,
  size,
  type Boundary,
  type Middleware,
  type Padding,
  type Strategy,
  type VirtualElement,
} from '@floating-ui/dom'
import { createStore } from '../store/create-store'
import {
  getPlacement,
  partsFromPlacement,
  type FloatingAlign,
  type FloatingPlacement,
  type FloatingSide,
} from './placement'
import { getTransformOrigin, patchFloatingVars } from './vars'

const defaultCollisionPadding = 8
const defaultArrowPadding = 32

export interface FloatingOptions {
  placement?: FloatingPlacement | undefined
  side?: FloatingSide | undefined
  align?: FloatingAlign | undefined
  sideOffset?: number | undefined
  alignOffset?: number | undefined
  offset?: number | undefined
  strategy?: Strategy | undefined
  avoidCollisions?: boolean | undefined
  autoAdjustOverflow?: boolean | undefined
  collisionBoundary?: Boundary | undefined
  collisionPadding?: Padding | undefined
  arrow?: boolean | undefined
  arrowPadding?: number | undefined
  matchReferenceWidth?: boolean | 'min' | undefined
  hideWhenDetached?: boolean | undefined
  zIndex?: number | undefined
}

export interface FloatingSnapshot {
  placement: string
  side: FloatingSide
  align: FloatingAlign
  referenceHidden: boolean
  escaped: boolean
}

export interface Floating {
  getSnapshot: () => FloatingSnapshot
  subscribe: (listener: () => void) => () => void
  setOptions: (options: FloatingOptions) => void
  setReferenceElement: (element: HTMLElement | null) => void
  setFloatingElement: (element: HTMLElement | null) => void
  setArrowElement: (element: HTMLElement | null) => void
  setVirtualReference: (reference: VirtualElement | null) => void
  update: () => Promise<void>
  startAutoUpdate: () => void
  stopAutoUpdate: () => void
  destroy: () => void
}

function createInitialSnapshot(options: FloatingOptions): FloatingSnapshot {
  // 初始 snapshot 来自用户传入的 placement/side/align。
  // 真正挂载 DOM 后，computePosition 可能因为 flip/shift 得到新的最终 placement。
  const placement = getPlacement(options)
  const parts = partsFromPlacement(placement)
  return { placement, side: parts.side, align: parts.align, referenceHidden: false, escaped: false }
}

function isSameSnapshot(left: FloatingSnapshot, right: FloatingSnapshot) {
  // 只比较 adapter 需要感知的语义字段。
  // x/y/尺寸写在 CSS 变量里，不进入 snapshot，避免滚动或 resize 时触发大面积框架渲染。
  return (
    left.placement === right.placement &&
    left.side === right.side &&
    left.align === right.align &&
    left.referenceHidden === right.referenceHidden &&
    left.escaped === right.escaped
  )
}

export function createFloating(options: FloatingOptions = {}): Floating {
  let currentOptions = options
  let referenceElement: HTMLElement | null = null
  let virtualReference: VirtualElement | null = null
  let floatingElement: HTMLElement | null = null
  let arrowElement: HTMLElement | null = null
  let cleanupAutoUpdate: (() => void) | undefined
  let scheduledUpdate: ReturnType<typeof setTimeout> | number | undefined
  // 每次 options 或 DOM 引用变化都会增加版本号。
  // 异步 computePosition 返回时必须校验版本，防止旧 DOM 的计算结果覆盖新 DOM。
  let updateVersion = 0
  const store = createStore<FloatingSnapshot>(createInitialSnapshot(options))

  function setSnapshot(nextSnapshot: FloatingSnapshot) {
    // setSnapshot 是 floating 内部唯一写快照入口。
    // 统一去重可以保证 middleware 只写 CSS 变量时不会误触发 adapter 刷新。
    store.updateSnapshot((snapshot) => (isSameSnapshot(snapshot, nextSnapshot) ? snapshot : nextSnapshot))
  }

  function getReference() {
    // virtualReference 优先于真实 referenceElement。
    // ContextMenu 这类组件可以用鼠标坐标创建虚拟参考点，不需要真实 trigger DOM。
    return virtualReference ?? referenceElement
  }

  function clearScheduledUpdate() {
    // setOptions/ref 回调可能在同一帧内连续触发，先清理旧调度，保证最终只做一次补偿定位。
    if (scheduledUpdate === undefined) {
      return
    }
    if (typeof globalThis.cancelAnimationFrame === 'function') {
      globalThis.cancelAnimationFrame(scheduledUpdate as number)
    } else {
      clearTimeout(scheduledUpdate)
    }
    scheduledUpdate = undefined
  }

  function scheduleUpdate() {
    // 立即 update 可能发生在 DOM 刚挂载但样式尚未应用的时刻。
    // 再排一个 rAF 作为补偿，可以拿到更稳定的布局尺寸；无 rAF 环境退化为 setTimeout。
    clearScheduledUpdate()
    const run = () => {
      scheduledUpdate = undefined
      void update()
    }
    if (typeof globalThis.requestAnimationFrame === 'function') {
      scheduledUpdate = globalThis.requestAnimationFrame(run)
      return
    }
    scheduledUpdate = setTimeout(run, 0)
  }

  function getMiddleware(): Middleware[] {
    const placement = getPlacement(currentOptions)
    const placementParts = partsFromPlacement(placement)
    const detectOverflowOptions = {
      // 以 viewport 作为默认碰撞边界，符合后台组件库大多数弹层预期。
      // 如果业务需要限制在某个滚动容器内，可以通过 collisionBoundary 覆盖。
      rootBoundary: 'viewport' as const,
      padding: currentOptions.collisionPadding ?? defaultCollisionPadding,
      ...(currentOptions.collisionBoundary ? { boundary: currentOptions.collisionBoundary } : {}),
    }
    // Floating UI 的 middleware 会按数组顺序处理定位结果。
    // offset 必须放在最前面，让后面的碰撞检测基于“已经应用业务偏移”的位置计算。
    const middlewares: Middleware[] = [
      offset({
        mainAxis: currentOptions.sideOffset ?? currentOptions.offset ?? 0,
        crossAxis: currentOptions.alignOffset ?? 0,
      }),
    ]

    if (currentOptions.avoidCollisions ?? currentOptions.autoAdjustOverflow ?? true) {
      // 先用 flip 尊重用户传入的首选方向，在空间不足时才翻到相反方向；
      // 不默认用 autoPlacement，是因为 autoPlacement 会主动选择空间最大的方向，弱化 placement 的业务语义。
      middlewares.push(flip(detectOverflowOptions))
      if (placementParts.align === 'center') {
        middlewares.push(shift({ ...detectOverflowOptions, mainAxis: false, crossAxis: true }))
      } else {
        middlewares.push(
          shift({
            ...detectOverflowOptions,
            mainAxis: false,
            crossAxis: true,
            limiter: limitShift({
              // 非居中对齐时限制 shift 的最大位移，避免浮层为了贴合视口被推得离触发器太远，
              // 否则箭头和触发器会出现明显错位，用户会误以为浮层不属于当前 trigger。
              offset: ({ rects }) => Math.max(rects.reference.width, rects.reference.height) / 2,
            }),
          }),
        )
      }
    }

    middlewares.push(
      size({
        ...detectOverflowOptions,
        apply({ availableWidth, availableHeight, rects, elements }) {
          // size middleware 在 Floating UI 计算链路中直接拿到可用空间和参考元素尺寸。
          // 这里写 CSS 变量而不是把尺寸塞进 snapshot，是为了让各框架 adapter 不重复订阅尺寸变化，
          // 样式层可以直接用变量处理 max-width/max-height 或匹配 trigger 宽度。
          if (elements.floating !== floatingElement) {
            return
          }
          elements.floating.style.setProperty(
            '--floating-available-width',
            `${Math.max(0, Math.round(availableWidth))}px`,
          )
          elements.floating.style.setProperty(
            '--floating-available-height',
            `${Math.max(0, Math.round(availableHeight))}px`,
          )
          elements.floating.style.setProperty(
            '--floating-reference-width',
            `${Math.round(rects.reference.width)}px`,
          )
          elements.floating.style.setProperty(
            '--floating-reference-height',
            `${Math.round(rects.reference.height)}px`,
          )
          if (currentOptions.matchReferenceWidth === true) {
            elements.floating.style.width = `${rects.reference.width}px`
          } else if (currentOptions.matchReferenceWidth === 'min') {
            elements.floating.style.minWidth = `${rects.reference.width}px`
          }
        },
      }),
    )

    if (currentOptions.arrow && arrowElement) {
      middlewares.push(
        arrow({
          // arrow middleware 专门计算箭头在浮层内部的 x/y 坐标。
          // 自己用 DOMRect 计算会遗漏 flip/shift 后的最终位置，所以必须放进同一条 middleware 链。
          element: arrowElement,
          padding: currentOptions.arrowPadding ?? defaultArrowPadding,
        }),
      )
    }

    if (currentOptions.hideWhenDetached) {
      // hide 只产出 referenceHidden/escaped 语义，不主动隐藏 DOM。
      // 是否隐藏或关闭交给上层组件决定，避免定位层掺入业务展示策略。
      middlewares.push(hide())
    }

    return middlewares
  }

  async function update() {
    const reference = getReference()
    const floating = floatingElement
    const arrow = arrowElement
    const version = updateVersion
    if (!reference || !floating) {
      // reference 或 floating 缺失时无法计算位置。
      // 这里不清空 snapshot，是为了保留上一次语义状态，避免挂载过程中 adapter 读到不稳定中间值。
      return
    }

    // computePosition 是 @floating-ui/dom 的核心 API：输入 reference/floating DOM，
    // 输出最终坐标、最终 placement 和各 middleware 数据。core 选择 DOM 版本是为了跨框架复用，
    // 避免 React/Vue/Solid/Svelte/Angular 各自绑定不同的定位实现。
    const result = await computePosition(reference, floating, {
      placement: getPlacement(currentOptions),
      strategy: currentOptions.strategy ?? 'absolute',
      middleware: getMiddleware(),
    })
    // 定位计算是异步的，计算期间 trigger/content 可能已经卸载或替换。
    // 这里用版本号和 DOM 引用双重校验，避免旧计算结果写回新浮层，造成位置或箭头方向错乱。
    if (version !== updateVersion || getReference() !== reference || floatingElement !== floating) {
      return
    }

    const referenceRect = reference.getBoundingClientRect()
    const resultParts = partsFromPlacement(result.placement)
    const arrowData = result.middlewareData.arrow
    const hideData = result.middlewareData.hide

    // 坐标和尺寸通过 CSS 变量写入 DOM，adapter 只绑定固定的 position/left/top 规则。
    // 这样可以避免每个框架都重复维护一份定位样式对象，也能让样式包直接消费这些变量。
    patchFloatingVars(floating, {
      x: result.x,
      y: result.y,
      strategy: result.strategy,
      transformOrigin: getTransformOrigin(resultParts.side, arrowData?.x, arrowData?.y),
      referenceX: referenceRect.x,
      referenceY: referenceRect.y,
      referenceWidth: referenceRect.width,
      referenceHeight: referenceRect.height,
      ...(arrowData?.x !== undefined ? { arrowX: arrowData.x } : {}),
      ...(arrowData?.y !== undefined ? { arrowY: arrowData.y } : {}),
      ...(arrow && arrowElement === arrow ? { arrowSize: arrow.offsetWidth } : {}),
      ...(currentOptions.zIndex !== undefined ? { zIndex: currentOptions.zIndex } : {}),
    })

    // 对外 snapshot 使用和 Floating UI 兼容的 placement 字符串。
    // center 对齐时简化成 top/right/bottom/left，减少 adapter 和样式层分支。
    const placement = resultParts.align === 'center' ? resultParts.side : `${resultParts.side}-${resultParts.align}`
    floating.style.setProperty(
      '--floating-transform-origin',
      getTransformOrigin(resultParts.side, arrowData?.x, arrowData?.y),
    )
    // data-side/data-placement 必须使用 Floating UI 返回的最终 placement，而不是用户传入的原始 placement。
    // 发生 flip 后如果 adapter 继续用原始 placement，最常见的问题就是内容位置正确但箭头方向错误。
    floating.setAttribute('data-side', resultParts.side)
    floating.setAttribute('data-placement', placement)
    if (arrow) {
      arrow.setAttribute('data-side', resultParts.side)
    }

    const nextSnapshot = {
      placement,
      side: resultParts.side,
      align: resultParts.align,
      referenceHidden: Boolean(hideData?.referenceHidden),
      escaped: Boolean(hideData?.escaped),
    }
    store.updateSnapshot((snapshot) => (isSameSnapshot(snapshot, nextSnapshot) ? snapshot : nextSnapshot))
  }

  function startAutoUpdate() {
    const reference = getReference()
    if (!reference || !floatingElement || cleanupAutoUpdate) {
      return
    }
    // autoUpdate 会监听滚动、resize、元素尺寸变化等外部布局变化。
    // 只在浮层打开并挂载后启动，否则会让关闭的组件也持续监听页面。
    cleanupAutoUpdate = autoUpdate(reference, floatingElement, update)
  }

  function stopAutoUpdate() {
    // 关闭或销毁时必须停止 autoUpdate，避免隐藏浮层继续响应滚动/resize。
    cleanupAutoUpdate?.()
    cleanupAutoUpdate = undefined
  }

  return {
    getSnapshot: store.getSnapshot,
    subscribe: store.subscribe,
    setOptions: (nextOptions) => {
      currentOptions = nextOptions
      updateVersion += 1
      // options 改变时先把 snapshot 重置到用户意图，再等待 DOM 计算给出最终结果。
      // 这样 adapter 在下一次计算前也能读到新的 placement/side/align。
      setSnapshot(createInitialSnapshot(nextOptions))
      void update()
      scheduleUpdate()
    },
    setReferenceElement: (element) => {
      // reference 改变代表定位基准改变，旧的异步计算结果必须失效。
      updateVersion += 1
      referenceElement = element
      void update()
      scheduleUpdate()
    },
    setFloatingElement: (element) => {
      // floating DOM 改变后需要重新写 CSS 变量和 data attributes。
      // 这是 Vue/Solid 等框架中“状态正确但 DOM 旧”的常见排查点。
      updateVersion += 1
      floatingElement = element
      void update()
      scheduleUpdate()
    },
    setArrowElement: (element) => {
      // arrow 是 middleware 的输入，不只是展示元素。
      // 设置箭头后必须重新计算，否则 middlewareData.arrow 不会包含新箭头坐标。
      updateVersion += 1
      arrowElement = element
      void update()
      scheduleUpdate()
    },
    setVirtualReference: (reference) => {
      // virtual reference 用于右键菜单、选区浮层等没有固定 trigger DOM 的场景。
      // 它必须和真实 reference 互斥优先，否则坐标来源会不明确。
      updateVersion += 1
      virtualReference = reference
      void update()
      scheduleUpdate()
    },
    update,
    startAutoUpdate,
    stopAutoUpdate,
    destroy: () => {
      updateVersion += 1
      clearScheduledUpdate()
      stopAutoUpdate()
    },
  }
}
