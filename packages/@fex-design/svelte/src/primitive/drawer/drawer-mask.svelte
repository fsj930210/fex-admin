<script lang="ts">
  import { drawerMaskClassName } from '@fex-design/styles/drawer'
  import { useDrawer } from './drawer-context'

  let { class: className = '' }: { class?: string } = $props()
  const { drawer, snapshot, mask } = useDrawer('DrawerMask')
  let registeredElement: HTMLDivElement | null = null

  function maskAction(element: HTMLDivElement) {
    let active = true
    queueMicrotask(() => {
      if (!active) return
      registeredElement = element
      drawer.setOverlayElement(element)
    })
    return {
      destroy() {
        active = false
        if (registeredElement !== element) return
        registeredElement = null
        queueMicrotask(() => drawer.setOverlayElement(null))
      },
    }
  }
</script>

{#if mask()}
  <div
    use:maskAction
    role="presentation"
    class={`${drawerMaskClassName} ${className}`}
    data-slot="drawer-mask"
    data-state={$snapshot.open ? 'open' : 'closed'}
    data-phase={$snapshot.phase}
    onclick={(event) => {
      if (event.target === event.currentTarget) {
        drawer.dismiss.overlayPointer({ target: event.target, currentTarget: event.currentTarget, event })
      }
    }}
    onkeydown={(event) => event.key === 'Escape' && drawer.dismiss.escapeKey({ target: event.target, currentTarget: event.currentTarget, event })}
  ></div>
{/if}
