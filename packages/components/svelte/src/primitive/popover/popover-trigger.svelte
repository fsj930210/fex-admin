<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { getContext } from 'svelte'
  import { dismissOpenPopovers, popoverContextKey, type PopoverContext } from './popover-context'

  type PopoverTriggerProps = Omit<HTMLButtonAttributes, 'children'> & {
    children?: Snippet<[
      {
        action: (element: HTMLElement) => { destroy: () => void }
        props: HTMLButtonAttributes
        state: ReturnType<PopoverContext['overlay']['getSnapshot']>
      },
    ]>
  }

  let { children, type = 'button', ...rest }: PopoverTriggerProps = $props()
  const { overlay, snapshot, triggerElement } = getContext<PopoverContext>(popoverContextKey)

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

  function action(element: HTMLElement) {
    // Svelte action 是 trigger DOM 进入 core floating 的入口。
    // 销毁时必须清空 reference，否则隐藏后旧 trigger 仍可能参与定位。
    triggerElement.current = element
    overlay.setReferenceElement(element)
    return {
      destroy() {
        if (triggerElement.current === element) {
          triggerElement.current = null
        }
        overlay.setReferenceElement(null)
      },
    }
  }

  const triggerProps = $derived({
    // triggerProps 必须是 $derived，才能让 aria-expanded/data-state 跟随 $snapshot.open 更新。
    // 如果创建成普通对象，core 已打开但 DOM attribute 仍会停留在初始 closed。
    ...rest,
    type,
    'aria-haspopup': 'dialog',
    'aria-expanded': $snapshot.open,
    'data-state': $snapshot.open ? 'open' : 'closed',
    onclick: (event: MouseEvent) => {
      // 点击当前 trigger 前先关闭其它打开的 Popover，避免多个 click popover 同时保持打开。
      dismissOpenPopovers(event, overlay)
      overlay.trigger.click(eventInfo(event))
    },
    onpointerenter: (event: PointerEvent) => overlay.trigger.pointerEnter(eventInfo(event)),
    onpointerleave: (event: PointerEvent) => overlay.trigger.pointerLeave(eventInfo(event)),
    onfocus: (event: FocusEvent) => overlay.trigger.focus(eventInfo(event)),
    onblur: (event: FocusEvent) => overlay.trigger.blur(eventInfo(event)),
    oncontextmenu: (event: MouseEvent) => {
      dismissOpenPopovers(event, overlay)
      overlay.trigger.contextMenu(eventInfo(event))
    },
  } satisfies HTMLButtonAttributes)

</script>

{@render children?.({ action, props: triggerProps, state: $snapshot })}
