<script lang="ts">
  import type { Snippet } from 'svelte'
  import { useDrawer } from './drawer-context'

  type TriggerProps = {
    action: (element: HTMLButtonElement) => { destroy(): void }
    type: 'button'
    'data-state': 'open' | 'closed'
    'aria-haspopup': 'dialog'
    'aria-expanded': boolean
    onclick: (event: MouseEvent) => void
  }

  let { children }: { children: Snippet<[TriggerProps]> } = $props()
  const { drawer, snapshot, triggerElement } = useDrawer('DrawerTrigger')

  function action(element: HTMLButtonElement) {
    triggerElement.current = element
    return { destroy() { if (triggerElement.current === element) triggerElement.current = null } }
  }
</script>

{@render children({
  action,
  type: 'button',
  'data-state': $snapshot.open ? 'open' : 'closed',
  'aria-haspopup': 'dialog',
  'aria-expanded': $snapshot.open,
  onclick: (event) => drawer.toggle({ source: 'trigger', event }),
})}
