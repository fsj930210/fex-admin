<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { textareaInputClassName } from '@fex-design/styles/textarea'
import { cn } from '@fex/utils'
import TextareaRoot from '../textarea/textarea-root.vue'
import { useMentions } from './context'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ class?: string; autoSize?: boolean | { minRows?: number; maxRows?: number } }>()
const attrs = useAttrs()
const mentions = useMentions('MentionsTrigger')
const element = ref<HTMLTextAreaElement | null>(null)
let composing = false

function inputElement() {
  return element.value
}
function selection(target = inputElement()) {
  return { start: target?.selectionStart ?? 0, end: target?.selectionEnd ?? 0 }
}
function keydown(event: KeyboardEvent) {
  if (composing) return
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    mentions.controller.setOpen(true, 'keyboard')
    mentions.controller.moveActive(event.key === 'ArrowDown' ? 1 : -1)
  } else if ((event.key === 'Enter' || event.key === 'Tab') && mentions.snapshot.value.open) {
    if (mentions.controller.selectActive()) event.preventDefault()
  } else if (event.key === 'Escape') mentions.controller.setOpen(false, 'escape')
  else return
}
function compositionEnd(event: Event) {
  composing = false
  const target = event.currentTarget as HTMLTextAreaElement
  mentions.controller.setValue(target.value, selection(target))
}
function valueChange(value: string) {
  const target = inputElement()
  mentions.controller.setValue(value, {
    start: target?.selectionStart ?? value.length,
    end: target?.selectionEnd ?? value.length,
  })
}
function nativeInput(event: Event) {
  if (composing) return
  const target = event.target as HTMLTextAreaElement
  mentions.controller.setValue(target.value, selection(target))
}
const inputAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})
const inputClassName = computed(() => cn(textareaInputClassName, attrs.class as string | undefined))
const slotHandlers = {
  onInput: (event: Event) => {
    const target = event.currentTarget as HTMLTextAreaElement
    mentions.controller.setValue(target.value, selection(target))
  },
  onKeydown: keydown,
  onBlur: () => mentions.controller.setOpen(false, 'blur'),
  onCompositionstart: () => {
    composing = true
  },
  onCompositionend: compositionEnd,
}
</script>

<template>
  <slot
    :props="{
      value: mentions.snapshot.value.value,
      disabled: mentions.disabled.value,
      readOnly: mentions.readOnly.value,
      required: mentions.required.value,
      role: 'combobox',
      'aria-expanded': mentions.snapshot.value.open,
      'aria-controls': mentions.listId,
      'aria-activedescendant':
        mentions.snapshot.value.activeKey === undefined
          ? undefined
          : `${mentions.listId}-${mentions.snapshot.value.activeKey}`,
      'aria-invalid': mentions.invalid.value || undefined,
      'aria-required': mentions.required.value || undefined,
      ...slotHandlers,
    }"
    :state="mentions.snapshot.value"
  >
    <TextareaRoot
      :class="props.class"
      :value="mentions.snapshot.value.value"
      :disabled="mentions.disabled.value"
      :read-only="mentions.readOnly.value"
      :invalid="mentions.invalid.value"
      :auto-size="props.autoSize"
      @change="valueChange"
    >
      <textarea
        v-bind="inputAttrs"
        ref="element"
        data-slot="textarea-input"
        role="combobox"
        :value="mentions.snapshot.value.value"
        :disabled="mentions.disabled.value"
        :readonly="mentions.readOnly.value"
        :aria-invalid="mentions.invalid.value || undefined"
        :aria-expanded="mentions.snapshot.value.open"
        :aria-controls="mentions.listId"
        :aria-activedescendant="
          mentions.snapshot.value.activeKey === undefined
            ? undefined
            : `${mentions.listId}-${mentions.snapshot.value.activeKey}`
        "
        :aria-required="mentions.required.value || undefined"
        :class="inputClassName"
        @input="nativeInput"
        @keydown="keydown"
        @blur="mentions.controller.setOpen(false, 'blur')"
        @compositionstart="composing = true"
        @compositionend="compositionEnd"
      />
    </TextareaRoot>
  </slot>
</template>
