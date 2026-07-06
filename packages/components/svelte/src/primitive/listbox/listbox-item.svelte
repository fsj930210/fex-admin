<script lang="ts">
  import type { SelectionValue } from '@fex/components-core/selection/types'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { getContext } from 'svelte'
  import { listboxContextKey, type ListboxContext } from './context'

  interface ListboxItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onselect'> {
    value: SelectionValue
    disabled?: boolean
    onSelect?: (value: SelectionValue) => void
    children?: Snippet
  }

  let { value, disabled = false, onSelect, children, onclick, onkeydown, ...rest }: ListboxItemProps = $props()
  const context = getContext<ListboxContext>(listboxContextKey)
  const selected = $derived(context.selectedValues().includes(value))
  const itemDisabled = $derived(disabled || context.controller.isDisabled(value))

  function select() {
    if (itemDisabled) {
      return
    }
    context.selectItem(value)
    onSelect?.(value)
  }
</script>

<div
  {...rest}
  role="option"
  tabindex={itemDisabled ? undefined : 0}
  aria-selected={selected}
  aria-disabled={itemDisabled || undefined}
  data-slot="listbox-item"
  data-selected={selected ? 'true' : 'false'}
  data-disabled={itemDisabled ? 'true' : undefined}
  onclick={(event) => {
    onclick?.(event)
    if (!event.defaultPrevented) select()
  }}
  onkeydown={(event) => {
    onkeydown?.(event)
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    select()
  }}
>
  {@render children?.()}
</div>
