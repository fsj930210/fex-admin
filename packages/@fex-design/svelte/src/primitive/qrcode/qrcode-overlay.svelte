<script lang="ts">
  import { qrcodeOverlayClassName } from '@fex-design/styles/qrcode'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
    class?: string
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()
  const classList = $derived(cn(qrcodeOverlayClassName, className))
</script>

<div {...rest} data-slot="qrcode-overlay" class={classList}>
  {@render children?.()}
</div>
