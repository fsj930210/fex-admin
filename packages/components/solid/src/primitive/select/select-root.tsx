import { createSelectController } from '@fex/components-core/select/create-select-controller'
import { filterSelectOptions, groupSelectOptions } from '@fex/components-core/select/filter-options'
import { getSelectVirtualRange } from '@fex/components-core/select/virtual'
import type {
  SelectFilterOption,
  SelectMode,
  SelectOption,
  SelectVirtualOptions,
} from '@fex/components-core/select/types'
import { createSelectionController } from '@fex/components-core/selection/create-selection-controller'
import type { SelectionValue } from '@fex/components-core/selection/types'
import {
  selectClearClassName,
  selectContentClassName,
  selectEmptyClassName,
  selectGroupLabelClassName,
  selectIndicatorClassName,
  selectInputClassName,
  selectListClassName,
  selectLoadingClassName,
  selectOptionClassName,
  selectOptionIndicatorClassName,
  selectOptionLabelClassName,
  selectPlaceholderClassName,
  selectSuffixClassName,
  selectTagClassName,
  selectTagOverflowClassName,
  selectTagRemoveClassName,
  selectTriggerClassName,
  selectValueClassName,
  selectValueContainerClassName,
} from '@fex/components-styles/select'
import { cn } from '@fex/utils'
import {
  createMemo,
  createSignal,
  createUniqueId,
  For,
  Show,
  splitProps,
  type JSX,
  type ParentProps,
} from 'solid-js'
import { CheckIcon } from '../../icon/check'
import { ChevronDownIcon } from '../../icon/chevron'
import { CloseIcon } from '../../icon/close'
import { LoadingIcon } from '../../icon/loading'
import { createCoreStoreSignal } from '../../primitives/create-core-store-signal'
import { Button } from '../button/button'
import { Popover, PopoverContent, PopoverPortal, PopoverTrigger } from '../popover/popover'
import { SelectContext, useSelect } from './select-context'

export interface SelectChangeMeta {
  selectedItem?: SelectOption | undefined
  selectedItems: SelectOption[]
  previousSelectedValues: SelectionValue[]
  changedValues: SelectionValue[]
}
export interface SelectRootProps extends ParentProps {
  options?: readonly SelectOption[]
  mode?: SelectMode
  multiple?: boolean
  value?: SelectionValue | SelectionValue[]
  defaultValue?: SelectionValue | SelectionValue[]
  onChange?: (value: SelectionValue | SelectionValue[] | undefined, meta: SelectChangeMeta) => void
  showSearch?: boolean
  filterOption?: SelectFilterOption
  onSearch?: (keyword: string) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  clearable?: boolean
  loading?: boolean
  disabled?: boolean
  virtual?: SelectVirtualOptions
  maxCount?: number
  status?: 'error' | 'warning' | undefined
}
export function SelectRoot(props: SelectRootProps) {
  const multiple = () => props.multiple === true || props.mode === 'tags'
  const selection = createSelectionController({
    get value() {
      return props.value
    },
    get defaultValue() {
      return props.defaultValue
    },
    get multiple() {
      return multiple()
    },
    get disabledValues() {
      return props.options?.filter((item) => item.disabled).map((item) => item.value)
    },
    onChange(values, meta) {
      const resolve = (value: SelectionValue) =>
        props.options?.find((item) => item.value === value) ?? { value, label: String(value) }
      const selectedItems = values.map(resolve)
      const selectedItem =
        meta.changedValues.map(resolve).find((item) => values.includes(item.value)) ??
        selectedItems[0]
      props.onChange?.(multiple() ? values : values[0], {
        selectedItem,
        selectedItems,
        previousSelectedValues: [...meta.previousValues],
        changedValues: [...meta.changedValues],
      })
    },
  })
  let controller!: ReturnType<typeof createSelectController>
  controller = createSelectController({
    selection,
    get options() {
      return filterSelectOptions(
        props.options ?? [],
        controller.getSnapshot().searchValue,
        props.filterOption,
      )
    },
    get mode() {
      return props.mode
    },
    get multiple() {
      return multiple()
    },
    get maxCount() {
      return props.maxCount
    },
    get open() {
      return props.open
    },
    get defaultOpen() {
      return props.defaultOpen
    },
    onOpenChange: (open) => props.onOpenChange?.(open),
    onSearch: (keyword) => props.onSearch?.(keyword),
  })
  const snapshot = createCoreStoreSignal(controller)
  const options = () => props.options ?? []
  const visibleOptions = createMemo(() =>
    filterSelectOptions(options(), snapshot().searchValue, props.filterOption),
  )
  const selectedOptions = createMemo(() => {
    snapshot()
    return selection
      .getSnapshot()
      .values.map(
        (value) =>
          options().find((item) => item.value === value) ?? { value, label: String(value) },
      )
  })
  const context = {
    controller,
    snapshot,
    options,
    visibleOptions,
    selectedOptions,
    multiple,
    tags: () => props.mode === 'tags',
    showSearch: () => props.showSearch === true || props.mode === 'tags',
    disabled: () => props.disabled === true,
    clearable: () => props.clearable === true,
    loading: () => props.loading === true,
    status: () => props.status,
    virtual: () => props.virtual,
    listId: `select-${createUniqueId()}`,
    removeValue: (value: SelectionValue) => selection.unselect(value),
  }
  return (
    <SelectContext.Provider value={context}>
      <Popover
        open={snapshot().open}
        defaultOpen={props.defaultOpen ?? false}
        onOpenChange={(open) => (open ? controller.open() : controller.close())}
      >
        {props.children}
      </Popover>
    </SelectContext.Provider>
  )
}
