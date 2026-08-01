<script lang="ts">
  import type { Snippet } from 'svelte'
  import { useDrawer } from './drawer-context'

  let { children, container, forceMount = false }: { children?: Snippet; container?: HTMLElement | null; forceMount?: boolean } = $props()
  const { snapshot, depth } = useDrawer('DrawerPortal')

  function portal(element: HTMLDivElement) {
    ;(container ?? document.body).appendChild(element)
    return { destroy: () => element.remove() }
  }
</script>

{#if $snapshot.mounted || forceMount}
  <div use:portal data-slot="drawer-portal" style:display="contents" style:--drawer-z-index={50 + depth * 2}>
    {@render children?.()}
  </div>
{/if}
