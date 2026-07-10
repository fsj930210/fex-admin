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
  createSignal,
  onCleanup,
  Show,
  splitProps,
  type JSX,
  type ParentProps,
} from 'solid-js'
import { createCoreStoreSignal } from '../../primitives/create-core-store-signal'
import { PopoverContext, dismissOpenPopovers, dismissRecords, usePopover } from './popover-context'
const defaultTrigger: OverlayTrigger[] = ['click']
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
          // Solid 非受控模式写本地 signal；受控模式等待 props.open 回流，避免和 core snapshot 分叉。
          setOpen(nextOpen)
          overlay.setOptions(makeOptions(nextOpen))
        }
        local.onOpenChange?.(nextOpen, info)
      },
    }
  }
  function syncOptions() {
    // Solid props 是访问器语义；渲染时同步到稳定的 core 实例，不重建 DOM 引用和 autoUpdate。
    overlay.setOptions(makeOptions(local.open ?? open()))
    return null
  }
  const overlay = createFloatingOverlay({
    ...makeOptions(open()),
  })
  const snapshot = createCoreStoreSignal(overlay)
  const dismissRecord = { arrowElement, overlay, triggerElement, contentElement }
  dismissRecords.add(dismissRecord)

  onCleanup(() => {
    dismissRecords.delete(dismissRecord)
    overlay.destroy()
  })

  return (
    <>
      {syncOptions()}
      <PopoverContext.Provider value={{ arrow: Boolean(local.arrow), arrowElement, contentElement, overlay, snapshot, triggerElement }}>
        {local.children}
      </PopoverContext.Provider>
    </>
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
    triggerElement.current = element
    overlay.setReferenceElement(element)
  }

  onCleanup(() => {
    triggerElement.current = null
    overlay.setReferenceElement(null)
  })

  return local.children({
    ref: setReference,
    // 调用方若要响应更新，应在 children 内读取 state，不能缓存成普通变量。
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
    // content DOM 同时是 overlay layer 和 floating element。
    contentElement.current = element
    overlay.setFloatingElement(element)
  }


  onCleanup(() => {
    contentElement.current = null
    overlay.setFloatingElement(null)
  })

  // 坐标由 core 写 CSS 变量，Solid adapter 不订阅 x/y，避免 autoUpdate 高频触发组件计算。
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
    // sideStyle 必须在 JSX 中调用，才能追踪 snapshot().side。
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
