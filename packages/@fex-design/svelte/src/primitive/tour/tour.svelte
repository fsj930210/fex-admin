<script lang="ts">
  import { createTourController } from '@fex-design/core/tour/create-tour-controller'
  import type { TourOptions, TourSnapshot } from '@fex-design/core/tour/types'
  import type { Snippet } from 'svelte'
  import { onDestroy, onMount, setContext } from 'svelte'
  import { readableCoreStore } from '../../stores/core-store'
  import { tourContextKey, type TourContext } from './tour-context'
  interface Props extends TourOptions { children?: Snippet; keyboard?: boolean; overlay?: boolean; closeOnOverlayClick?: boolean; defaultGap?: number; zIndex?: number; getPopupContainer?: (referenceElement: HTMLElement | null) => HTMLElement }
  let { children, keyboard = true, overlay = true, closeOnOverlayClick = true, defaultGap = 6, zIndex = 1001, getPopupContainer, open, defaultOpen, current, defaultCurrent, targetMissing, targetTimeout, onOpenChange, onChange, onClose, onFinish, onTargetMissing }: Props = $props()
  const controller = createTourController({ open, defaultOpen, current, defaultCurrent, targetMissing, targetTimeout, onOpenChange, onChange, onClose, onFinish, onTargetMissing })
  const snapshot = readableCoreStore(controller)
  function options(): TourOptions { return { open, defaultOpen, current, defaultCurrent, targetMissing, targetTimeout, onOpenChange, onChange, onClose, onFinish, onTargetMissing } }
  $effect(() => controller.setOptions(options()))
  function refresh() { controller.refreshTarget() }
  function keydown(event: KeyboardEvent) { if (!$snapshot.open || !keyboard) return; if (event.key === 'Escape') { event.preventDefault(); controller.close() } else if (event.key === 'ArrowRight') { event.preventDefault(); void controller.next() } else if (event.key === 'ArrowLeft') { event.preventDefault(); void controller.previous() } }
  onMount(() => { document.addEventListener('keydown', keydown); window.addEventListener('resize', refresh); window.addEventListener('scroll', refresh, true) })
  onDestroy(() => { document.removeEventListener('keydown', keydown); window.removeEventListener('resize', refresh); window.removeEventListener('scroll', refresh, true); controller.destroy() })
  setContext<TourContext>(tourContextKey, { controller, snapshot, overlay, closeOnOverlayClick, defaultGap, zIndex, getPopupContainer })
</script>
{@render children?.()}
