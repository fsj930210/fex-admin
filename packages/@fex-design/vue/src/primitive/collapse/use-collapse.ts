import { createExpansionController } from '@fex-design/core/expansion/create-expansion-controller'
import type { ExpansionChangeMeta, ExpansionKey } from '@fex-design/core/expansion/types'
import { onScopeDispose, useId, watch } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'

export interface UseCollapseOptions {
  readonly expandedKeys?: readonly ExpansionKey[] | undefined
  readonly defaultExpandedKeys?: readonly ExpansionKey[] | undefined
  readonly disabledKeys?: readonly ExpansionKey[] | undefined
  readonly multiple?: boolean | undefined
  readonly collapsible?: boolean | undefined
  readonly onChange?: ((keys: ExpansionKey[], meta: ExpansionChangeMeta) => void) | undefined
}

export function useCollapse(options: UseCollapseOptions = {}) {
  const baseId = useId()
  const controller = createExpansionController({
    get expandedKeys() {
      return options.expandedKeys
    },
    get defaultExpandedKeys() {
      return options.defaultExpandedKeys
    },
    get disabledKeys() {
      return options.disabledKeys
    },
    get multiple() {
      return options.multiple
    },
    get collapsible() {
      return options.collapsible
    },
    onChange(keys, meta) {
      options.onChange?.(keys, meta)
    },
  })
  const snapshot = useCoreStore(controller)
  const stopRefresh = watch(
    [
      () => options.expandedKeys,
      () => options.disabledKeys,
      () => options.multiple,
      () => options.collapsible,
    ],
    () => controller.refresh(),
  )
  onScopeDispose(stopRefresh)

  return {
    baseId,
    snapshot,
    expand: controller.expand,
    collapse: controller.collapse,
    toggle: controller.toggle,
    setExpandedKeys: controller.setExpandedKeys,
    clear: controller.clear,
    getExpandedKeys: () => controller.getSnapshot().expandedKeys,
    isExpanded: (key: ExpansionKey) => snapshot.value.expandedKeys.includes(key),
    isDisabled: controller.isDisabled,
  }
}
