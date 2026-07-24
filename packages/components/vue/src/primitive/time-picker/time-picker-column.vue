<script setup lang="ts" generic="TValue extends number | TimePeriod">
import type { TimePeriod, TimePickerOption } from '@fex/components-core/time-picker/types'
import {
  timePickerColumnClassName,
  timePickerColumnItemClassName,
  timePickerColumnSpacerClassName,
  timePickerColumnViewportClassName,
} from '@fex/components-styles/time-picker'
import { cn } from '@fex/utils'
import { inject, nextTick, ref, useAttrs, watch } from 'vue'
import { usePopoverContext } from '../popover/context'
import { timePickerContextKey } from './context'
import { ScrollbarBar, ScrollbarRoot, ScrollbarViewport } from '../scrollbar/scrollbar'

defineOptions({ inheritAttrs: false })
const props = withDefaults(
  defineProps<{
    options: readonly TimePickerOption<TValue>[]
    selectedValue?: TValue | undefined
    disabled?: boolean | undefined
  }>(),
  { disabled: false },
)
const emit = defineEmits<{ select: [value: TValue] }>()
const context = inject(timePickerContextKey)
if (!context) throw new Error('TimePickerColumn must be used inside TimePickerRoot.')
const { snapshot: popoverSnapshot } = usePopoverContext('TimePickerColumn')
const attrs = useAttrs()
const viewport = ref<{ element: HTMLDivElement | null }>()
const itemElements = new Map<TValue, HTMLButtonElement>()
const activeValue = ref<TValue>()

function register(value: TValue, element: unknown) {
  if (element instanceof HTMLButtonElement) itemElements.set(value, element)
  else itemElements.delete(value)
}

function scrollSelected(behavior: ScrollBehavior) {
  const item = props.selectedValue === undefined ? undefined : itemElements.get(props.selectedValue)
  if (item && viewport.value?.element)
    viewport.value.element.scrollTo({ top: item.offsetTop, behavior })
}

// Scrolling is an imperative DOM boundary and runs only after Vue has committed items.
watch(
  [
    () => props.selectedValue,
    () => context.snapshot.value.scrollRequest?.id,
    () => popoverSnapshot.value.open,
  ],
  async () => {
    await nextTick()
    scrollSelected(context.snapshot.value.scrollRequest?.behavior ?? 'auto')
  },
  { immediate: true },
)

function move(direction: 1 | -1) {
  const enabled = props.options.filter((option) => !option.disabled)
  const current = enabled.findIndex((option) => option.value === activeValue.value)
  const next = enabled[Math.min(enabled.length - 1, Math.max(0, current + direction))]
  if (!next) return
  activeValue.value = next.value
  itemElements.get(next.value)?.focus()
}
</script>

<template>
  <ScrollbarRoot
    data-slot="time-picker-column"
    :data-disabled="context.disabled.value || disabled ? 'true' : undefined"
    :class="cn(timePickerColumnClassName, attrs.class as string | undefined)"
  >
    <ScrollbarViewport ref="viewport" role="listbox" :tabindex="context.disabled.value || disabled ? -1 : 0" :aria-disabled="context.disabled.value || disabled || undefined" overflow-x="hidden" :class="timePickerColumnViewportClassName" @keydown.down.prevent="move(1)" @keydown.up.prevent="move(-1)">
    <template v-for="item in options" :key="String(item.value)">
      <slot
        name="item"
        :item="item"
        :selected="item.value === selectedValue"
        :active="item.value === activeValue"
      >
        <button
          :ref="(element) => register(item.value, element)"
          type="button"
          role="option"
          tabindex="-1"
          :disabled="context.disabled.value || disabled || item.disabled"
          :aria-selected="item.value === selectedValue"
          :data-selected="item.value === selectedValue ? 'true' : undefined"
          :data-active="item.value === activeValue ? 'true' : undefined"
          :data-disabled="item.disabled ? 'true' : undefined"
          :class="timePickerColumnItemClassName"
          @focus="activeValue = item.value"
          @click="
            () => {
              if (
                !context.disabled.value &&
                !context.readOnly.value &&
                !disabled &&
                !item.disabled
              ) {
                activeValue = item.value
                emit('select', item.value)
                const element = itemElements.get(item.value)
                if (element && viewport?.element)
                  viewport.element.scrollTo({ top: element.offsetTop, behavior: 'smooth' })
              }
            }
          "
        >
          {{ item.label }}
        </button>
      </slot>
    </template>
    <div aria-hidden="true" :class="timePickerColumnSpacerClassName" />
    </ScrollbarViewport>
    <ScrollbarBar axis="y" />
  </ScrollbarRoot>
</template>
