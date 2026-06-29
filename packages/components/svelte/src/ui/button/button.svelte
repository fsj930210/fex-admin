<script lang="ts">
  import {
    buttonClassName,
    buttonIconClassName,
    buttonSpinnerClassName,
    type ButtonStyleProps,
  } from '@fex/components-styles/button'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import LoadingIcon from '../../icon/loading.svelte'
  import PrimitiveButton from '../../primitive/button/button.svelte'

  interface ButtonProps extends Omit<HTMLButtonAttributes, 'class' | 'disabled'>, ButtonStyleProps {
    iconPlacement?: 'start' | 'end'
    loading?: boolean
    disabled?: boolean
    class?: string
    children?: Snippet
    icon?: Snippet
  }

  let {
    variant = 'default',
    size = 'default',
    effect,
    iconPlacement = 'start',
    loading = false,
    disabled = false,
    type = 'button',
    class: className,
    children,
    icon,
    onclick,
    ...rest
  }: ButtonProps = $props()

  const classList = $derived(cn(buttonClassName({ variant, size, effect }), className))
  const isDisabled = $derived(disabled || loading)
</script>

<PrimitiveButton
  {...rest}
  class={classList}
  data-slot="button"
  data-variant={variant}
  data-size={size}
  data-effect={effect}
  data-loading={loading ? 'true' : undefined}
  disabled={isDisabled}
  type={type}
  {onclick}
>
  {#if iconPlacement === 'start' && (loading || icon)}
    <span class={buttonIconClassName({ placement: 'start', effect })} data-icon="inline-start">
      {#if loading}
        <LoadingIcon class={buttonSpinnerClassName} />
      {:else if icon}
        {@render icon()}
      {/if}
    </span>
  {/if}
  {@render children?.()}
  {#if iconPlacement === 'end' && (loading || icon)}
    <span class={buttonIconClassName({ placement: 'end', effect })} data-icon="inline-end">
      {#if loading}
        <LoadingIcon class={buttonSpinnerClassName} />
      {:else if icon}
        {@render icon()}
      {/if}
    </span>
  {/if}
</PrimitiveButton>
