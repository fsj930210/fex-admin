import { formatDatePickerValue } from '@fex/components-core/date-picker/value'
import {
  datePickerTagClassName,
  datePickerTagOverflowClassName,
  datePickerTagRemoveClassName,
} from '@fex/components-styles/date-picker'
import { cn } from '@fex/utils'
import { For, Show, splitProps, type JSX } from 'solid-js'
import { CloseIcon } from '../../icon/close'
import { useDatePickerContext } from './context'

export interface DatePickerTagsProps extends JSX.HTMLAttributes<HTMLDivElement> {
  maxCount?: number
}

export function DatePickerTags(props: DatePickerTagsProps) {
  const [local, rest] = splitProps(props, ['class', 'maxCount'])
  const context = useDatePickerContext('DatePickerTags')
  const maxCount = () => local.maxCount ?? 1
  const values = () => context.calendarValues()
  const visibleValues = () => values().slice(0, maxCount())
  const overflow = () => Math.max(values().length - visibleValues().length, 0)

  return (
    <div {...rest} class={cn('flex min-w-0 items-center gap-1', local.class)}>
      <For each={visibleValues()}>
        {(item) => (
          <span class={datePickerTagClassName}>
            <span class="truncate">{formatDatePickerValue(item, context)}</span>
            <button
              type="button"
              aria-label={`移除 ${formatDatePickerValue(item, context)}`}
              class={datePickerTagRemoveClassName}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation()
                context.select(item as never)
              }}
            >
              <CloseIcon />
            </button>
          </span>
        )}
      </For>
      <Show when={overflow() > 0}>
        <span class={datePickerTagOverflowClassName}>+{overflow()}</span>
      </Show>
    </div>
  )
}
