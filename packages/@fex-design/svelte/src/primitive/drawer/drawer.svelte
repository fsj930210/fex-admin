<script lang="ts">
  import { createDrawerController, type DrawerOptions, type DrawerSize } from '@fex-design/core/drawer/create-drawer-controller'
  import { getContext, onDestroy, setContext } from 'svelte'
  import { readableCoreStore } from '../../stores/core-store'
  import { drawerContextKey, type DrawerContextValue } from './drawer-context'

  interface Props extends DrawerOptions {
    children?: import('svelte').Snippet
    size?: DrawerSize
    defaultSize?: DrawerSize
    resizable?: boolean
    minSize?: number
    maxSize?: number
    onSizeChange?: (size: number) => void
  }
  let { children, open, defaultOpen = false, placement = 'right', size, defaultSize = 'md', mask = true, modal = true, dismiss, closeOnMaskPointer = true, forceMount, closeDelay = 300, resizable = false, minSize = 240, maxSize, onSizeChange, onOpenChange }: Props = $props()
  let localOpen = $state(defaultOpen)
  const parent = getContext<DrawerContextValue | undefined>(drawerContextKey)
  const depth = (parent?.depth ?? -1) + 1
  const triggerElement = { current: null as HTMLButtonElement | null }
  function options() {
    return { open, defaultOpen: localOpen, placement, mask, modal, dismiss, closeOnMaskPointer, forceMount, closeDelay, onOpenChange(next: boolean, info: unknown) { if (open === undefined) localOpen = next; onOpenChange?.(next, info as never) } }
  }
  const drawer = createDrawerController(options())
  const snapshot = readableCoreStore(drawer)
  $effect(() => { drawer.setOptions(options()) })
  setContext(drawerContextKey, { drawer, depth, snapshot, placement: () => placement, mask: () => mask, size: () => size ?? defaultSize, resizable: () => resizable, minSize: () => minSize, maxSize: () => maxSize, onSizeChange: () => onSizeChange, triggerElement })
  onDestroy(() => drawer.destroy())
</script>

{@render children?.()}
