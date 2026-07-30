import { createRateController } from '@fex/components-core/rate/create-rate-controller'
import type { RateDirection } from '@fex/components-core/rate/types'
import { getRateItemFill } from '@fex/components-core/rate/utils'
import { rateEmptyContentClassName, rateFilledContentClassName, rateItemClassName, rateRootClassName, type RateStyleProps } from '@fex/components-styles/rate'
import { cn } from '@fex/utils'
import { createMemo, For, splitProps, type JSX } from 'solid-js'
import { createCoreStoreSignal } from '../../primitives/create-core-store-signal'
import { StarIcon } from '../../icon/star'
import { getRatePointerValue } from './rate-interactions'

export interface RateItemRenderState {
  index: number
  layer: 'empty' | 'filled'
  fill: number
  fillPercent: number
  full: boolean
  partial: boolean
  empty: boolean
  previewing: boolean
  disabled: boolean
  readOnly: boolean
}
export interface RateProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children' | 'dir' | 'onChange'>, RateStyleProps {
  value?: number
  defaultValue?: number
  count?: number
  step?: number
  disabled?: boolean
  readOnly?: boolean
  allowClear?: boolean
  direction?: RateDirection
  getValueText?: (value: number, count: number) => string
  children?: (state: RateItemRenderState) => JSX.Element
  onValuePreviewChange?: (value: number | null) => void
  onValueChange?: (value: number) => void
  onValueCommit?: (value: number) => void
}

export function Rate(props: RateProps) {
  const [local, rest] = splitProps(props, ['value', 'defaultValue', 'count', 'step', 'disabled', 'readOnly', 'allowClear', 'direction', 'size', 'getValueText', 'children', 'class', 'ref', 'onPointerDown', 'onPointerMove', 'onPointerUp', 'onPointerCancel', 'onPointerLeave', 'onPointerOut', 'onKeyDown', 'onValuePreviewChange', 'onValueChange', 'onValueCommit'])
  const options = {
    get value() { return local.value }, get defaultValue() { return local.defaultValue },
    get count() { return local.count ?? 5 }, get step() { return local.step ?? 1 },
    get disabled() { return local.disabled }, get readOnly() { return local.readOnly },
    get allowClear() { return local.allowClear }, get direction() { return local.direction },
    onPreviewChange: (value: number | null) => local.onValuePreviewChange?.(value),
    onChange: (value: number) => local.onValueChange?.(value),
    onCommit: (value: number) => local.onValueCommit?.(value),
  }
  const controller = createRateController(options)
  const storeSnapshot = createCoreStoreSignal(controller)
  const snapshot = createMemo(() => {
    storeSnapshot()
    local.value
    local.defaultValue
    local.count
    local.step
    local.disabled
    local.readOnly
    local.allowClear
    local.direction
    return controller.getSnapshot()
  })
  let root: HTMLDivElement | undefined
  const pointerValue = (event: PointerEvent & { currentTarget: HTMLDivElement }) => getRatePointerValue(event.currentTarget, event.clientX, snapshot().step, snapshot().count, snapshot().direction)
  const renderContent = (state: RateItemRenderState) => local.children?.(state) ?? <StarIcon aria-hidden="true" />
  const state = (index: number, layer: 'empty' | 'filled'): RateItemRenderState => {
    const fill = getRateItemFill(snapshot().displayValue, index)
    return { index, layer, fill, fillPercent: fill * 100, full: fill === 1, partial: fill > 0 && fill < 1, empty: fill === 0, previewing: snapshot().previewValue !== null, disabled: snapshot().disabled, readOnly: snapshot().readOnly }
  }
  const clipPath = (index: number) => {
    const hidden = (1 - getRateItemFill(snapshot().displayValue, index)) * 100
    return snapshot().direction === 'rtl' ? `inset(0 0 0 ${hidden}%)` : `inset(0 ${hidden}% 0 0)`
  }
  const keydown = (event: KeyboardEvent) => {
    if (snapshot().disabled || snapshot().readOnly) return
    const horizontal = snapshot().direction === 'rtl' ? -1 : 1
    const directions: Record<string, number> = { ArrowRight: horizontal, ArrowLeft: -horizontal, ArrowUp: 1, ArrowDown: -1 }
    if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); controller.setValue(event.key === 'Home' ? 0 : snapshot().count, { commit: true }) }
    else if (event.key === 'PageUp' || event.key === 'PageDown') { event.preventDefault(); controller.stepValue(event.key === 'PageUp' ? 1 : -1, 10) }
    else if (event.key in directions) { event.preventDefault(); controller.stepValue(directions[event.key]!) }
  }

  return <div {...rest} ref={(element) => { root = element; if (typeof local.ref === 'function') local.ref(element) }} role="slider" tabIndex={snapshot().disabled ? undefined : 0} dir={snapshot().direction} aria-valuemin={0} aria-valuemax={snapshot().count} aria-valuenow={snapshot().value} aria-valuetext={local.getValueText?.(snapshot().value, snapshot().count) ?? `${snapshot().value} out of ${snapshot().count}`} aria-disabled={snapshot().disabled || undefined} aria-readonly={snapshot().readOnly || undefined} data-disabled={snapshot().disabled ? 'true' : undefined} data-readonly={String(snapshot().readOnly)} class={cn(rateRootClassName({ size: local.size ?? 'default' }), local.class)}
    onPointerDown={(event) => { if (typeof local.onPointerDown === 'function') local.onPointerDown(event); if (event.defaultPrevented || snapshot().disabled || snapshot().readOnly) return; event.currentTarget.setPointerCapture(event.pointerId); controller.startInteraction(pointerValue(event)) }}
    onPointerMove={(event) => { if (typeof local.onPointerMove === 'function') local.onPointerMove(event); if (event.defaultPrevented || snapshot().disabled || snapshot().readOnly) return; const value = pointerValue(event); if (snapshot().interacting) controller.moveInteraction(value); else controller.preview(value) }}
    onPointerUp={(event) => { if (typeof local.onPointerUp === 'function') local.onPointerUp(event); if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); controller.commitInteraction() }}
    onPointerCancel={(event) => { if (typeof local.onPointerCancel === 'function') local.onPointerCancel(event); controller.cancelInteraction() }}
    onPointerLeave={(event) => { if (typeof local.onPointerLeave === 'function') local.onPointerLeave(event); controller.clearPreview() }}
    onPointerOut={(event) => { if (typeof local.onPointerOut === 'function') local.onPointerOut(event); if (event.relatedTarget instanceof Node && root?.contains(event.relatedTarget)) return; controller.clearPreview() }}
    onKeyDown={(event) => { if (typeof local.onKeyDown === 'function') local.onKeyDown(event); if (!event.defaultPrevented) keydown(event) }}>
    <For each={Array.from({ length: snapshot().count }, (_, index) => index)}>{(index) => <span data-rate-item={index} class={rateItemClassName}><span class={rateEmptyContentClassName}>{renderContent(state(index, 'empty'))}</span><span class={rateFilledContentClassName} style={{ 'clip-path': clipPath(index) }}>{renderContent(state(index, 'filled'))}</span></span>}</For>
  </div>
}

export type { RateChangeMeta, RateDirection, RateSnapshot } from '@fex/components-core/rate/types'
