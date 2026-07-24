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
  type ComponentProps,
  type KeyboardEvent,
  type ReactNode,
  useId,
  useRef,
  useState,
} from 'react'
import { ChevronDownIcon } from '../../icon/chevron'
import { CheckIcon } from '../../icon/check'
import { LoadingIcon } from '../../icon/loading'
import { CloseIcon } from '../../icon/close'
import { useCoreStore } from '../../hooks/use-core-store'
import { useMemoizedFn } from '../../hooks/use-memoized-fn'
import { InputClearButton } from '../input/input'
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from '../popover/popover'
import { SelectContext } from './select-context'
import { useSelect, useSelectOption } from './use-select'

export interface SelectChangeMeta {
  selectedItem?: SelectOption | undefined
  selectedItems: SelectOption[]
  previousSelectedValues: SelectionValue[]
  changedValues: SelectionValue[]
}

export interface SelectRootProps extends Omit<
  ComponentProps<typeof PopoverRoot>,
  'children' | 'onOpenChange' | 'open'
> {
  children?: ReactNode
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
  placeholder?: string
  virtual?: SelectVirtualOptions
  maxCount?: number
  status?: 'error' | 'warning'
}

export function SelectRoot(props: SelectRootProps) {
  const multiple = props.multiple === true || props.mode === 'tags'
  const optionsRef = useRef({ ...props, multiple })
  Object.assign(optionsRef.current, props, { multiple })
  const selectionRef = useRef<ReturnType<typeof createSelectionController> | null>(null)
  selectionRef.current ??= createSelectionController({
    get value() {
      return optionsRef.current.value
    },
    get defaultValue() {
      return optionsRef.current.defaultValue
    },
    get multiple() {
      return optionsRef.current.multiple
    },
    get disabledValues() {
      return optionsRef.current.options?.filter((item) => item.disabled).map((item) => item.value)
    },
    onChange: (values, meta) => {
      const resolveOption = (value: SelectionValue) =>
        optionsRef.current.options?.find((item) => item.value === value) ?? {
          value,
          label: String(value),
        }
      const selectedItems = values.map(resolveOption)
      const selectedItem =
        meta.changedValues.map(resolveOption).find((item) => values.includes(item.value)) ??
        selectedItems[0]
      optionsRef.current.onChange?.(optionsRef.current.multiple ? values : values[0], {
        selectedItem,
        selectedItems,
        previousSelectedValues: meta.previousValues,
        changedValues: meta.changedValues,
      })
    },
  })
  const controllerRef = useRef<ReturnType<typeof createSelectController> | null>(null)
  controllerRef.current ??= createSelectController({
    selection: selectionRef.current,
    get options() {
      const keyword = controllerRef.current?.getSnapshot().searchValue ?? ''
      return filterSelectOptions(
        optionsRef.current.options ?? [],
        keyword,
        optionsRef.current.filterOption,
      )
    },
    get mode() {
      return optionsRef.current.mode
    },
    get multiple() {
      return optionsRef.current.multiple
    },
    get maxCount() {
      return optionsRef.current.maxCount
    },
    get open() {
      return optionsRef.current.open
    },
    get defaultOpen() {
      return optionsRef.current.defaultOpen
    },
    onOpenChange: (open) => optionsRef.current.onOpenChange?.(open),
    onSearch: (keyword) => optionsRef.current.onSearch?.(keyword),
  })
  const snapshot = useCoreStore(controllerRef.current)
  const selection = selectionRef.current.getSnapshot()
  const options = props.options ?? []
  const visibleOptions = filterSelectOptions(options, snapshot.searchValue, props.filterOption)
  const selectedOptions = selection.values.map(
    (value) => options.find((item) => item.value === value) ?? { value, label: String(value) },
  )
  const listId = useId()
  const handlePopoverOpenChange = useMemoizedFn((open: boolean) => {
    if (open) controllerRef.current?.open()
    else controllerRef.current?.close()
  })
  return (
    <SelectContext
      value={{
        controller: controllerRef.current,
        options,
        visibleOptions,
        filterOption: props.filterOption,
        multiple,
        tags: props.mode === 'tags',
        showSearch: props.showSearch === true || props.mode === 'tags',
        disabled: props.disabled === true,
        clearable: props.clearable === true,
        loading: props.loading === true,
        status: props.status,
        placeholder: props.placeholder,
        virtual: props.virtual,
        listId,
        selectedOptions,
        removeValue: (value) => selectionRef.current?.unselect(value),
      }}
    >
      <PopoverRoot
        open={snapshot.open}
        defaultOpen={props.defaultOpen}
        disabled={props.disabled}
        onOpenChange={handlePopoverOpenChange}
      >
        {props.children}
      </PopoverRoot>
    </SelectContext>
  )
}
