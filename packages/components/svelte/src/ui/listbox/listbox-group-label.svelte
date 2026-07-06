<script lang="ts">
  import { listboxGroupLabelClassName } from '@fex/components-styles/listbox'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import PrimitiveListboxGroupLabel from '../../primitive/listbox/listbox-group-label.svelte'

  let { class: className, children, ...rest }: { class?: string; children?: Snippet; [key: string]: unknown } = $props()
</script>

<PrimitiveListboxGroupLabel {...rest} class={cn(listboxGroupLabelClassName, className)}>
  {@render children?.()}
</PrimitiveListboxGroupLabel>
