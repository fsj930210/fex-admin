<script lang="ts">
  import { createSelectionController } from '@fex/components-core/selection/create-selection-controller'
  import type { SelectionValue } from '@fex/components-core/selection/types'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { setContext } from 'svelte'
  import { readableCoreStore } from '../../stores/core-store'
  import { listboxContextKey, type ListboxOrientation } from './context'

  type ListboxChangeMeta<TItem> = {
    selectedItem?: TItem
    selectedItems: TItem[]
    selectedValues: SelectionValue[]
    previousSelectedValues: SelectionValue[]
    changedValues: SelectionValue[]
  }

  interface ListboxProps<TItem> extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
    items?: readonly TItem[]
    value?: SelectionValue | SelectionValue[]
    defaultValue?: SelectionValue | SelectionValue[]
    multiple?: boolean
    disabled?: boolean
    orientation?: ListboxOrientation
    getItemValue?: (item: TItem) => SelectionValue
    getItemDisabled?: (item: TItem) => boolean
    onChange?: (value: SelectionValue | SelectionValue[] | undefined, meta: ListboxChangeMeta<TItem>) => void
    children?: Snippet
  }

  let {
    items = [],
    value,
    defaultValue,
    multiple = false,
    disabled = false,
    orientation = 'vertical',
    getItemValue,
    getItemDisabled,
    onChange,
    children,
    class: className,
    ...rest
  }: ListboxProps<unknown> = $props()

  const optionMap = $derived.by(() => {
    const map = new Map<SelectionValue, unknown>()
    for (const item of items) {
      const itemValue = getItemValue ? getItemValue(item) : (item as { value: SelectionValue }).value
      map.set(itemValue, item)
    }
    return map
  })

  const disabledValues = $derived.by(() => {
    const values: SelectionValue[] = []
    for (const item of items) {
      const itemValue = getItemValue ? getItemValue(item) : (item as { value: SelectionValue }).value
      if (disabled || getItemDisabled?.(item) || (item as { disabled?: boolean }).disabled) {
        values.push(itemValue)
      }
    }
    return values
  })

  const controller = createSelectionController({
    get value() {
      return value
    },
    get defaultValue() {
      return defaultValue
    },
    get multiple() {
      return multiple
    },
    get disabledValues() {
      return disabledValues
    },
    onChange(values, meta) {
      const selectedItems = values.map((itemValue) => optionMap.get(itemValue)).filter((item) => item !== undefined)
      onChange?.(multiple ? values : values[0], {
        selectedItem: selectedItems[0],
        selectedItems,
        selectedValues: values,
        previousSelectedValues: meta.previousValues,
        changedValues: meta.changedValues,
      })
    },
  })
  const snapshot = readableCoreStore(controller)

  setContext(listboxContextKey, {
    controller,
    snapshot,
    orientation: () => orientation,
    selectedValues: () => {
      void value
      void multiple
      void $snapshot.values
      return controller.getSnapshot().values
    },
    selectItem(itemValue: SelectionValue) {
      if ($snapshot.multiple) {
        controller.toggle(itemValue)
        return
      }
      controller.replace(itemValue)
    },
  })
</script>

<div
  {...rest}
  class={className}
  role="listbox"
  aria-multiselectable={$snapshot.multiple || undefined}
  aria-orientation={orientation}
  data-orientation={orientation}
  data-slot="listbox"
>
  {@render children?.()}
</div>
