<script lang="ts">
  import { popoverArrowClassName } from '@fex/components-styles/popover'
  import { cn } from '@fex/utils'
  import type { HTMLAttributes } from 'svelte/elements'
  import { getContext } from 'svelte'
  import { popoverContextKey, type PopoverContext } from './popover-context'

  interface PopoverArrowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
    class?: string
  }

  let { class: className, style, ...rest }: PopoverArrowProps = $props()
  const { arrow, arrowElement: contextArrowElement, overlay, snapshot } = getContext<PopoverContext>(popoverContextKey)
  let arrowElement = $state<HTMLDivElement>()
  const classList = $derived(cn(popoverArrowClassName, className))
  const sideStyle = $derived(
    // 必须从 $snapshot.side 派生箭头样式，使用 Floating UI 计算后的最终方向。
    // 如果用原始 placement，发生 flip 后 content 位置正确但箭头仍会朝旧方向。
    $snapshot.side === 'left' || $snapshot.side === 'right'
      ? 'top: clamp(var(--popover-arrow-inset,32px), var(--floating-arrow-y,50%), calc(100% - var(--popover-arrow-inset,32px)))'
      : 'left: clamp(var(--popover-arrow-inset,32px), var(--floating-arrow-x,50%), calc(100% - var(--popover-arrow-inset,32px)))',
  )

  $effect(() => {
    // arrow DOM 是 Floating UI arrow middleware 的输入，注册后 core 会计算 --floating-arrow-x/y。
    // 清理时校验当前元素，避免旧 effect 把新 arrowElement 清掉。
    contextArrowElement.current = arrowElement ?? null
    overlay.setArrowElement(arrowElement ?? null)
    return () => {
      if (contextArrowElement.current === arrowElement) {
        contextArrowElement.current = null
      }
    }
  })
</script>

{#if arrow()}
  <div
    {...rest}
    bind:this={arrowElement}
    data-slot="popover-arrow"
    data-side={$snapshot.side}
    class={classList}
    style={sideStyle}
  ></div>
{/if}
