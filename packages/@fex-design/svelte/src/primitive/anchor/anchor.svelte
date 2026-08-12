<script lang="ts">
  import { ensureAnchorLinkVisible, getAnchorIndicatorStyles, getAnchorScrollTop, getAnchorTargetTop, getAnchorViewportHeight, isAnchorScrolledToEnd, resolveAnchorTarget } from '@fex-design/core/anchor/dom'
  import { createAnchorController } from '@fex-design/core/anchor/model'
  import { flattenAnchorItems, getAnchorActiveKeys, getAnchorHighlightedKeys } from '@fex-design/core/anchor/model'
  import type { AnchorActiveMode, AnchorItem, AnchorOrientation } from '@fex-design/core/anchor/types'
  import { anchorIndicatorClassName, anchorRailClassName, anchorRootClassName } from '@fex-design/styles/anchor'
  import { cn } from '@fex/utils'
  import type { HTMLAttributes } from 'svelte/elements'
  import { onMount, tick, type Snippet } from 'svelte'
  import AnchorList from './anchor-list.svelte'
  import { readableCoreStore } from '../../stores/core-store'

  interface Props extends Omit<HTMLAttributes<HTMLElement>, 'class' | 'onchange'> {
    class?: string
    items: readonly AnchorItem<string>[]
    activeKeys?: readonly string[]
    defaultActiveKeys?: readonly string[]
    activeMode?: AnchorActiveMode
    orientation?: AnchorOrientation
    container?: Window | HTMLElement | (() => Window | HTMLElement)
    offset?: number
    activeOffset?: number
    behavior?: ScrollBehavior
    onChange?: (keys: readonly string[], items: readonly AnchorItem<string>[]) => void
    item?: Snippet<[AnchorItem<string>, boolean]>
  }
  let { class: className, items, activeKeys, defaultActiveKeys = [], activeMode = 'current', orientation = 'vertical', container, offset = 0, activeOffset = 0, behavior = 'smooth', onChange, item, ...rest }: Props = $props()
  const controller = createAnchorController<string>({ activeKeys, defaultActiveKeys, onChange })
  const snapshot = readableCoreStore(controller)
  let root: HTMLElement
  let inkStyles = $state<ReturnType<typeof getAnchorIndicatorStyles>>([])
  let currentKeys = $derived(activeKeys ?? $snapshot.activeKeys)
  let flatItems = $derived(flattenAnchorItems(items))
  let visibleItems = $derived(orientation === 'horizontal' ? flatItems.filter((item) => item.level === 0) : flatItems)
  let highlightedKeys = $derived(getAnchorHighlightedKeys(currentKeys, flatItems))
  const scrollContainer = () => typeof container === 'function' ? container() : (container ?? window)

  function change(keys: readonly string[]) {
    const keySet = new Set(keys)
    controller.change(keys, flatItems.filter(({ item }) => keySet.has(item.key)).map(({ item }) => item))
  }
  function update() {
    const targetContainer = scrollContainer()
    const positions = visibleItems.flatMap(({ item }) => {
      const target = resolveAnchorTarget(item.target)
      return target ? [{ item, top: getAnchorTargetTop(target, targetContainer) }] : []
    })
    change(getAnchorActiveKeys({ positions, scrollTop: getAnchorScrollTop(targetContainer), viewportHeight: getAnchorViewportHeight(targetContainer), offset, activeOffset, mode: activeMode, scrolledToEnd: isAnchorScrolledToEnd(targetContainer) }))
    if (root) { ensureAnchorLinkVisible(root, currentKeys, orientation); inkStyles = getAnchorIndicatorStyles(root, currentKeys, orientation) }
  }
  function activate(item: AnchorItem<string>) {
    const target = resolveAnchorTarget(item.target)
    if (!target) return
    const targetContainer = scrollContainer()
    const index = visibleItems.findIndex(({ item: entry }) => entry.key === item.key)
    change(activeMode === 'progress' ? visibleItems.slice(0, index + 1).map(({ item: entry }) => entry.key) : [item.key])
    targetContainer.scrollTo({ top: Math.max(getAnchorTargetTop(target, targetContainer) - offset, 0), behavior })
  }
  $effect(() => {
    controller.updateOptions({ activeKeys, defaultActiveKeys, onChange })
  })
  onMount(() => {
    let disconnect: (() => void) | undefined
    void tick().then(() => {
      const targetContainer = scrollContainer()
      let frame = 0
      const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update) }
      schedule()
      targetContainer.addEventListener('scroll', schedule, { passive: true })
      window.addEventListener('resize', schedule)
      disconnect = () => {
        cancelAnimationFrame(frame)
        targetContainer.removeEventListener('scroll', schedule)
        window.removeEventListener('resize', schedule)
      }
    })
    return () => disconnect?.()
  })
  $effect(() => {
    if (root) { ensureAnchorLinkVisible(root, currentKeys, orientation); inkStyles = getAnchorIndicatorStyles(root, currentKeys, orientation) }
  })
</script>

<nav {...rest} bind:this={root} data-slot="anchor" data-orientation={orientation} class={cn(anchorRootClassName({ orientation }), className)}>
  <div aria-hidden="true" data-slot="anchor-rail" class={anchorRailClassName({ orientation })}>
    {#each inkStyles as inkStyle}
      <span data-slot="anchor-indicator" class={anchorIndicatorClassName({ orientation })} style:top={inkStyle.top !== undefined ? `${inkStyle.top}px` : undefined} style:left={inkStyle.left !== undefined ? `${inkStyle.left}px` : undefined} style:width={inkStyle.width !== undefined ? `${inkStyle.width}px` : undefined} style:height={inkStyle.height !== undefined ? `${inkStyle.height}px` : undefined}></span>
    {/each}
  </div>
  <AnchorList {items} activeKeys={currentKeys} {highlightedKeys} {orientation} onActivate={activate} {item} />
</nav>
