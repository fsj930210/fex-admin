<script lang="ts">
  import { popoverContentClassName } from '@fex/components-styles/popover'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { getContext } from 'svelte'
  import { dismissOpenPopovers, popoverContextKey, type PopoverContext } from './popover-context'

  interface PopoverContentProps extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
    class?: string
    children?: Snippet
  }

  let { class: className, children, style, ...rest }: PopoverContentProps = $props()
  const { contentElement: contextContentElement, overlay, snapshot } = getContext<PopoverContext>(popoverContextKey)
  let contentElement = $state<HTMLDivElement>()
  const classList = $derived(cn(popoverContentClassName(), className))
  // x/y/strategy 由 core 写入 CSS 变量；Svelte 不订阅坐标，避免 autoUpdate 高频触发模板更新。

  $effect(() => {
    // bind:this 拿到真实 DOM 后注册给 core。content 同时是 floating element 和 dismiss 边界。
    // 清理时只清掉当前元素，避免 Svelte 快速重建 DOM 时把新元素误置空。
    contextContentElement.current = contentElement ?? null
    overlay.setFloatingElement(contentElement ?? null)
    return () => {
      if (contextContentElement.current === contentElement) {
        contextContentElement.current = null
      }
    }
  })

  $effect(() => {
    // document 级监听是外部系统同步，依赖 $snapshot.open 和 contentElement。
    // 必须在 effect 中读取 $snapshot.open，不能缓存成普通变量，否则打开后不会注册 dismiss 监听。
    if (!$snapshot.open || !contentElement) return
    const ownerDocument = contentElement.ownerDocument
    const handlePointerDown = (event: PointerEvent) => {
      // 统一走 registry 判断 trigger/content/arrow 边界，避免每个 Svelte 子组件重复判断。
      dismissOpenPopovers(event)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        overlay.dismiss.escapeKey(eventInfo(event))
      }
    }
    ownerDocument.addEventListener('pointerdown', handlePointerDown, true)
    ownerDocument.addEventListener('keydown', handleKeyDown, true)
    return () => {
      ownerDocument.removeEventListener('pointerdown', handlePointerDown, true)
      ownerDocument.removeEventListener('keydown', handleKeyDown, true)
    }
  })

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
</script>

{#if $snapshot.mounted}
  <div
    {...rest}
    bind:this={contentElement}
    role="dialog"
    tabindex="-1"
    data-slot="popover-content"
    data-state={$snapshot.open ? 'open' : 'closed'}
    data-phase={$snapshot.phase}
    data-side={$snapshot.side}
    data-align={$snapshot.align}
    data-placement={$snapshot.placement}
    class={classList}
    style:position="var(--floating-strategy, absolute)"
    style:left="var(--floating-x, 0px)"
    style:top="var(--floating-y, 0px)"
    style:transform-origin="var(--floating-transform-origin)"
  >
    {@render children?.()}
  </div>
{/if}
