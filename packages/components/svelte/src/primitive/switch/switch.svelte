<script lang="ts">
  import { switchClassName, type SwitchStyleProps } from '@fex/components-styles/switch'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  export type SwitchState = 'checked' | 'unchecked'

  interface SwitchProps extends Omit<HTMLButtonAttributes, 'checked' | 'children' | 'type'>, SwitchStyleProps {
    checked?: boolean | undefined
    defaultChecked?: boolean | undefined
    children?: Snippet<[boolean, SwitchState]> | undefined
    onCheckedChange?: ((checked: boolean, event: MouseEvent) => void) | undefined
  }

  let {
    checked,
    defaultChecked = false,
    disabled,
    size = 'default',
    class: className,
    children,
    onclick,
    onCheckedChange,
    ...rest
  }: SwitchProps = $props()

  let hasInteracted: boolean = $state(false)
  let internalChecked: boolean = $state(false)
  const currentChecked: boolean = $derived(checked ?? (hasInteracted ? internalChecked : defaultChecked))
  const switchState: SwitchState = $derived(currentChecked ? 'checked' : 'unchecked')
</script>

<button
  {...rest}
  type="button"
  role="switch"
  disabled={disabled}
  aria-checked={currentChecked}
  data-state={switchState}
  data-disabled={disabled ? 'true' : undefined}
  class={cn(switchClassName({ size }), className)}
  onclick={(event) => {
    onclick?.(event)
    if (event.defaultPrevented || disabled) return
    const nextChecked = !currentChecked
    if (checked === undefined) {
      hasInteracted = true
      internalChecked = nextChecked
    }
    onCheckedChange?.(nextChecked, event)
  }}
>
  {@render children?.(currentChecked, switchState)}
</button>
