<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements'

  interface ItemSlot {
    props: HTMLAttributes<HTMLElement>
    state: { disabled: boolean; selected: boolean; submenu: boolean }
  }

  interface Props extends HTMLButtonAttributes {
    action?: (element: HTMLElement) => { destroy?: () => void } | void
    children?: Snippet
    trigger?: Snippet<[ItemSlot]>
    selected?: boolean
    submenu?: boolean
    value?: string | number
  }
  let {
    action = () => undefined,
    children,
    trigger,
    disabled = false,
    selected = false,
    submenu = false,
    value,
    ...rest
  }: Props = $props()

  const itemProps = $derived({
    ...rest,
    role: rest.role ?? 'menuitem',
    tabindex: disabled ? -1 : (rest.tabindex ?? -1),
    'aria-disabled': disabled || undefined,
    'aria-haspopup': submenu ? 'menu' : undefined,
    'data-slot': 'menu-item',
    'data-menu-value': value === undefined ? undefined : String(value),
    'data-selected': selected ? 'true' : undefined,
  } satisfies HTMLAttributes<HTMLElement>)
</script>

{#if trigger}
  {@render trigger({ props: itemProps, state: { disabled, selected, submenu } })}
{:else}
  <button {...itemProps} use:action type="button" {disabled}>{@render children?.()}</button>
{/if}
