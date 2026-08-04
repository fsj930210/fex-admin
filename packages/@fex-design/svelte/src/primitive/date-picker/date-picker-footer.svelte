<script lang="ts" module>
  import { getContext } from 'svelte'
  import { datePickerContextKey, rangePickerContextKey, type DatePickerContextValue, type RangePickerContextValue } from './context'

  export function useFooterOwner() {
    const datePicker = getContext<DatePickerContextValue | undefined>(datePickerContextKey)
    const rangePicker = getContext<RangePickerContextValue | undefined>(rangePickerContextKey)
    const owner = datePicker ?? rangePicker
    if (!owner) throw new Error('DatePicker footer action must be used within DatePickerRoot or RangePickerRoot')
    return owner
  }
</script>

<script lang="ts">
  import { datePickerFooterClassName } from '@fex-design/styles/date-picker'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'

  interface Props {
    class?: string
    children?: Snippet<[{ close: () => void; clear: () => void; confirm: () => void; cancel: () => void }]>
  }
  let { class: className, children }: Props = $props()
  const owner = useFooterOwner()
</script>

<div data-slot="date-picker-footer" class={cn(datePickerFooterClassName, className)}>
  {@render children?.({ close: owner.close, clear: owner.clear, confirm: owner.confirm, cancel: owner.cancel })}
</div>
