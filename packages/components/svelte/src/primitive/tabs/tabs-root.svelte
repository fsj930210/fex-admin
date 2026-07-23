<script lang="ts">
  import type { TabsItemRecord } from '@fex/components-core/tabs/types'
  import { setContext, type Snippet } from 'svelte'
  import { tabsContextKey } from './context'
  import { createTabs } from './create-tabs.svelte'
  interface Props { value?: string, defaultValue?: string, orientation?: 'horizontal' | 'vertical', variant?: 'default' | 'line', activationMode?: 'automatic' | 'manual', loop?: boolean, children?: Snippet, onchange?: (value: string | undefined) => void, onclose?: (item: TabsItemRecord) => void }
  let { value, defaultValue, orientation = 'horizontal', variant = 'default', activationMode = 'automatic', loop = true, children, onchange, onclose }: Props = $props()
  const tabs = createTabs({ get value() { return value }, get defaultValue() { return defaultValue }, get orientation() { return orientation }, get activationMode() { return activationMode }, get loop() { return loop }, onChange: (next) => onchange?.(next), onClose: (item) => onclose?.(item) })
  setContext(tabsContextKey, { ...tabs, variant: () => variant })
  // Rune props are an external reactive source for the framework-neutral controller.
  $effect.pre(() => tabs.syncOptions())
</script>
{@render children?.()}
