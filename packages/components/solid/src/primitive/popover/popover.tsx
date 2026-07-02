import {
  popoverArrowClassName,
  popoverContentClassName,
  popoverDescriptionClassName,
  popoverHeaderClassName,
  popoverTitleClassName,
} from '@fex/components-styles/popover'
import {
  createFloatingOverlay,
  type FloatingOverlayOptions,
} from '@fex/components-core/overlay/create-floating-overlay'
import type { FloatingOverlay } from '@fex/components-core/overlay/create-floating-overlay'
import type { OverlayTrigger } from '@fex/components-core/overlay/trigger/create-trigger'
import type {
  FloatingAlign,
  FloatingPlacement,
  FloatingSide,
} from '@fex/components-core/floating/placement'
import { cn } from '@fex/utils'
import { Portal } from 'solid-js/web'
import {
  createContext,
  createEffect,
  createSignal,
  onCleanup,
  Show,
  splitProps,
  useContext,
  type Accessor,
  type JSX,
  type ParentProps,
} from 'solid-js'
import { createCoreStoreSignal } from '../../primitives/create-core-store-signal'

type PopoverContextValue = {
  arrow: boolean
  arrowElement: { current: HTMLElement | null }
  contentElement: { current: HTMLElement | null }
  overlay: FloatingOverlay
  snapshot: Accessor<ReturnType<FloatingOverlay['getSnapshot']>>
  triggerElement: { current: HTMLElement | null }
}

const PopoverContext = createContext<PopoverContextValue>()
const defaultTrigger: OverlayTrigger[] = ['click']
const dismissRecords = new Set<{
  arrowElement: { current: HTMLElement | null }
  contentElement: { current: HTMLElement | null }
  overlay: FloatingOverlay
  triggerElement: { current: HTMLElement | null }
}>()

function dismissOpenPopovers(event: Event, except?: FloatingOverlay) {
  const target = event.target
  dismissRecords.forEach((record) => {
    if (record.overlay === except || !record.overlay.getSnapshot().open) return
    if (target instanceof Node) {
      if (
        record.triggerElement.current?.contains(target) ||
        record.contentElement.current?.contains(target) ||
        record.arrowElement.current?.contains(target)
      ) {
        return
      }
    }
    record.overlay.close({ reason: 'outside-pointer', event })
  })
}

function usePopover(component: string) {
  const context = useContext(PopoverContext)
  if (!context) {
    throw new Error(`${component} must be used inside Popover`)
  }
  return context
}

function eventInfo(event: Event & Partial<PointerEvent>) {
  return {
    target: event.target,
    currentTarget: event.currentTarget,
    clientX: event.clientX,
    clientY: event.clientY,
    button: event.button,
    pointerType: event.pointerType,
    event,
    preventDefault: event.preventDefault.bind(event),
    stopPropagation: event.stopPropagation.bind(event),
  }
}

export interface PopoverProps extends ParentProps {
  align?: FloatingAlign
  alignOffset?: number
  arrow?: boolean
  defaultOpen?: boolean
  getPopupContainer?: FloatingOverlayOptions['getPopupContainer']
  hoverCloseDelay?: number
  hoverOpenDelay?: number
  onOpenChange?: FloatingOverlayOptions['onOpenChange']
  open?: boolean
  placement?: FloatingPlacement
  side?: FloatingSide
  sideOffset?: number
  trigger?: OverlayTrigger[]
}

