<script setup lang="ts">
import {
  selectClearClassName,
  selectIndicatorClassName,
  selectInputClassName,
  selectSuffixClassName,
  selectTriggerClassName,
  selectValueContainerClassName,
} from '@fex/components-styles/select'
import { cn } from '@fex/utils'
import { computed, useSlots } from 'vue'
import { ChevronDownIcon } from '../../icon/chevron'
import { CloseIcon } from '../../icon/close'
import { LoadingIcon } from '../../icon/loading'
import PrimitiveButton from '../button/button.vue'
import PopoverTrigger from '../popover/popover-trigger.vue'
import SelectValue from './select-value.vue'
import { useSelect } from './use-select'

defineOptions({ inheritAttrs: false })
const props = defineProps<{
  class?: string | undefined
  placeholder?: string | undefined
  maxTagCount?: number | undefined
}>()
const select = useSelect('SelectTrigger')
const slots = useSlots()
const className = computed(() => cn(selectTriggerClassName(), props.class))
function keydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    select.controller.open()
    select.controller.moveActive(event.key === 'ArrowDown' ? 1 : -1)
  } else if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault()
    select.controller.moveActiveTo(event.key === 'Home' ? 'first' : 'last')
  } else if (event.key === 'Enter') {
    event.preventDefault()
    if (!select.controller.selectActive()) select.controller.createTag()
  } else if (event.key === 'Backspace' && !select.snapshot.value.searchValue)
    select.controller.removeLastSelected()
  else if (event.key === 'Escape') select.controller.close()
}
function input(event: Event) {
  select.controller.setSearchValue((event.target as HTMLInputElement).value)
  select.controller.open()
}
function inputPointerdown(event: PointerEvent) {
  const input = event.currentTarget as HTMLInputElement
  if (document.activeElement === input) select.controller.toggleOpen()
  else select.controller.open()
}
</script>
<template>
  <PopoverTrigger v-slot="trigger">
    <div
      v-bind="{ ...$attrs, ...trigger.props }"
      :ref="trigger.ref"
      role="presentation"
      data-slot="select-trigger"
      :data-disabled="select.disabled.value || undefined"
      :data-status="select.status.value"
      :class="className"
      @keydown="keydown"
    >
      <slot name="prefix" />
      <div :class="selectValueContainerClassName">
        <SelectValue
          :placeholder="select.showSearch.value ? undefined : props.placeholder"
          :max-tag-count="props.maxTagCount"
          ><template #tag="slotProps"><slot name="tag" v-bind="slotProps" /></template
          ><template #value="slotProps"
            ><slot name="value" v-bind="slotProps">{{ slotProps.option.label }}</slot></template
          ></SelectValue
        >
        <input
          role="combobox"
          :aria-expanded="select.snapshot.value.open"
          :aria-controls="select.listId"
          :disabled="select.disabled.value"
          :readonly="!select.showSearch.value"
          :placeholder="
            select.showSearch.value && !select.selectedOptions.value.length
              ? props.placeholder
              : undefined
          "
          :value="select.snapshot.value.searchValue"
          :class="selectInputClassName"
          @focus="select.controller.open()"
          @pointerdown="inputPointerdown"
          @click.stop
          @input="input"
        />
      </div>
      <span data-slot="select-suffix" :class="selectSuffixClassName">
        <LoadingIcon v-if="select.loading.value" class="animate-spin" />
        <PrimitiveButton
          v-else-if="select.clearable.value && select.selectedOptions.value.length"
          type="button"
          aria-label="Clear selection"
          :class="selectClearClassName"
          @pointerdown.prevent
          @click.stop="select.controller.clear()"
          ><CloseIcon class="size-4"
        /></PrimitiveButton>
        <slot v-else-if="slots.suffix" name="suffix" />
        <span
          v-else
          :data-state="select.snapshot.value.open ? 'open' : 'closed'"
          :class="selectIndicatorClassName"
          ><ChevronDownIcon
        /></span>
      </span>
    </div>
  </PopoverTrigger>
</template>
