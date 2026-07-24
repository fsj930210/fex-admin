<script lang="ts">
  import { createTimePickerController } from '@fex/components-core/time-picker/create-time-picker-controller'
  import type { DisabledTime, TimePickerChangeDetails, TimeValue } from '@fex/components-core/time-picker/types'
  import { setContext, untrack, type Snippet } from 'svelte'
  import Popover from '../popover/popover.svelte'
  import { readableCoreStore } from '../../stores/core-store'
  import { timePickerContextKey, type TimePickerContext } from './context'

  interface Props {
    value?: TimeValue | null | undefined
    defaultValue?: TimeValue | null
    format?: string
    onchange?: (value: TimeValue | null, details: TimePickerChangeDetails) => void
    use12Hours?: boolean
    disabled?: boolean
    readonly?: boolean
    disabledTime?: DisabledTime | undefined
    children?: Snippet
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean, info: unknown) => void
    placement?: 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight' | 'left' | 'leftTop' | 'leftBottom' | 'right' | 'rightTop' | 'rightBottom'
  }

  let { value, defaultValue, format, onchange, use12Hours = false, disabled = false, readonly = false, disabledTime, children, ...rest }: Props = $props()
  const controller = createTimePickerController({
    value: untrack(() => value),
    defaultValue: untrack(() => defaultValue),
    onChange: (next, details) => onchange?.(next, details),
  })
  const coreSnapshot = readableCoreStore(controller)
  const snapshot = () => { void $coreSnapshot; return controller.getSnapshot() }
  // Controlled props are synchronized at the framework boundary without duplicating state.
  $effect(() => { if (value !== undefined) controller.setControlledValue(value) })
  setContext(timePickerContextKey, { controller, snapshot, format: () => format ?? (use12Hours ? 'hh:mm:ss A' : 'HH:mm:ss'), use12Hours: () => use12Hours, disabled: () => disabled, readOnly: () => readonly, disabledTime: () => disabledTime } satisfies TimePickerContext)
</script>

<Popover {...rest} trigger={['focus', 'click']}>{@render children?.()}</Popover>
