import { createExpansionController } from '@fex-design/core/expansion/create-expansion-controller'
import type {
  ExpansionChangeMeta,
  ExpansionController,
  ExpansionKey,
  ExpansionOptions,
} from '@fex-design/core/expansion/types'
import { useId, useImperativeHandle, useRef, type Ref } from 'react'
import { useCoreStore } from '../../hooks/use-core-store'
import { useLazyRef } from '../../hooks/use-lazy-ref'

export interface CollapseRef {
  expand: (key: ExpansionKey) => void
  collapse: (key: ExpansionKey) => void
  toggle: (key: ExpansionKey) => void
  setExpandedKeys: (keys: ExpansionKey[]) => void
  clear: () => void
  getExpandedKeys: () => ExpansionKey[]
  isExpanded: (key: ExpansionKey) => boolean
  isDisabled: (key: ExpansionKey) => boolean
}

export interface UseCollapseOptions extends Omit<ExpansionOptions, 'onChange'> {
  onChange?: (keys: ExpansionKey[], meta: ExpansionChangeMeta) => void
  ref?: Ref<CollapseRef> | undefined
}

export function useCollapse(options: UseCollapseOptions = {}) {
  const optionsRef = useRef(options)
  optionsRef.current = options
  const baseId = useId()
  const controllerRef = useLazyRef<ExpansionController>(() =>
    createExpansionController({
      get expandedKeys() {
        return optionsRef.current.expandedKeys
      },
      get defaultExpandedKeys() {
        return optionsRef.current.defaultExpandedKeys
      },
      get disabledKeys() {
        return optionsRef.current.disabledKeys
      },
      get multiple() {
        return optionsRef.current.multiple
      },
      get collapsible() {
        return optionsRef.current.collapsible
      },
      onChange(keys, meta) {
        optionsRef.current.onChange?.(keys, meta)
      },
    }),
  )
  const controller = controllerRef.current
  const snapshot = useCoreStore(controller)
  useImperativeHandle(
    options.ref,
    () => ({
      expand: controller.expand,
      collapse: controller.collapse,
      toggle: controller.toggle,
      setExpandedKeys: (keys) => controller.setExpandedKeys(keys),
      clear: controller.clear,
      getExpandedKeys: () => controller.getSnapshot().expandedKeys,
      isExpanded: controller.isExpanded,
      isDisabled: controller.isDisabled,
    }),
    [controller],
  )

  return {
    baseId,
    snapshot,
    expand: controller.expand,
    collapse: controller.collapse,
    toggle: controller.toggle,
    setExpandedKeys: controller.setExpandedKeys,
    clear: controller.clear,
    isExpanded: controller.isExpanded,
    isDisabled: controller.isDisabled,
  }
}
