<script lang="ts">
  import {
    buttonClassName,
    buttonIconClassName,
    buttonSpinnerClassName,
    type ButtonStyleProps,
  } from '@fex/components-styles/button'
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

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

  const classList = $derived(buttonClassName({ variant, size, effect, className }))
  const isDisabled = $derived(disabled || loading)
</script>

<button
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
        <svg
          class={buttonSpinnerClassName}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      {:else if icon}
        {@render icon()}
      {/if}
    </span>
  {/if}
  {@render children?.()}
  {#if iconPlacement === 'end' && (loading || icon)}
    <span class={buttonIconClassName({ placement: 'end', effect })} data-icon="inline-end">
      {#if loading}
        <svg
          class={buttonSpinnerClassName}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      {:else if icon}
        {@render icon()}
      {/if}
    </span>
  {/if}
</button>
