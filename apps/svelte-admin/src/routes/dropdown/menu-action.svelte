<script lang="ts">
  import { MenuItem } from '@fex/components-svelte/primitive/menu'
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { itemClassName } from './demo-classes'
  interface Props extends HTMLButtonAttributes {
    action?: (element: HTMLElement) => { destroy?: () => void } | void
    children?: Snippet
  }
  let { action, children, ...rest }: Props = $props()
</script>
<MenuItem {...rest} {action} class={itemClassName}>{@render children?.()}</MenuItem>
