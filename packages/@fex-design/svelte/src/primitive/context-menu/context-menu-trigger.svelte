<script lang="ts" generics="TPayload = unknown">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { getContext } from 'svelte'
  import { contextMenuContextKey, type ContextMenuContext } from './context-menu-context'

  interface Props {
    payload?: TPayload
    children?: Snippet<[{ action: (element: HTMLElement) => { destroy: () => void }; props: HTMLAttributes<HTMLElement>; state: ReturnType<ContextMenuContext<TPayload>['controller']['getSnapshot']> }]>
  }
  let { payload, children }: Props = $props()
  const { controller, snapshot } = getContext<ContextMenuContext<TPayload>>(contextMenuContextKey)
  function eventInfo(event: Event & Partial<PointerEvent>) { return { target: event.target, currentTarget: event.currentTarget, clientX: event.clientX, clientY: event.clientY, button: event.button, pointerType: event.pointerType, event, preventDefault: event.preventDefault.bind(event), stopPropagation: event.stopPropagation.bind(event) } }
  function action(element: HTMLElement) { controller.overlay.setReferenceElement(element); return { destroy() { controller.overlay.setReferenceElement(null) } } }
  const triggerProps = $derived({
    'aria-haspopup': 'menu',
    'data-state': $snapshot.overlay.open ? 'open' : 'closed',
    oncontextmenu: (event: MouseEvent) => controller.openAt({ payload, element: event.currentTarget as HTMLElement, clientX: event.clientX, clientY: event.clientY, event }, eventInfo(event)),
    onkeydown: (event: KeyboardEvent) => { if ((event.shiftKey && event.key === 'F10') || event.key === 'ContextMenu') { event.preventDefault(); const element = event.currentTarget as HTMLElement; const rect = element.getBoundingClientRect(); controller.openAt({ payload, element, clientX: rect.left, clientY: rect.bottom, event }, eventInfo(event)) } },
  } satisfies HTMLAttributes<HTMLElement>)
</script>
{@render children?.({ action, props: triggerProps, state: $snapshot })}
