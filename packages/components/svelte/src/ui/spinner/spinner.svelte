<script lang="ts">
  import { spinnerClassName, type SpinnerStyleProps } from '@fex/components-styles/spinner'
  import { cn } from '@fex/utils'
  import type { HTMLAttributes } from 'svelte/elements'
  import LoadingIcon from '../../icon/loading.svelte'
  interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'class'>, SpinnerStyleProps { class?: string }
  let { class: className, size = 'md', ...rest }: Props = $props()
  const classList = $derived(cn(spinnerClassName({ size }), className))
</script>
<span {...rest} data-slot="spinner" class={classList}><LoadingIcon /></span>
