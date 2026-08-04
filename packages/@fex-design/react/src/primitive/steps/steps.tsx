import type { StepRecord } from '@fex-design/core/steps/types'
import { stepClassName, stepContentClassName, stepIndicatorClassName, stepsClassName } from '@fex-design/styles/steps'
import { cn } from '@fex/utils'
import type { HTMLAttributes, KeyboardEvent, MouseEvent, ReactNode, Ref } from 'react'
import { CheckIcon } from '../../icon/check'
import { useComposedRef } from '../../hooks/use-composed-ref'
import { StepContext, StepsContext, useStepContext, useStepsContext } from './steps-context'
import { useSteps, type UseStepsOptions } from './use-steps'

export interface StepsProps<TData = unknown> extends UseStepsOptions<TData>, Omit<HTMLAttributes<HTMLOListElement>, 'onChange'> {
  children?: ReactNode
}
export function Steps<TData = unknown>({ children, className, style, ...options }: StepsProps<TData>) {
  const steps = useSteps(options)
  return (
    <StepsContext value={steps}>
      <ol
        className={cn(stepsClassName({ orientation: steps.orientation, responsive: steps.responsive }), className)}
        data-orientation={steps.orientation}
        style={style}
      >{children}</ol>
    </StepsContext>
  )
}

export interface StepProps<TData = unknown> extends Omit<HTMLAttributes<HTMLLIElement>, 'children'>, StepRecord<TData> { children?: ReactNode }
export function Step<TData = unknown>({ value, disabled, status, data, children, className, onClick, onKeyDown, ref, ...props }: StepProps<TData> & { ref?: Ref<HTMLLIElement> }) {
  const steps = useStepsContext('Step')
  const result = steps.getStepProps({ value, disabled, status, data })
  const composedRef = useComposedRef(result.props.ref, ref)
  return <StepContext value={{ status: result.info.status, position: result.position }}><li {...props} {...result.props} ref={composedRef} className={cn(stepClassName, className)} onClick={(event: MouseEvent<HTMLLIElement>) => { onClick?.(event); if (!event.defaultPrevented) result.props.onClick(event) }} onKeyDown={(event: KeyboardEvent<HTMLLIElement>) => { onKeyDown?.(event); if (!event.defaultPrevented) result.props.onKeyDown(event) }}>{children}</li></StepContext>
}

export interface StepIndicatorProps extends HTMLAttributes<HTMLSpanElement> { children?: ReactNode }
export function StepIndicator({ children, className, ...props }: StepIndicatorProps) {
  const step = useStepContext('StepIndicator')
  return <span {...props} className={cn(stepIndicatorClassName, className)}>{children ?? (step.status === 'finish' ? <CheckIcon /> : step.position)}</span>
}

export interface StepContentProps extends HTMLAttributes<HTMLDivElement> { children?: ReactNode }
export function StepContent({ className, ...props }: StepContentProps) { return <div {...props} className={cn(stepContentClassName, className)} /> }

export type { StepBuiltinStatus, StepInfo, StepRecord, StepsChangeMeta, StepsChangeTrigger, StepsOrientation, StepStatus, StepValue } from '@fex-design/core/steps/types'
export { useSteps }
