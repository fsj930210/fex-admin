import { createStepsController } from '@fex/components-core/steps/create-steps-controller'
import { deserializeStepValue, serializeStepValue, type StepRecord, type StepsChangeMeta, type StepsOrientation, type StepStatus, type StepValue } from '@fex/components-core/steps/types'
import { stepClassName, stepContentClassName, stepIndicatorClassName, stepsClassName } from '@fex/components-styles/steps'
import { cn } from '@fex/utils'
import { createContext, createEffect, createMemo, onCleanup, splitProps, useContext, type Accessor, type JSX, type ParentProps } from 'solid-js'
import { CheckIcon } from '../../icon/check'
import { createCoreStoreSignal } from '../../primitives/create-core-store-signal'

interface Context { controller: ReturnType<typeof createStepsController>; snapshot: Accessor<{ current: StepValue | undefined; revision: number }>; orientation: () => StepsOrientation; navigation: () => boolean; elements: Map<StepValue, HTMLElement>; syncOrder: () => void }
const StepsContext = createContext<Context>()
const StepContext = createContext<{ info: Accessor<{ status: StepStatus }>; position: Accessor<number> }>()
function useStepsContext(name: string) { const value = useContext(StepsContext); if (!value) throw new Error(`${name} must be used inside Steps.`); return value }

export interface StepsProps extends ParentProps<Omit<JSX.OlHTMLAttributes<HTMLOListElement>, 'onChange'>> { current?: StepValue; defaultCurrent?: StepValue; navigation?: boolean; orientation?: StepsOrientation; responsive?: boolean; onChange?: (value: StepValue, meta: StepsChangeMeta) => void }
export function Steps(props: StepsProps) {
  const [local, rest] = splitProps(props, ['current', 'defaultCurrent', 'navigation', 'orientation', 'responsive', 'onChange', 'class', 'children'])
  const controller = createStepsController({ get current() { return local.current }, get defaultCurrent() { return local.defaultCurrent }, get navigation() { return local.navigation }, onChange: (value, meta) => local.onChange?.(value, meta) })
  const snapshot = createCoreStoreSignal(controller)
  createEffect(() => controller.updateOptions({ current: local.current, defaultCurrent: local.defaultCurrent, navigation: local.navigation, onChange: (value, meta) => local.onChange?.(value, meta) }))
  const orientation = () => local.orientation ?? 'horizontal'
  const elements = new Map<StepValue, HTMLElement>()
  let rootElement: HTMLOListElement | undefined
  const syncOrder = () => { if (rootElement) controller.setOrder([...rootElement.querySelectorAll<HTMLElement>('[data-step-value]')].filter((element) => element.closest('[data-slot="steps"]') === rootElement).map((element) => deserializeStepValue(element.dataset.stepValue ?? 's:'))) }
  return <StepsContext.Provider value={{ controller, snapshot, orientation, navigation: () => local.navigation === true, elements, syncOrder }}><ol {...rest} ref={rootElement} data-slot="steps" data-orientation={orientation()} class={cn(stepsClassName({ orientation: orientation(), responsive: local.responsive ?? true }), local.class)}>{local.children}</ol></StepsContext.Provider>
}

export interface StepProps extends ParentProps<JSX.LiHTMLAttributes<HTMLLIElement>>, StepRecord {}
export function Step(props: StepProps) {
  const [local, rest] = splitProps(props, ['value', 'disabled', 'status', 'data', 'class', 'children'])
  const root = useStepsContext('Step'); let element: HTMLLIElement | undefined
  root.controller.registerStep({ value: local.value, disabled: local.disabled, status: local.status, data: local.data })
  createEffect(() => { root.controller.registerStep({ value: local.value, disabled: local.disabled, status: local.status, data: local.data }); if (element) { root.elements.set(local.value, element); root.syncOrder() } })
  onCleanup(() => { root.elements.delete(local.value); root.controller.unregisterStep(local.value); root.syncOrder() })
  const info = createMemo(() => { root.snapshot().revision; return root.controller.getStepInfo(local.value) ?? { value: local.value, status: local.status ?? 'wait', disabled: local.disabled === true } })
  const position = createMemo(() => { root.snapshot().revision; return Math.max(1, root.controller.getPosition(local.value) + 1) })
  const keydown: JSX.EventHandler<HTMLLIElement, KeyboardEvent> = (event) => { if (!root.navigation() || info().disabled) return; if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); root.controller.select(local.value, 'keyboard'); return } const horizontal = root.orientation() === 'horizontal'; const direction = event.key === 'Home' ? 'first' : event.key === 'End' ? 'last' : event.key === (horizontal ? 'ArrowRight' : 'ArrowDown') ? 'next' : event.key === (horizontal ? 'ArrowLeft' : 'ArrowUp') ? 'previous' : undefined; if (direction) { event.preventDefault(); const value = root.controller.move(local.value, direction); if (value !== undefined) { root.elements.get(value)?.focus(); root.controller.select(value, 'keyboard') } } }
  return <StepContext.Provider value={{ info, position }}><li {...rest} ref={(node) => { element = node; root.elements.set(local.value, node); root.syncOrder(); queueMicrotask(root.syncOrder) }} data-step-value={serializeStepValue(local.value)} class={cn(stepClassName, local.class)} role={root.navigation() ? 'button' : undefined} tabIndex={root.navigation() && !info().disabled ? (root.snapshot().current === local.value ? 0 : -1) : undefined} aria-current={root.snapshot().current === local.value ? 'step' : undefined} aria-disabled={info().disabled || undefined} data-status={info().status} data-disabled={info().disabled || undefined} data-navigation={root.navigation() || undefined} onClick={() => root.controller.select(local.value, 'pointer')} onKeyDown={keydown}>{local.children}</li></StepContext.Provider>
}
export function StepIndicator(props: ParentProps<JSX.HTMLAttributes<HTMLSpanElement>>) { const context = useContext(StepContext); if (!context) throw new Error('StepIndicator must be used inside Step.'); const [local, rest] = splitProps(props, ['class', 'children']); return <span {...rest} class={cn(stepIndicatorClassName, local.class)}>{local.children ?? (context.info().status === 'finish' ? <CheckIcon /> : context.position())}</span> }
export function StepContent(props: ParentProps<JSX.HTMLAttributes<HTMLDivElement>>) { const [local, rest] = splitProps(props, ['class', 'children']); return <div {...rest} class={cn(stepContentClassName, local.class)}>{local.children}</div> }
export type { StepBuiltinStatus, StepInfo, StepRecord, StepsChangeMeta, StepsChangeTrigger, StepsOrientation, StepStatus, StepValue } from '@fex/components-core/steps/types'
