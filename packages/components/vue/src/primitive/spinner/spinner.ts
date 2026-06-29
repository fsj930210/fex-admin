import { spinnerClassName, type SpinnerStyleProps } from '@fex/components-styles/spinner'
import { cn } from '@fex/utils'
import { defineComponent, h, type PropType } from 'vue'
import { LoadingIcon } from '../../icon/loading'

export const Spinner = defineComponent({
  name: 'Spinner',
  inheritAttrs: false,
  props: { size: String as PropType<SpinnerStyleProps['size']> },
  setup(props, { attrs }) {
    return () => h('span', { ...attrs, 'data-slot': 'spinner', class: cn(spinnerClassName({ size: props.size }), attrs.class as string | undefined) }, [h(LoadingIcon)])
  },
})
