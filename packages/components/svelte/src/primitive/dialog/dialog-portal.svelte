<script lang="ts">
  import type { Snippet } from 'svelte'
  import { getContext } from 'svelte'
  import { dialogContextKey, type DialogContext } from './dialog-context'

  interface DialogPortalProps {
    children?: Snippet
    container?: HTMLElement | null
    forceMount?: boolean
  }

  let { children, container, forceMount }: DialogPortalProps = $props()
  const { snapshot } = getContext<DialogContext>(dialogContextKey)

  function portalAction(element: HTMLDivElement) {
    const target = container ?? document.body
    target.appendChild(element)
    return {
      destroy() {
        element.remove()
      },
    }
  }
</script>

{#if $snapshot.mounted || forceMount}
  <div use:portalAction data-slot="dialog-portal" style="display: contents">
    {@render children?.()}
  </div>
{/if}
