import { createSelectionController } from '@fex/components-core/selection/create-selection-controller'
import type { SelectionValue } from '@fex/components-core/selection/types'
import { computed, defineComponent, h, inject, provide, type ComputedRef, type PropType, type ShallowRef } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'

type ListboxOrientation = 'vertical' | 'horizontal'

const ListboxContextKey = Symbol('ListboxContext')

type ListboxContext = {
  orientation: ListboxOrientation
  snapshot: ShallowRef<{ values: SelectionValue[]; multiple: boolean }>
  selectedValues: ComputedRef<SelectionValue[]>
  isSelected: (value: SelectionValue) => boolean
  isDisabled: (value: SelectionValue) => boolean
  selectItem: (value: SelectionValue) => void
}

function useListboxContext(component: string) {
  const context = inject<ListboxContext>(ListboxContextKey)
  if (!context) {
    throw new Error(`${component} must be used inside ListboxRoot.`)
  }
  return context
}

export const ListboxRoot = defineComponent({
  name: 'ListboxRoot',
  props: {
    items: { type: Array as PropType<readonly unknown[]>, default: () => [] },
    value: { type: [String, Number, Array] as PropType<SelectionValue | SelectionValue[] | undefined> },
    defaultValue: { type: [String, Number, Array] as PropType<SelectionValue | SelectionValue[] | undefined> },
    multiple: Boolean,
    disabled: Boolean,
    orientation: { type: String as PropType<ListboxOrientation>, default: 'vertical' },
    getItemValue: Function as PropType<(item: unknown) => SelectionValue>,
    getItemDisabled: Function as PropType<(item: unknown) => boolean>,
  },
  emits: ['change'],
  setup(props, { slots, attrs, emit }) {
    const getOptionMap = () => {
      const map = new Map<SelectionValue, unknown>()
      for (const item of props.items) {
        const itemValue = props.getItemValue
          ? props.getItemValue(item)
          : (item as { value: SelectionValue }).value
        map.set(itemValue, item)
      }
      return map
    }

    const getDisabledValues = () => {
      const values: SelectionValue[] = []
      for (const item of props.items) {
        const itemValue = props.getItemValue
          ? props.getItemValue(item)
          : (item as { value: SelectionValue }).value
        if (props.disabled || props.getItemDisabled?.(item) || (item as { disabled?: boolean }).disabled) {
          values.push(itemValue)
        }
      }
      return values
    }

    const options = {
      get value() {
        return props.value
      },
      get defaultValue() {
        return props.defaultValue
      },
      get multiple() {
        return props.multiple
      },
      get disabledValues() {
        return getDisabledValues()
      },
      onChange(values: SelectionValue[], meta: { previousValues: SelectionValue[]; changedValues: SelectionValue[] }) {
        const optionMap = getOptionMap()
        const selectedItems = values
          .map((value) => optionMap.get(value))
          .filter((item) => item !== undefined)
        emit('change', props.multiple ? values : values[0], {
          selectedItem: selectedItems[0],
          selectedItems,
          selectedValues: values,
          previousSelectedValues: meta.previousValues,
          changedValues: meta.changedValues,
        })
      },
    }
    const controller = createSelectionController(options)
    const snapshot = useCoreStore(controller)
    const selectedValues = computed(() => {
      props.value
      props.multiple
      snapshot.value.values
      return controller.getSnapshot().values
    })

    provide(ListboxContextKey, {
      orientation: props.orientation,
      snapshot,
      selectedValues,
      isSelected: controller.isSelected,
      isDisabled: controller.isDisabled,
      selectItem: (value: SelectionValue) => {
        if (snapshot.value.multiple) {
          controller.toggle(value)
          return
        }
        controller.replace(value)
      },
    })

    return () =>
      h(
        'div',
        {
          ...attrs,
          role: 'listbox',
          'aria-multiselectable': snapshot.value.multiple || undefined,
          'aria-orientation': props.orientation,
          'data-orientation': props.orientation,
          'data-slot': 'listbox',
        },
        slots.default?.(),
      )
  },
})

export const ListboxGroup = defineComponent({
  name: 'ListboxGroup',
  setup(_, { slots, attrs }) {
    const context = useListboxContext('ListboxGroup')
    return () =>
      h(
        'div',
        { ...attrs, role: 'group', 'data-slot': 'listbox-group', 'data-orientation': context.orientation },
        slots.default?.(),
      )
  },
})

export const ListboxGroupLabel = defineComponent({
  name: 'ListboxGroupLabel',
  setup(_, { slots, attrs }) {
    return () => h('div', { ...attrs, 'data-slot': 'listbox-group-label' }, slots.default?.())
  },
})

export const ListboxItem = defineComponent({
  name: 'ListboxItem',
  props: {
    value: { type: [String, Number] as PropType<SelectionValue>, required: true },
    disabled: Boolean,
  },
  emits: ['select'],
  setup(props, { slots, attrs, emit }) {
    const context = useListboxContext('ListboxItem')
    const selected = computed(() => context.selectedValues.value.includes(props.value))
    const itemDisabled = computed(() => props.disabled || context.isDisabled(props.value))
    const select = () => {
      if (itemDisabled.value) {
        return
      }
      context.selectItem(props.value)
      emit('select', props.value)
    }

    return () =>
      h(
        'div',
        {
          ...attrs,
          role: 'option',
          tabindex: itemDisabled.value ? undefined : 0,
          'aria-selected': selected.value,
          'aria-disabled': itemDisabled.value || undefined,
          'data-slot': 'listbox-item',
          'data-selected': selected.value ? 'true' : 'false',
          'data-disabled': itemDisabled.value ? 'true' : undefined,
          onClick: select,
          onKeydown: (event: KeyboardEvent) => {
            if (event.key !== 'Enter' && event.key !== ' ') {
              return
            }
            event.preventDefault()
            select()
          },
        },
        slots.default?.(),
      )
  },
})

export const ListboxItemIndicator = defineComponent({
  name: 'ListboxItemIndicator',
  setup(_, { slots, attrs }) {
    return () => h('span', { ...attrs, 'aria-hidden': 'true', 'data-slot': 'listbox-item-indicator' }, slots.default?.())
  },
})
