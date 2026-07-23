import { createTabsController } from '@fex/components-core/tabs/create-tabs-controller'
import type { TabsActivationMode, TabsChangeMeta, TabsItemRecord, TabsOrientation } from '@fex/components-core/tabs/types'
import { createCoreStoreSignal } from '../../signals/core-store-signal'

export interface CreateTabsOptions {
  readonly value?: string | undefined
  readonly defaultValue?: string | undefined
  readonly orientation?: TabsOrientation | undefined
  readonly activationMode?: TabsActivationMode | undefined
  readonly loop?: boolean | undefined
  readonly onChange?: ((value: string | undefined, meta: TabsChangeMeta) => void) | undefined
}

export function createTabs(options: CreateTabsOptions = {}) {
  const controller = createTabsController(options)
  return { controller, snapshot: createCoreStoreSignal(controller) }
}
