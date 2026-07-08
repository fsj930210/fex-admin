import {
  checkboxCheckIconClassName,
  checkboxClassName,
  checkboxGroupClassName,
  checkboxIndicatorClassName,
  checkboxMinusIconClassName,
  type CheckboxGroupStyleProps,
  type CheckboxStyleProps,
} from '@fex/components-styles/checkbox'
import { cn } from '@fex/utils'
import { defineComponent, h, type PropType } from 'vue'
import { CheckIcon } from '../../icon/check'
import { MinusIcon } from '../../icon/minus'
import {
  CheckboxGroup as PrimitiveCheckboxGroup,
  CheckboxIndicator,
  CheckboxRoot,
  type CheckboxChangeMeta,
  type CheckboxCheckedState,
} from '../../primitive/checkbox/checkbox'

export const Checkbox = defineComponent({
  name: 'Checkbox',
  inheritAttrs: false,
  props: {
    size: String,
    checked: { type: [Boolean, String] as PropType<CheckboxCheckedState | undefined>, default: undefined },
    defaultChecked: { type: [Boolean, String] as PropType<CheckboxCheckedState | undefined>, default: undefined },
    disabled: Boolean,
  },
  emits: ['checkedChange'],
  setup(props, { attrs, slots, emit }) {
    return () => {
      const rootProps = {
        ...attrs,
        disabled: props.disabled,
        class: cn(checkboxClassName({ size: props.size as CheckboxStyleProps['size'] }), attrs.class as string | undefined),
        'data-slot': 'checkbox',
        onCheckedChange: (checked: CheckboxCheckedState, meta: CheckboxChangeMeta) => emit('checkedChange', checked, meta),
      }
      if (props.checked !== undefined) {
        Object.assign(rootProps, { checked: props.checked })
      }
      if (props.defaultChecked !== undefined) {
        Object.assign(rootProps, { defaultChecked: props.defaultChecked })
      }

      return h(
        CheckboxRoot,
        rootProps,
        {
          default: ({ checked }: { checked: boolean | 'indeterminate' }) =>
            h(
              CheckboxIndicator,
              {
                checked,
                'data-slot': 'checkbox-indicator',
                class: checkboxIndicatorClassName,
              },
              {
                default: () =>
                  slots.default?.() ?? [
                    h(CheckIcon, { class: checkboxCheckIconClassName }),
                    h(MinusIcon, { class: checkboxMinusIconClassName }),
                  ],
              },
            ),
        },
      )
    }
  },
})

export const CheckboxGroup = defineComponent({
  name: 'CheckboxGroup',
  inheritAttrs: false,
  props: {
    orientation: {
      type: String,
      default: 'vertical',
    },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        PrimitiveCheckboxGroup,
        {
          ...attrs,
          'data-slot': 'checkbox-group',
          'data-orientation': props.orientation,
          class: cn(
            checkboxGroupClassName({ orientation: props.orientation as CheckboxGroupStyleProps['orientation'] }),
            attrs.class as string | undefined,
          ),
        },
        slots.default?.(),
      )
  },
})

export default Checkbox
