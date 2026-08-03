import { createStepsController } from '@fex/components-core/steps/create-steps-controller'
import type {
  StepRecord,
  StepsChangeMeta,
  StepsOrientation,
  StepValue,
} from '@fex/components-core/steps/types'
import { useRef, type KeyboardEvent, type MouseEvent, type RefCallback } from 'react'
import { useCoreStore } from '../../hooks/use-core-store'
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect'
import { useLazyRef } from '../../hooks/use-lazy-ref'
import { useMemoizedFn } from '../../hooks/use-memoized-fn'

export interface UseStepsOptions<TData = unknown> {
  current?: StepValue
  defaultCurrent?: StepValue
  navigation?: boolean
  orientation?: StepsOrientation
  responsive?: boolean
  onChange?: (value: StepValue, meta: StepsChangeMeta<TData>) => void
}

export function useSteps<TData = unknown>(options: UseStepsOptions<TData> = {}) {
  const optionsRef = useRef(options)
  optionsRef.current = options
  const elements = useRef(new Map<StepValue, HTMLElement>())
  const records = useRef(new Map<StepValue, StepRecord<TData>>())
  const refs = useRef(new Map<StepValue, RefCallback<HTMLElement>>())
  const controllerRef = useLazyRef(() =>
    createStepsController<TData>({
      get current() { return optionsRef.current.current },
      get defaultCurrent() { return optionsRef.current.defaultCurrent },
      get navigation() { return optionsRef.current.navigation },
      onChange(value, meta) { optionsRef.current.onChange?.(value, meta) },
    }),
  )
  const controller = controllerRef.current
  useIsomorphicLayoutEffect(() => controller.updateOptions(options), [controller, options])
  const snapshot = useCoreStore(controller)
  const orientation = options.orientation ?? 'horizontal'
  const navigation = options.navigation === true

  const syncOrder = () => {
    const orderedElements = [...elements.current.entries()].sort((left, right) =>
      left[1].compareDocumentPosition(right[1]) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
    )
    controller.setOrder(orderedElements.map(([value]) => value))
  }

  const getStepProps = useMemoizedFn((record: StepRecord<TData>) => {
    records.current.set(record.value, record)
    if (elements.current.has(record.value)) controller.registerStep(record)
    let ref = refs.current.get(record.value)
    if (!ref) {
      ref = (element) => {
        if (element) {
          elements.current.set(record.value, element)
          const latest = records.current.get(record.value)
          if (latest) controller.registerStep(latest)
          syncOrder()
        } else {
          elements.current.delete(record.value)
          controller.unregisterStep(record.value)
          syncOrder()
        }
      }
      refs.current.set(record.value, ref)
    }
    const info = controller.getStepInfo(record.value) ?? {
      value: record.value,
      status: record.status ?? 'wait',
      disabled: record.disabled === true,
      ...(record.data === undefined ? {} : { data: record.data }),
    }
    const position = controller.getPosition(record.value)
    return {
      info,
      position: position < 0 ? records.current.size : position + 1,
      props: {
        ref,
        role: navigation ? ('button' as const) : undefined,
        tabIndex: navigation && !info.disabled ? (snapshot.current === record.value ? 0 : -1) : undefined,
        'aria-current': snapshot.current === record.value ? ('step' as const) : undefined,
        'aria-disabled': info.disabled || undefined,
        'data-status': info.status,
        'data-disabled': info.disabled || undefined,
        'data-navigation': navigation || undefined,
        onClick: (event: MouseEvent<HTMLElement>) => {
          if (!event.defaultPrevented) controller.select(record.value, 'pointer')
        },
        onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
          if (!navigation || info.disabled) return
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            controller.select(record.value, 'keyboard')
            return
          }
          const direction = event.key === 'Home' ? 'first' : event.key === 'End' ? 'last'
            : event.key === (orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown') ? 'next'
              : event.key === (orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp') ? 'previous' : undefined
          if (!direction) return
          event.preventDefault()
          const value = controller.move(record.value, direction)
          if (value !== undefined) {
            elements.current.get(value)?.focus()
            controller.select(value, 'keyboard')
          }
        },
      },
    }
  })

  return { snapshot, orientation, navigation, responsive: options.responsive ?? true, getStepProps }
}
