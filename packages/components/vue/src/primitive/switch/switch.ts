import { switchClassName, switchThumbClassName, type SwitchStyleProps } from '@fex/components-styles/switch'
import { cn } from '@fex/utils'
import { computed, defineComponent, h, ref, type PropType } from 'vue'

export type SwitchState = 'checked' | 'unchecked'

export const SwitchRoot = defineComponent({
  name: 'SwitchRoot',
  inheritAttrs: false,
  props: {
    checked: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    defaultChecked: Boolean,
    disabled: Boolean,
    size: { type: String as PropType<SwitchStyleProps['size']>, default: 'default' },
  },
  emits: {
    checkedChange: (_checked: boolean, _event: MouseEvent) => true,
  },
  setup(props, { attrs, emit, slots }) {
    const internalChecked = ref(props.defaultChecked)
    const currentChecked = computed(() => props.checked ?? internalChecked.value)
    const state = computed<SwitchState>(() => (currentChecked.value ? 'checked' : 'unchecked'))

    return () =>
      h(
        'button',
        {
          ...attrs,
          type: 'button',
          role: 'switch',
          disabled: props.disabled,
          'aria-checked': currentChecked.value,
          'data-state': state.value,
          'data-disabled': props.disabled ? 'true' : undefined,
          class: cn(switchClassName({ size: props.size }), attrs.class as string | undefined),
          onClick: (event: MouseEvent) => {
            const attrClick = attrs.onClick
            if (typeof attrClick === 'function') attrClick(event)
            if (event.defaultPrevented || props.disabled) return
            const nextChecked = !currentChecked.value
            if (props.checked === undefined) internalChecked.value = nextChecked
            emit('checkedChange', nextChecked, event)
          },
        },
        slots.default?.({ checked: currentChecked.value, state: state.value, size: props.size }),
      )
  },
})

export const SwitchThumb = defineComponent({
  name: 'SwitchThumb',
  inheritAttrs: false,
  props: {
    checked: Boolean,
    size: { type: String as PropType<SwitchStyleProps['size']>, default: 'default' },
  },
  setup(props, { attrs }) {
    const state = computed<SwitchState>(() => (props.checked ? 'checked' : 'unchecked'))

    return () =>
      h('span', {
        ...attrs,
        'data-state': state.value,
        class: cn(switchThumbClassName({ size: props.size }), attrs.class as string | undefined),
      })
  },
})
