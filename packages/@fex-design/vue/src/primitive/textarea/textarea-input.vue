<script setup lang="ts">
import { textareaInputClassName } from '@fex-design/styles/textarea'
import { cn } from '@fex/utils'
import { computed, inject, onBeforeUnmount, ref, watch } from 'vue'
import { textareaContextKey } from './context'

defineOptions({ name: 'FexTextareaInput', inheritAttrs: false })
const props = defineProps<{ class?: string | undefined }>()
const emit = defineEmits<{ change: [event: Event] }>()
const textarea = inject(textareaContextKey)
if (!textarea) throw new Error('TextareaInput must be used inside TextareaRoot.')
const textareaContext = textarea
const element = ref<HTMLTextAreaElement | null>(null)
let observer: ResizeObserver | undefined
const className = computed(() => cn(textareaInputClassName, props.class))

watch(
  () => [textareaContext.value.value, textareaContext.autoSize.value] as const,
  () => textareaContext.syncAutoSize(),
  { flush: 'post' },
)
watch(element, (node) => {
  observer?.disconnect()
  observer = undefined
  textareaContext.setFocusElement(node)
  if (node && textareaContext.autoSize.value && typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(() => textareaContext.syncAutoSize())
    observer.observe(node)
  }
})
onBeforeUnmount(() => observer?.disconnect())

function input(event: Event) {
  textareaContext.setValue((event.currentTarget as HTMLTextAreaElement).value, 'input', event)
}
</script>

<template>
  <textarea
    v-bind="$attrs"
    ref="element"
    data-slot="textarea-input"
    :value="textareaContext.value.value"
    :disabled="textareaContext.disabled.value"
    :readonly="textareaContext.readOnly.value"
    :aria-invalid="textareaContext.invalid.value || undefined"
    :class="className"
    @change="emit('change', $event)"
    @input="input"
  />
</template>
