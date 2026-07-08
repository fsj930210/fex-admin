<script lang="ts">
  import { switchThumbClassName, type SwitchStyleProps } from '@fex/components-styles/switch'
  import { cn } from '@fex/utils'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { SwitchState } from './switch.svelte'

  interface SwitchThumbProps extends HTMLAttributes<HTMLSpanElement>, SwitchStyleProps {
    checked?: boolean | undefined
    state?: SwitchState | undefined
  }

  let { checked, state, size = 'default', class: className, ...rest }: SwitchThumbProps = $props()

  const switchState: SwitchState = $derived(state ?? (checked ? 'checked' : 'unchecked'))
</script>

<span {...rest} data-state={switchState} class={cn(switchThumbClassName({ size }), className)}></span>
