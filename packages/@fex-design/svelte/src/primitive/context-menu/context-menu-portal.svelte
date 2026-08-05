<script lang="ts">
  import type { Snippet } from 'svelte'
  import { getContext } from 'svelte'
  import { contextMenuContextKey, type ContextMenuContext } from './context-menu-context'
  let { children, container }: { children?: Snippet; container?: HTMLElement | null } = $props()
  const { controller, snapshot } = getContext<ContextMenuContext>(contextMenuContextKey)
  function portalAction(element: HTMLDivElement) {
    const target = container ?? controller.overlay.resolvePopupContainer() ?? document.body
    target.appendChild(element)
    return { destroy() { element.remove() } }
  }
</script>
{#if $snapshot.overlay.mounted}
  <div use:portalAction data-slot="context-menu-portal" style="display: contents">
    {@render children?.()}
  </div>
{/if}
