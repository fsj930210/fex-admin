<script lang="ts">
  import type { Snippet } from 'svelte'
  import { getContext } from 'svelte'
  import { popoverContextKey, type PopoverContext } from './popover-context'

  interface PopoverPortalProps {
    children?: Snippet
    container?: HTMLElement | null
    forceMount?: boolean
  }

  let { children, container, forceMount }: PopoverPortalProps = $props()
  const { overlay, snapshot } = getContext<PopoverContext>(popoverContextKey)

  function portalAction(element: HTMLDivElement) {
    const target = container ?? overlay.resolvePopupContainer() ?? document.body
    target.appendChild(element)
    return {
      destroy() {
        element.remove()
      },
    }
  }
</script>

{#if $snapshot.mounted || forceMount}
  <div use:portalAction data-slot="popover-portal" style="display: contents">
    {@render children?.()}
  </div>
{/if}
