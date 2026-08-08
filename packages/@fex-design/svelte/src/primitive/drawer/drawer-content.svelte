<script lang="ts">
  import { drawerContentClassName } from '@fex-design/styles/drawer'
  import type { DrawerPlacement, DrawerSize } from '@fex-design/core/drawer/create-drawer-controller'
  import type { HTMLAttributes } from 'svelte/elements'
  import { resizeAction } from '../../actions/resize'
  import { useDrawer } from './drawer-context'

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
    children?: import('svelte').Snippet
    class?: string
    size?: DrawerSize
  }
  let { children, class: className = '', size, ...rest }: Props = $props()
  const context = useDrawer('DrawerContent')
  const { drawer, snapshot } = context
  const sizes: Record<string, string> = { sm: '320px', md: '400px', lg: '560px', xl: '720px', full: '100%' }
  const currentPlacement = $derived(context.placement() as DrawerPlacement)
  const configuredSize = $derived(size ?? context.size() ?? 'md')
  const numericSize = $derived(typeof configuredSize === 'number' ? configuredSize : Number.parseInt(sizes[configuredSize] ?? configuredSize, 10) || 400)
  const edge = $derived(({ left: 'right', right: 'left', top: 'bottom', bottom: 'top' } as const)[currentPlacement])
  let registeredElement: HTMLDivElement | null = null

  function contentAction(node: HTMLDivElement) {
    let active = true
    queueMicrotask(() => {
      if (!active) return
      registeredElement = node
      drawer.setLayerElement(node)
    })
    return {
      destroy() {
        active = false
        if (registeredElement !== node) return
        registeredElement = null
        queueMicrotask(() => drawer.setLayerElement(null))
      },
    }
  }
</script>

{#if $snapshot.mounted}
  <div
    {...rest}
    use:contentAction
    use:resizeAction={{
      applyStyle: false,
      edge,
      edges: [edge],
      disabled: !context.resizable(),
      rect: { x: 0, y: 0, width: currentPlacement === 'left' || currentPlacement === 'right' ? numericSize : 0, height: currentPlacement === 'top' || currentPlacement === 'bottom' ? numericSize : 0 },
      minWidth: currentPlacement === 'left' || currentPlacement === 'right' ? context.minSize() : undefined,
      maxWidth: currentPlacement === 'left' || currentPlacement === 'right' ? context.maxSize() : undefined,
      minHeight: currentPlacement === 'top' || currentPlacement === 'bottom' ? context.minSize() : undefined,
      maxHeight: currentPlacement === 'top' || currentPlacement === 'bottom' ? context.maxSize() : undefined,
      onResize: (rect) => context.onSizeChange()?.(currentPlacement === 'left' || currentPlacement === 'right' ? rect.width : rect.height),
    }}
    role="dialog"
    tabindex="-1"
    data-slot="drawer-content"
    data-placement={currentPlacement}
    data-state={$snapshot.open ? 'open' : 'closed'}
    data-phase={$snapshot.phase}
    aria-modal="true"
    class={`${drawerContentClassName({ placement: currentPlacement })} ${className}`}
    style={`--drawer-size:${typeof configuredSize === 'number' ? `${configuredSize}px` : sizes[configuredSize] ?? configuredSize}`}
    onkeydown={(event) => {
      if (event.key === 'Escape') drawer.dismiss.escapeKey({ target: event.target, currentTarget: event.currentTarget, event })
    }}
  >
    {@render children?.()}
  </div>
{/if}
