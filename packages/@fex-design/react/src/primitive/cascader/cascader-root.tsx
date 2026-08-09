import { createCascaderController } from '@fex-design/core/cascader/create-cascader-controller'
import type {
  CascaderChangeMeta,
  CascaderFieldNames,
  CascaderFilterOption,
  CascaderOption,
  CascaderValue,
} from '@fex-design/core/cascader/types'
import { type ComponentProps, type ReactNode, useRef } from 'react'
import { useCoreStore } from '../../hooks/use-core-store'
import { PopoverRoot } from '../popover/popover'
import { CascaderContext } from './cascader-context'

export interface CascaderRootProps extends Omit<ComponentProps<typeof PopoverRoot>, 'children' | 'open' | 'defaultOpen' | 'onOpenChange'> {
  children?: ReactNode
  options?: readonly CascaderOption[]
  fieldNames?: CascaderFieldNames
  value?: CascaderValue
  defaultValue?: CascaderValue
  onChange?: (value: CascaderValue, meta: CascaderChangeMeta) => void
  multiple?: boolean
  checkStrictly?: boolean
  changeOnSelect?: boolean
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  expandTrigger?: 'click' | 'hover'
  showSearch?: boolean
  filterOption?: boolean | CascaderFilterOption
  onSearch?: (keyword: string) => void
  loadData?: (selectedOptions: readonly CascaderOption[]) => Promise<void>
  clearable?: boolean
  loading?: boolean
  disabled?: boolean
  placeholder?: string
  status?: 'error' | 'warning'
  displayRender?: (labels: readonly string[], path: readonly CascaderOption[]) => ReactNode
}

export function CascaderRoot(props: CascaderRootProps) {
  const optionsRef = useRef({ ...props })
  Object.assign(optionsRef.current, props)
  const controllerRef = useRef<ReturnType<typeof createCascaderController> | null>(null)
  controllerRef.current ??= createCascaderController({
    get options() { return optionsRef.current.options },
    get fieldNames() { return optionsRef.current.fieldNames },
    get value() { return optionsRef.current.value },
    get defaultValue() { return optionsRef.current.defaultValue },
    get multiple() { return optionsRef.current.multiple },
    get checkStrictly() { return optionsRef.current.checkStrictly },
    get changeOnSelect() { return optionsRef.current.changeOnSelect },
    get open() { return optionsRef.current.open },
    get defaultOpen() { return optionsRef.current.defaultOpen },
    get expandTrigger() { return optionsRef.current.expandTrigger },
    get filterOption() { return optionsRef.current.filterOption },
    onChange: (value, meta) => optionsRef.current.onChange?.(value, meta),
    onOpenChange: (open) => optionsRef.current.onOpenChange?.(open),
    onSearch: (keyword) => optionsRef.current.onSearch?.(keyword),
    get loadData() { return optionsRef.current.loadData },
  })
  const snapshot = useCoreStore(controllerRef.current)
  const selectedPaths = controllerRef.current.getSelectedPaths()
  return (
    <CascaderContext value={{
      controller: controllerRef.current,
      snapshot,
      multiple: props.multiple === true,
      expandTrigger: props.expandTrigger ?? 'click',
      showSearch: props.showSearch === true,
      clearable: props.clearable === true,
      disabled: props.disabled === true,
      loading: props.loading === true,
      status: props.status,
      placeholder: props.placeholder,
      selectedPaths,
      displayRender: props.displayRender,
    }}>
      <PopoverRoot
        align="start"
        open={snapshot.open}
        defaultOpen={props.defaultOpen}
        disabled={props.disabled}
        onOpenChange={(open) => open ? controllerRef.current?.open() : controllerRef.current?.close()}
      >
        {props.children}
      </PopoverRoot>
    </CascaderContext>
  )
}
