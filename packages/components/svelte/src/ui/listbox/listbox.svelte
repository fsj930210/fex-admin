<script lang="ts">
  import { listboxRootClassName } from '@fex/components-styles/listbox'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import PrimitiveListbox from '../../primitive/listbox/listbox.svelte'

  let { class: className, children, ...rest }: { class?: string; children?: Snippet; [key: string]: unknown } = $props()
</script>

<PrimitiveListbox {...rest} class={cn(listboxRootClassName({}), className)}>
  {@render children?.()}
</PrimitiveListbox>