export function Popover(props: PopoverProps) {
  const [local] = splitProps(props, [
    'children',
    'open',
    'defaultOpen',
    'onOpenChange',
    'trigger',
    'placement',
    'side',
    'align',
    'alignOffset',
    'sideOffset',
    'arrow',
    'getPopupContainer',
    'hoverCloseDelay',
    'hoverOpenDelay',
  ])
  const [open, setOpen] = createSignal(local.open ?? local.defaultOpen ?? false)
  const triggerElement = { current: null as HTMLElement | null }
  const contentElement = { current: null as HTMLElement | null }
  const arrowElement = { current: null as HTMLElement | null }
  function makeOptions(openValue: boolean): FloatingOverlayOptions {
    return {
      open: openValue,
      trigger: local.trigger ?? defaultTrigger,
      placement: local.placement,
      side: local.side,
      align: local.align,
      alignOffset: local.alignOffset,
      sideOffset: local.sideOffset ?? 6,
      arrow: local.arrow,
      getPopupContainer: local.getPopupContainer,
      hoverCloseDelay: local.hoverCloseDelay,
      hoverOpenDelay: local.hoverOpenDelay,
      onOpenChange(nextOpen, info) {
        if (local.open === undefined) {
          // Solid 非受控模式通过 signal 保存 open，再同步给 core。
          // 受控模式不能写本地 open，否则 props.open 和 core snapshot 会分叉。
          setOpen(nextOpen)
          overlay.setOptions(makeOptions(nextOpen))
        }
        local.onOpenChange?.(nextOpen, info)
      },
    }
  }
  function syncOptions() {
    // Solid props 是访问器语义，必须在 effect 中重新读取 local.xxx 后同步到 core。
    // overlay 实例保持稳定，只更新 options，避免丢失 DOM 引用和 autoUpdate 状态。
    overlay.setOptions(makeOptions(local.open ?? open()))
  }
  const overlay = createFloatingOverlay({
    ...makeOptions(open()),
  })
  const snapshot = createCoreStoreSignal(overlay)
  const dismissRecord = { arrowElement, overlay, triggerElement, contentElement }
  dismissRecords.add(dismissRecord)

  createEffect(() => {
    // 这是同步外部 core 实例的 effect，不承载业务流转。
    // 用户点击、hover、focus 仍然直接调用 overlay.trigger。
    syncOptions()
  })

  onCleanup(() => {
    dismissRecords.delete(dismissRecord)
    overlay.destroy()
  })

  return (
    <PopoverContext.Provider value={{ arrow: Boolean(local.arrow), arrowElement, contentElement, overlay, snapshot, triggerElement }}>
      {local.children}
    </PopoverContext.Provider>
  )
}

export type PopoverTriggerRenderProps = {
  props: {
    'aria-expanded': boolean
    'aria-haspopup': 'dialog'
    'data-state': 'open' | 'closed'
    class: string | undefined
    onBlur: JSX.FocusEventHandlerUnion<HTMLButtonElement, FocusEvent>
    onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>
    onContextMenu: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>
    onFocus: JSX.FocusEventHandlerUnion<HTMLButtonElement, FocusEvent>
    onPointerEnter: JSX.EventHandlerUnion<HTMLButtonElement, PointerEvent>
    onPointerLeave: JSX.EventHandlerUnion<HTMLButtonElement, PointerEvent>
    type: 'button'
  }
  ref: (element: HTMLButtonElement) => void
  state: ReturnType<FloatingOverlay['getSnapshot']>
}

export interface PopoverTriggerProps {
  children: (props: PopoverTriggerRenderProps) => JSX.Element
  class?: string
}

export function PopoverTrigger(props: PopoverTriggerProps) {
  const [local] = splitProps(props, ['children', 'class'])
  const { overlay, snapshot, triggerElement } = usePopover('PopoverTrigger')

  function setReference(element: HTMLButtonElement) {
    // ref 回调把真实 trigger DOM 注册给 core floating。
    // Solid 条件渲染可能替换元素，cleanup 中必须清空 reference。
    triggerElement.current = element
    overlay.setReferenceElement(element)
  }

  onCleanup(() => {
    triggerElement.current = null
    overlay.setReferenceElement(null)
  })

  return local.children({
    ref: setReference,
    // 这里返回当前 snapshot 给 render prop。调用方若要响应更新，应在 children 内读取 state 或使用 props；
    // adapter 自身不能把 snapshot().open 缓存到普通变量，否则后续不会追踪。
    state: snapshot(),
    props: {
      type: 'button',
      class: local.class,
      'aria-haspopup': 'dialog',
      'aria-expanded': snapshot().open,
      'data-state': snapshot().open ? 'open' : 'closed',
      onClick: (event) => {
        dismissOpenPopovers(event, overlay)
        overlay.trigger.click(eventInfo(event))
      },
      onPointerEnter: (event) => overlay.trigger.pointerEnter(eventInfo(event)),
      onPointerLeave: (event) => overlay.trigger.pointerLeave(eventInfo(event)),
      onFocus: (event) => overlay.trigger.focus(eventInfo(event)),
      onBlur: (event) => overlay.trigger.blur(eventInfo(event)),
      onContextMenu: (event) => {
        dismissOpenPopovers(event, overlay)
        overlay.trigger.contextMenu(eventInfo(event))
      },
    },
  })
}

