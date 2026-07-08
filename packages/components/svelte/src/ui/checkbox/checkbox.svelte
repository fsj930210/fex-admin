<script lang="ts" module>
  export type { CheckboxCheckedState } from '@fex/components-core/checkbox/types'
</script>

<script lang="ts">
  import {
    checkboxCheckIconClassName,
    checkboxClassName,
    checkboxIndicatorClassName,
    checkboxMinusIconClassName,
    type CheckboxStyleProps,
  } from '@fex/components-styles/checkbox'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { CheckboxChangeMeta, CheckboxCheckedState } from '@fex/components-core/checkbox/types'
  import CheckboxRoot from '../../primitive/checkbox/checkbox.svelte'
  import CheckboxIndicator from '../../primitive/checkbox/checkbox-indicator.svelte'
  import CheckIcon from '../../icon/check.svelte'
  import MinusIcon from '../../icon/minus.svelte'

  interface CheckboxProps {
    checked?: CheckboxCheckedState | undefined
    defaultChecked?: CheckboxCheckedState | undefined
    disabled?: boolean | undefined
    size?: CheckboxStyleProps['size']
    class?: string
    children?: Snippet
    onCheckedChange?: ((checked: CheckboxCheckedState, meta: CheckboxChangeMeta) => void) | undefined
    [key: string]: unknown
  }

  let {
    checked,
    defaultChecked,
    disabled,
    size,
    class: className,
    children: indicatorChildren,
    onCheckedChange,
    ...rest
  }: CheckboxProps = $props()
  const classList = $derived(cn(checkboxClassName({ size }), className))
</script>

<CheckboxRoot
  {...rest}
  {checked}
  {defaultChecked}
  {disabled}
  class={classList}
  data-slot="checkbox"
  {onCheckedChange}
>
  {#snippet children(checkedState)}
    <CheckboxIndicator checked={checkedState} class={checkboxIndicatorClassName} data-slot="checkbox-indicator">
      {#if indicatorChildren}
        {@render indicatorChildren()}
      {:else}
        <CheckIcon class={checkboxCheckIconClassName} />
        <MinusIcon class={checkboxMinusIconClassName} />
      {/if}
    </CheckboxIndicator>
  {/snippet}
</CheckboxRoot>
