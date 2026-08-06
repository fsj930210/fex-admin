<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { getContext, onDestroy } from 'svelte'
  import { tourContextKey, type TourContext } from './tour-context'
  type Props = { name: string; children?: Snippet<[{ action: (element: HTMLElement) => { destroy: () => void }; props: HTMLAttributes<HTMLElement>; state: ReturnType<TourContext['controller']['getSnapshot']> }]> }
  let { name, children }: Props = $props()
  const { controller, snapshot } = getContext<TourContext>(tourContextKey)
  let element: HTMLElement | null = null
  const action = (value: HTMLElement) => { element = value; controller.refreshTarget(); return { destroy() { if (element === value) element = null; controller.refreshTarget() } } }
  const props = $derived({ 'data-tour-target': name } satisfies HTMLAttributes<HTMLElement>)
  const unregister = controller.registerTarget(name, () => element)
  onDestroy(unregister)
</script>
{@render children?.({ action, props, state: $snapshot })}
