<script lang="ts" module>
  export type { CheckboxChangeMeta, CheckboxCheckedState } from '@fex/components-core/checkbox/types'
</script>

<script lang="ts">
  import { createCheckboxController } from '@fex/components-core/checkbox/create-checkbox-controller'
  import type { CheckboxChangeMeta, CheckboxCheckedState } from '@fex/components-core/checkbox/types'
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { readableCoreStore } from '../../stores/core-store'

  interface CheckboxRootProps extends Omit<HTMLButtonAttributes, 'type' | 'children'> {
    checked?: CheckboxCheckedState | undefined
    defaultChecked?: CheckboxCheckedState | undefined
    disabled?: boolean | null | undefined
    children?: Snippet<[CheckboxCheckedState]>
    onCheckedChange?: ((checked: CheckboxCheckedState, meta: CheckboxChangeMeta) => void) | undefined
  }

  let {
    checked,
    defaultChecked,
    disabled,
    children,
    onclick,
    onCheckedChange,
    ...rest
  }: CheckboxRootProps = $props()

  const options = {
    get checked() {
      return checked
    },
    get defaultChecked() {
      return defaultChecked
    },
    get disabled() {
      return disabled ?? undefined
    },
  }
  const controller = createCheckboxController(options)
  const snapshot = readableCoreStore(controller)
  const currentChecked = $derived(checked ?? $snapshot.checked)
  const currentDisabled = $derived(disabled || $snapshot.disabled)
  const state = $derived(
    currentChecked === 'indeterminate' ? 'indeterminate' : currentChecked ? 'checked' : 'unchecked',
  )
</script>

<button
  {...rest}
  type="button"
  role="checkbox"
  disabled={currentDisabled}
  aria-checked={currentChecked === 'indeterminate' ? 'mixed' : currentChecked}
  data-state={state}
  data-disabled={currentDisabled ? 'true' : undefined}
  onclick={(event) => {
    onclick?.(event)
    if (event.defaultPrevented) return
    if (currentDisabled) return
    const meta =
      checked === undefined
        ? controller.toggle()
        : {
            previousChecked: currentChecked,
            checked: currentChecked === true ? false : true,
          }
    if (meta) onCheckedChange?.(meta.checked, meta)
  }}
>
  {@render children?.(currentChecked)}
</button>
