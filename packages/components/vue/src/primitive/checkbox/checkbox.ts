import { createCheckboxController } from '@fex/components-core/checkbox/create-checkbox-controller'
import type { CheckboxChangeMeta, CheckboxCheckedState } from '@fex/components-core/checkbox/types'
import { cn } from '@fex/utils'
import { computed, defineComponent, h } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'

export type { CheckboxChangeMeta, CheckboxCheckedState } from '@fex/components-core/checkbox/types'

export const CheckboxRoot = defineComponent({
  name: 'CheckboxRoot',
  inheritAttrs: false,
  props: {
    checked: { type: [Boolean, String], default: undefined },
    defaultChecked: { type: [Boolean, String], default: undefined },
    disabled: Boolean,
  },
  emits: {
    checkedChange: (_checked: CheckboxCheckedState, _meta: CheckboxChangeMeta) => true,
  },
  setup(props, { attrs, slots, emit }) {
    const controller = createCheckboxController({
      get checked() {
        return props.checked as CheckboxCheckedState | undefined
      },
      get defaultChecked() {
        return props.defaultChecked as CheckboxCheckedState | undefined
      },
      get disabled() {
        return props.disabled
      },
    })
    const snapshot = useCoreStore(controller)
    const currentChecked = computed(() => (props.checked as CheckboxCheckedState | undefined) ?? snapshot.value.checked)
    const currentDisabled = computed(() => props.disabled || snapshot.value.disabled)
    const state = computed(() =>
      currentChecked.value === 'indeterminate' ? 'indeterminate' : currentChecked.value ? 'checked' : 'unchecked',
    )

    return () =>
      h(
        'button',
        {
          ...attrs,
          type: 'button',
          role: 'checkbox',
          disabled: currentDisabled.value,
          'aria-checked': currentChecked.value === 'indeterminate' ? 'mixed' : currentChecked.value,
          'data-state': state.value,
          'data-disabled': currentDisabled.value ? 'true' : undefined,
          class: attrs.class,
          onClick: (event: MouseEvent) => {
            if (event.defaultPrevented) return
            if (currentDisabled.value) return
            const meta =
              props.checked === undefined
                ? controller.toggle()
                : {
                    previousChecked: currentChecked.value,
                    checked: currentChecked.value === true ? false : true,
                  }
            if (meta) emit('checkedChange', meta.checked, meta)
          },
        },
        slots.default?.({ checked: currentChecked.value, state: state.value }),
      )
  },
})

export const CheckboxIndicator = defineComponent({
  name: 'CheckboxIndicator',
  props: {
    forceMount: Boolean,
    checked: { type: [Boolean, String], default: undefined },
    class: String,
  },
  setup(props, { slots, attrs }) {
    return () => {
      if (!props.forceMount && props.checked === false) return null
      const state = props.checked === 'indeterminate' ? 'indeterminate' : props.checked ? 'checked' : 'unchecked'
      return h('span', { ...attrs, class: cn(props.class, attrs.class as string | undefined), 'data-state': state }, slots.default?.())
    }
  },
})

export const CheckboxGroup = defineComponent({
  name: 'CheckboxGroup',
  setup(_, { slots, attrs }) {
    return () => h('div', attrs, slots.default?.())
  },
})
