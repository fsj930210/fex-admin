<script lang="ts">
  import { cn } from '@fex/utils'
  import type { SVGAttributes } from 'svelte/elements'
  import ChevronRightIcon from './chevron-right.svelte'

  interface Props extends Omit<SVGAttributes<SVGSVGElement>, 'class'> {
    class?: string
  }

  let { class: className, ...rest }: Props = $props()
</script>

<ChevronRightIcon {...rest} class={cn('rotate-180', className)} />
