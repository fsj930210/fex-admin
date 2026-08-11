import { formatDatePickerValue } from '@fex-design/core/date-picker/value'
import {
} from '@fex-design/styles/date-picker'
import { cn } from '@fex/utils'
import { For, Show, splitProps, type JSX } from 'solid-js'
import { Tag } from '../tag/tag'
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
          <Tag size="sm" closable onPointerDownCapture={(event) => event.stopPropagation()} onClose={(event) => { event.stopPropagation(); context.select(item as never) }}>
            <span class="truncate">{formatDatePickerValue(item, context)}</span>
          </Tag>
        )}
      </For>
      <Show when={overflow() > 0}>
        <Tag size="sm">+{overflow()}</Tag>
      </Show>
    </div>
  )
}
