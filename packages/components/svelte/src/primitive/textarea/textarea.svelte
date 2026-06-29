<script lang="ts">
  import { textareaClassName } from '@fex/components-styles/textarea'
  import { cn } from '@fex/utils'
  import type { HTMLTextareaAttributes } from 'svelte/elements'
  interface Props extends Omit<HTMLTextareaAttributes, 'class'> { class?: string }
  let { class: className, ...rest }: Props = $props()
  const classList = $derived(cn(textareaClassName, className))
</script>
<textarea {...rest} data-slot="textarea" class={classList}></textarea>
