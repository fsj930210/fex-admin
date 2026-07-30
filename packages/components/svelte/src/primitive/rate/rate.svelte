<script lang="ts">
  import { createRateController } from '@fex/components-core/rate/create-rate-controller'
  import type { RateDirection } from '@fex/components-core/rate/types'
  import { getRateItemFill } from '@fex/components-core/rate/utils'
  import { rateEmptyContentClassName, rateFilledContentClassName, rateItemClassName, rateRootClassName, type RateStyleProps } from '@fex/components-styles/rate'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { readableCoreStore } from '../../stores/core-store'
  import StarIcon from '../../icon/star.svelte'
  import { getRatePointerValue } from './rate-interactions'

  export interface RateItemRenderState { index: number; layer: 'empty' | 'filled'; fill: number; fillPercent: number; full: boolean; partial: boolean; empty: boolean; previewing: boolean; disabled: boolean; readOnly: boolean }
  interface RateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'dir' | 'onchange'>, RateStyleProps {
    value?: number; defaultValue?: number; count?: number; step?: number; disabled?: boolean; readOnly?: boolean; allowClear?: boolean; direction?: RateDirection
    getValueText?: (value: number, count: number) => string
    children?: Snippet<[RateItemRenderState]>
    onValuePreviewChange?: (value: number | null) => void
    onValueChange?: (value: number) => void
    onValueCommit?: (value: number) => void
  }
  let { value, defaultValue, count = 5, step = 1, disabled = false, readOnly = false, allowClear = true, direction = 'ltr', size = 'default', getValueText, children, class: className, onpointerdown, onpointermove, onpointerup, onpointercancel, onpointerleave, onpointerout, onkeydown, onValuePreviewChange, onValueChange, onValueCommit, ...rest }: RateProps = $props()
  let root: HTMLDivElement | undefined
  const options = {
    get value() { return value }, get defaultValue() { return defaultValue }, get count() { return count }, get step() { return step },
    get disabled() { return disabled }, get readOnly() { return readOnly }, get allowClear() { return allowClear }, get direction() { return direction },
    onPreviewChange: (next: number | null) => onValuePreviewChange?.(next), onChange: (next: number) => onValueChange?.(next), onCommit: (next: number) => onValueCommit?.(next),
  }
  const controller = createRateController(options)
  const storeSnapshot = readableCoreStore(controller)
  const snapshot = () => { void $storeSnapshot; return controller.getSnapshot() }
  const current = $derived(snapshot())
  function pointerValue(event: PointerEvent) { return root ? getRatePointerValue(root, event.clientX, current.step, current.count, current.direction) : 0 }
  function itemState(index: number, layer: 'empty' | 'filled'): RateItemRenderState {
    const fill = getRateItemFill(current.displayValue, index)
    return { index, layer, fill, fillPercent: fill * 100, full: fill === 1, partial: fill > 0 && fill < 1, empty: fill === 0, previewing: current.previewValue !== null, disabled: current.disabled, readOnly: current.readOnly }
  }
  function clipPath(index: number) { const hidden = (1 - getRateItemFill(current.displayValue, index)) * 100; return current.direction === 'rtl' ? `inset(0 0 0 ${hidden}%)` : `inset(0 ${hidden}% 0 0)` }
  function handleKeydown(event: KeyboardEvent) {
    if (current.disabled || current.readOnly) return
    const horizontal = current.direction === 'rtl' ? -1 : 1
    const directions: Record<string, number> = { ArrowRight: horizontal, ArrowLeft: -horizontal, ArrowUp: 1, ArrowDown: -1 }
    if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); controller.setValue(event.key === 'Home' ? 0 : current.count, { commit: true }) }
    else if (event.key === 'PageUp' || event.key === 'PageDown') { event.preventDefault(); controller.stepValue(event.key === 'PageUp' ? 1 : -1, 10) }
    else if (event.key in directions) { event.preventDefault(); controller.stepValue(directions[event.key]!) }
  }
</script>

<div {...rest} bind:this={root} role="slider" tabindex={current.disabled ? undefined : 0} dir={current.direction} aria-valuemin={0} aria-valuemax={current.count} aria-valuenow={current.value} aria-valuetext={getValueText?.(current.value, current.count) ?? `${current.value} out of ${current.count}`} aria-disabled={current.disabled || undefined} aria-readonly={current.readOnly || undefined} data-disabled={current.disabled ? 'true' : undefined} data-readonly={String(current.readOnly)} class={cn(rateRootClassName({ size }), className)}
  onpointerdown={(event) => { onpointerdown?.(event); if (event.defaultPrevented || current.disabled || current.readOnly || !root) return; root.setPointerCapture(event.pointerId); controller.startInteraction(pointerValue(event)) }}
  onpointermove={(event) => { onpointermove?.(event); if (event.defaultPrevented || current.disabled || current.readOnly) return; const next = pointerValue(event); if (current.interacting) controller.moveInteraction(next); else controller.preview(next) }}
  onpointerup={(event) => { onpointerup?.(event); if (root?.hasPointerCapture(event.pointerId)) root.releasePointerCapture(event.pointerId); controller.commitInteraction() }}
  onpointercancel={(event) => { onpointercancel?.(event); controller.cancelInteraction() }}
  onpointerleave={(event) => { onpointerleave?.(event); controller.clearPreview() }}
  onpointerout={(event) => { onpointerout?.(event); if (event.relatedTarget instanceof Node && root?.contains(event.relatedTarget)) return; controller.clearPreview() }}
  onkeydown={(event) => { onkeydown?.(event); if (!event.defaultPrevented) handleKeydown(event) }}>
  {#each Array.from({ length: current.count }, (_, index) => index) as index (index)}
    <span data-rate-item={index} class={rateItemClassName}>
      <span class={rateEmptyContentClassName}>{#if children}{@render children(itemState(index, 'empty'))}{:else}<StarIcon aria-hidden="true" />{/if}</span>
      <span class={rateFilledContentClassName} style:clip-path={clipPath(index)}>{#if children}{@render children(itemState(index, 'filled'))}{:else}<StarIcon aria-hidden="true" />{/if}</span>
    </span>
  {/each}
</div>
