<script lang="ts">
  import type { StepsChangeMeta, StepsOrientation, StepValue } from '@fex/components-core/steps/types'; import { stepsClassName } from '@fex/components-styles/steps'; import { cn } from '@fex/utils'; import { setContext, type Snippet } from 'svelte'; import type { HTMLAttributes } from 'svelte/elements'; import { createSteps } from './create-steps.svelte'; import { stepsContextKey } from './context'
  interface Props extends Omit<HTMLAttributes<HTMLOListElement>, 'onchange' | 'class'> { current?: StepValue; defaultCurrent?: StepValue; navigation?: boolean; orientation?: StepsOrientation; responsive?: boolean; onchange?: (value: StepValue, meta: StepsChangeMeta) => void; class?: string; children?: Snippet }
  let { current, defaultCurrent, navigation = false, orientation = 'horizontal', responsive = true, onchange, class: className, children, ...rest }: Props = $props()
  const steps = createSteps({ get current() { return current }, get defaultCurrent() { return defaultCurrent }, get navigation() { return navigation }, get orientation() { return orientation }, onChange: (value, meta) => onchange?.(value, meta) }); setContext(stepsContextKey, steps); $effect.pre(() => steps.syncOptions())
</script>
<ol {...rest} data-orientation={orientation} class={cn(stepsClassName({ orientation, responsive }), className)}>{@render children?.()}</ol>
