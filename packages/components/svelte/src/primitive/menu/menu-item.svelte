<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  interface Props extends HTMLButtonAttributes {
    action?: (element: HTMLElement) => { destroy?: () => void } | void
    children?: Snippet
  }
  let { action = () => undefined, children, ...rest }: Props = $props()
</script>
<button {...rest} use:action type="button" role="menuitem" data-slot="menu-item">{@render children?.()}</button>
