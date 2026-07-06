import {
  listboxGroupClassName,
  listboxGroupLabelClassName,
  listboxItemClassName,
  listboxItemContentClassName,
  listboxItemDescriptionClassName,
  listboxItemIndicatorClassName,
  listboxItemTitleClassName,
  listboxRootClassName,
} from '@fex/components-styles/listbox'
import { cn } from '@fex/utils'
import { defineComponent, h, type Component } from 'vue'
import { CheckIcon } from '../../icon/check'
import {
  ListboxGroup as PrimitiveListboxGroup,
  ListboxGroupLabel as PrimitiveListboxGroupLabel,
  ListboxItem as PrimitiveListboxItem,
  ListboxItemIndicator as PrimitiveListboxItemIndicator,
  ListboxRoot as PrimitiveListboxRoot,
} from '../../primitive/listbox/listbox'

export const ListboxRoot = defineComponent({
  name: 'ListboxRoot',
  extends: PrimitiveListboxRoot,
  emits: ['change'],
  setup(props, context) {
    return () =>
      h(
        PrimitiveListboxRoot as Component,
        {
          ...props,
          ...context.attrs,
          class: cn(listboxRootClassName({}), context.attrs.class as string),
          onChange: (...args: unknown[]) => context.emit('change', ...args),
        },
        context.slots,
      )
  },
})

export const ListboxGroup = defineComponent({
  name: 'ListboxGroup',
  setup(_, context) {
    return () => h(PrimitiveListboxGroup as Component, { ...context.attrs, class: cn(listboxGroupClassName, context.attrs.class as string) }, context.slots)
  },
})

export const ListboxGroupLabel = defineComponent({
  name: 'ListboxGroupLabel',
  setup(_, context) {
    return () =>
      h(PrimitiveListboxGroupLabel as Component, { ...context.attrs, class: cn(listboxGroupLabelClassName, context.attrs.class as string) }, context.slots)
  },
})

export const ListboxItem = defineComponent({
  name: 'ListboxItem',
  props: PrimitiveListboxItem.props,
  setup(props, context) {
    return () =>
      h(
        PrimitiveListboxItem as Component,
        { ...props, ...context.attrs, class: cn(listboxItemClassName({}), context.attrs.class as string) },
        context.slots.default
          ? context.slots
          : {
              default: () => [
                h('span', { class: listboxItemContentClassName }, [
                  h('span', { class: listboxItemTitleClassName }, context.attrs.title as string),
                  context.attrs.description
                    ? h('span', { class: listboxItemDescriptionClassName }, context.attrs.description as string)
                    : null,
                ]),
                h(PrimitiveListboxItemIndicator as Component, { class: listboxItemIndicatorClassName }, () =>
                  h(CheckIcon),
                ),
              ],
            },
      )
  },
})

export const ListboxItemIndicator = defineComponent({
  name: 'ListboxItemIndicator',
  setup(_, context) {
    return () =>
      h(
        PrimitiveListboxItemIndicator as Component,
        { ...context.attrs, class: cn(listboxItemIndicatorClassName, context.attrs.class as string) },
        context.slots.default ? context.slots : { default: () => h(CheckIcon) },
      )
  },
})

export { ListboxRoot as Listbox }
