import { createSelectionController } from '@fex/components-core/selection/create-selection-controller'
import type { SelectionChangeMeta, SelectionValue } from '@fex/components-core/selection/types'
import {
  radioButtonClassName,
  radioGroupClassName,
  radioIndicatorClassName,
  radioRootClassName,
  type RadioButtonStyleProps,
  type RadioGroupStyleProps,
  type RadioStyleProps,
} from '@fex/components-styles/radio'
import { cn } from '@fex/utils'
import { computed, defineComponent, h, inject, provide, type InjectionKey, type PropType } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'

export type RadioValue = SelectionValue

export interface RadioChangeMeta {
  previousValue: RadioValue | undefined
  value: RadioValue
  changedValues: SelectionChangeMeta['changedValues']
}

interface RadioContextValue {
  value: () => RadioValue | undefined
  disabled: () => boolean
  select: (value: RadioValue) => void
}

const radioContextKey: InjectionKey<RadioContextValue> = Symbol('RadioContext')

function toRadioChangeMeta(value: RadioValue, meta: SelectionChangeMeta): RadioChangeMeta {
  return {
    previousValue: meta.previousValues[0],
    value,
    changedValues: meta.changedValues,
  }
}

function useRadioContext(componentName: string) {
  const context = inject(radioContextKey, null)
  if (context === null) {
    throw new Error(`${componentName} must be used inside RadioGroup.`)
  }
  return context
}

export const RadioGroup = defineComponent({
  name: 'RadioGroup',
  inheritAttrs: false,
  props: {
    value: { type: [String, Number] as PropType<RadioValue | undefined>, default: undefined },
    defaultValue: { type: [String, Number] as PropType<RadioValue | undefined>, default: undefined },
    disabled: Boolean,
    orientation: { type: String as PropType<RadioGroupStyleProps['orientation']>, default: 'vertical' },
  },
  emits: {
    valueChange: (_value: RadioValue, _meta: RadioChangeMeta) => true,
  },
  setup(props, { attrs, slots, emit }) {
    const controller = createSelectionController({
      get value() {
        return props.value
      },
      get defaultValue() {
        return props.defaultValue
      },
      get multiple() {
        return false
      },
      onChange(values, meta) {
        const nextValue = values[0]
        if (nextValue === undefined) return
        emit('valueChange', nextValue, toRadioChangeMeta(nextValue, meta))
      },
    })
    const snapshot = useCoreStore(controller)
    const currentValue = computed(() => props.value ?? snapshot.value.value)

    provide(radioContextKey, {
      value: () => currentValue.value,
      disabled: () => props.disabled,
      select: (nextValue) => controller.replace(nextValue),
    })

    return () =>
      h(
        'div',
        {
          ...attrs,
          role: 'radiogroup',
          'data-orientation': props.orientation,
          'data-disabled': props.disabled ? 'true' : undefined,
          class: cn(radioGroupClassName({ orientation: props.orientation }), attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})

export const Radio = defineComponent({
  name: 'Radio',
  inheritAttrs: false,
  props: {
    value: { type: [String, Number] as PropType<RadioValue>, required: true },
    disabled: Boolean,
    size: { type: String as PropType<RadioStyleProps['size']>, default: 'default' },
  },
  setup(props, { attrs, slots }) {
    const context = useRadioContext('Radio')
    const checked = computed(() => context.value() === props.value)
    const currentDisabled = computed(() => context.disabled() || props.disabled)

    return () =>
      h(
        'button',
        {
          ...attrs,
          type: 'button',
          role: 'radio',
          disabled: currentDisabled.value,
          'aria-checked': checked.value,
          'data-state': checked.value ? 'checked' : 'unchecked',
          'data-disabled': currentDisabled.value ? 'true' : undefined,
          'data-value': props.value,
          class: cn(radioRootClassName({ size: props.size }), attrs.class as string | undefined),
          onClick: (event: MouseEvent) => {
            if (event.defaultPrevented || currentDisabled.value) return
            context.select(props.value)
          },
        },
        [checked.value ? h('span', { class: radioIndicatorClassName({ size: props.size }) }) : null, slots.default?.()],
      )
  },
})

export const RadioButton = defineComponent({
  name: 'RadioButton',
  inheritAttrs: false,
  props: {
    value: { type: [String, Number] as PropType<RadioValue>, required: true },
    disabled: Boolean,
    size: { type: String as PropType<RadioButtonStyleProps['size']>, default: 'default' },
  },
  setup(props, { attrs, slots }) {
    const context = useRadioContext('RadioButton')
    const checked = computed(() => context.value() === props.value)
    const currentDisabled = computed(() => context.disabled() || props.disabled)

    return () =>
      h(
        'button',
        {
          ...attrs,
          type: 'button',
          role: 'radio',
          disabled: currentDisabled.value,
          'aria-checked': checked.value,
          'data-state': checked.value ? 'checked' : 'unchecked',
          'data-disabled': currentDisabled.value ? 'true' : undefined,
          'data-value': props.value,
          class: cn(radioButtonClassName({ size: props.size }), attrs.class as string | undefined),
          onClick: (event: MouseEvent) => {
            if (event.defaultPrevented || currentDisabled.value) return
            context.select(props.value)
          },
        },
        slots.default?.(),
      )
  },
})
