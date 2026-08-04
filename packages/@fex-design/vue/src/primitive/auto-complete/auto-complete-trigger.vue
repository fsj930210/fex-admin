<script setup lang="ts">
import { useAttrs, useSlots } from 'vue'
import { LoadingIcon } from '../../icon/loading'
import InputClear from '../input/input-clear.vue'
import InputControl from '../input/input-control.vue'
import InputRoot from '../input/input-root.vue'
import InputSuffix from '../input/input-suffix.vue'
import PopoverTrigger from '../popover/popover-trigger.vue'
import { useAutoComplete } from './use-auto-complete'

defineOptions({ inheritAttrs: false })
const props = defineProps<{
  clearable?: boolean
  invalid?: boolean
  status?: 'error' | 'warning'
  class?: string
}>()
const slots = useSlots()
const attrs = useAttrs()
const autoComplete = useAutoComplete('AutoCompleteTrigger')
function keydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    autoComplete.controller.setOpen(true, 'keyboard')
    autoComplete.controller.moveActive(event.key === 'ArrowDown' ? 1 : -1)
  } else if (event.key === 'Enter' && autoComplete.snapshot.value.open) {
    if (autoComplete.controller.selectActive()) event.preventDefault()
  } else if (event.key === 'Escape') autoComplete.controller.setOpen(false, 'escape')
}
function valueChange(value: string) {
  autoComplete.controller.setValue(value)
  autoComplete.controller.setOpen(true, 'input')
}
function input(event: Event) {
  valueChange((event.target as HTMLInputElement).value)
}
</script>
<template>
  <PopoverTrigger v-slot="trigger">
    <InputRoot
      :ref="trigger.ref"
      :class="props.class"
      :value="autoComplete.snapshot.value.value"
      :disabled="autoComplete.disabled.value"
      :read-only="autoComplete.readOnly.value"
      :invalid="props.invalid"
      :status="props.status"
      @value-change="valueChange"
      @clear="autoComplete.controller.clear()"
    >
      <slot name="prefix" />
      <InputControl
        v-bind="attrs"
        role="combobox"
        :aria-expanded="autoComplete.snapshot.value.open"
        :aria-controls="autoComplete.listId"
        :aria-activedescendant="
          autoComplete.snapshot.value.activeKey === undefined
            ? undefined
            : `${autoComplete.listId}-${autoComplete.snapshot.value.activeKey}`
        "
        @input="input"
        @focus="autoComplete.controller.setOpen(true, 'focus')"
        @blur="autoComplete.controller.setOpen(false, 'blur')"
        @keydown="keydown"
      />
      <InputClear v-if="props.clearable" />
      <InputSuffix v-if="autoComplete.loading.value || slots.suffix">
        <LoadingIcon v-if="autoComplete.loading.value" class="animate-spin" />
        <slot v-else name="suffix" />
      </InputSuffix>
    </InputRoot>
  </PopoverTrigger>
</template>