export function PopoverPortal(props: ParentProps) {
  const { overlay, snapshot } = usePopover('PopoverPortal')
  return (
    <Show when={snapshot().mounted}>
      <Portal mount={overlay.resolvePopupContainer() ?? document.body}>{props.children}</Portal>
    </Show>
  )
}

export interface PopoverContentProps extends ParentProps {
  class?: string
}

export function PopoverContent(props: PopoverContentProps) {
  const [local] = splitProps(props, ['children', 'class'])
  const { contentElement, overlay, snapshot } = usePopover('PopoverContent')

  function setContentElement(element: HTMLDivElement) {
    // content DOM 同时是 overlay layer 和 floating element，必须在挂载时同步给 core。
    contentElement.current = element
    overlay.setFloatingElement(element)
  }

  createEffect(() => {
    // 这个 effect 只管理 document 级 dismiss 监听；它依赖 snapshot().open 和 contentElement.current。
    // 如果把 snapshot().open 提前读成普通值，面板打开后监听不会注册，ESC/外部点击会失效。
    if (!snapshot().open || !contentElement.current) return
    const ownerDocument = contentElement.current.ownerDocument
    const handlePointerDown = (event: PointerEvent) => {
      dismissOpenPopovers(event)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        overlay.dismiss.escapeKey(eventInfo(event))
      }
    }
    ownerDocument.addEventListener('pointerdown', handlePointerDown, true)
    ownerDocument.addEventListener('keydown', handleKeyDown, true)
    onCleanup(() => {
      ownerDocument.removeEventListener('pointerdown', handlePointerDown, true)
      ownerDocument.removeEventListener('keydown', handleKeyDown, true)
    })
  })

  onCleanup(() => {
    contentElement.current = null
    overlay.setFloatingElement(null)
  })

  // 坐标由 core 直接写 CSS 变量，Solid adapter 不订阅 x/y，避免 autoUpdate 高频触发组件计算。
  return (
    <Show when={snapshot().mounted}>
      <div
        ref={setContentElement}
        role="dialog"
        tabIndex={-1}
        data-slot="popover-content"
        data-state={snapshot().open ? 'open' : 'closed'}
        data-phase={snapshot().phase}
        data-side={snapshot().side}
        data-align={snapshot().align}
        data-placement={snapshot().placement}
        class={cn(popoverContentClassName(), local.class)}
        style="position: var(--floating-strategy, absolute); left: var(--floating-x, 0px); top: var(--floating-y, 0px); transform-origin: var(--floating-transform-origin);"
      >
        {local.children}
      </div>
    </Show>
  )
}

export interface PopoverArrowProps {
  class?: string
}

export function PopoverArrow(props: PopoverArrowProps) {
  const [local] = splitProps(props, ['class'])
  const { arrow, arrowElement, overlay, snapshot } = usePopover('PopoverArrow')
  const sideStyle = () => {
    // sideStyle 必须是函数并在 JSX 中调用，才能让 Solid 追踪 snapshot().side。
    // 如果初始化时计算成对象，flip 后箭头方向不会更新。
    return snapshot().side === 'left' || snapshot().side === 'right'
      ? {
          top: 'clamp(var(--popover-arrow-inset,32px), var(--floating-arrow-y,50%), calc(100% - var(--popover-arrow-inset,32px)))',
        }
      : {
          left: 'clamp(var(--popover-arrow-inset,32px), var(--floating-arrow-x,50%), calc(100% - var(--popover-arrow-inset,32px)))',
        }
  }

  onCleanup(() => {
    arrowElement.current = null
    overlay.setArrowElement(null)
  })

  return (
    <Show when={arrow}>
      <div
        ref={(element) => {
          // arrow DOM 是 Floating UI arrow middleware 的输入，注册后 core 会重新计算箭头坐标。
          arrowElement.current = element
          overlay.setArrowElement(element)
        }}
        data-slot="popover-arrow"
        data-side={snapshot().side}
        class={cn(popoverArrowClassName, local.class)}
        style={sideStyle()}
      />
    </Show>
  )
}

function createPart(slot: string, className: string) {
  return function PopoverPart(props: ParentProps<{ class?: string }>) {
    const [local, rest] = splitProps(props, ['children', 'class'])
    return (
      <div {...rest} data-slot={slot} class={cn(className, local.class)}>
        {local.children}
      </div>
    )
  }
}

export const PopoverHeader = createPart('popover-header', popoverHeaderClassName)
export const PopoverTitle = createPart('popover-title', popoverTitleClassName)
export const PopoverDescription = createPart('popover-description', popoverDescriptionClassName)
