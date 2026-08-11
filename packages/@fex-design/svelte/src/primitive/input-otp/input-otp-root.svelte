<script lang="ts">
  import { createInputOTPController } from '@fex-design/core/input-otp/create-input-otp-controller'
  import type {
    InputOTPChangeMeta,
    InputOTPCompleteMeta,
    InputOTPSegmentSnapshot,
    InputOTPValue,
  } from '@fex-design/core/input-otp/types'
  import { inputOTPRootClassName } from '@fex-design/styles/input-otp'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { readableCoreStore } from '../../stores/core-store'
  import { setInputOTPContext } from './context'

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onchange'> {
    value?: InputOTPValue
    defaultValue?: InputOTPValue
    disabled?: boolean
    readOnly?: boolean
    invalid?: boolean
    isComplete?: (value: InputOTPValue, segments: readonly InputOTPSegmentSnapshot[]) => boolean
    onChange?: (value: InputOTPValue, meta: InputOTPChangeMeta) => void
    onComplete?: (value: InputOTPValue, meta: InputOTPCompleteMeta) => void
    children?: Snippet
  }

  let {
    value,
    defaultValue,
    disabled = false,
    readOnly = false,
    invalid = false,
    isComplete,
    onChange,
    onComplete,
    children,
    class: className,
    ...rest
  }: Props = $props()

  const controller = createInputOTPController()
  const snapshot = readableCoreStore(controller)
  const inputs = new Map<number, HTMLInputElement>()

  $effect(() => {
    controller.setOptions({ value, defaultValue, disabled, readOnly, invalid, isComplete, onChange, onComplete })
  })

  setInputOTPContext({
    controller,
    snapshot: () => $snapshot,
    registerInput(index, element) {
      if (element) inputs.set(index, element)
      else inputs.delete(index)
    },
    focusInput(index, cursor = 'all') {
      const input = inputs.get(index)
      if (!input || input.disabled) return
      input.focus()
      const position = cursor === 'start' ? 0 : input.value.length
      input.setSelectionRange(cursor === 'all' ? 0 : position, position)
    },
  })
</script>

<div
  {...rest}
  role="group"
  data-slot="input-otp-root"
  data-disabled={disabled || undefined}
  data-readonly={readOnly || undefined}
  data-invalid={invalid || undefined}
  data-complete={$snapshot.complete || undefined}
  class={cn(inputOTPRootClassName, className)}
>
  {@render children?.()}
</div>
