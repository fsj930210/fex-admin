<script setup lang="ts">
import type { TextareaAutoSize } from '@fex-design/core/textarea/autosize'
import { textareaRootClassName } from '@fex-design/styles/textarea'
import { cn } from '@fex/utils'
import { computed, provide } from 'vue'
import TextareaClear from './textarea-clear.vue'
import { textareaContextKey } from './context'
import { useTextarea } from './use-textarea'

defineOptions({ inheritAttrs: false })
const props = withDefaults(
  defineProps<{
    value?: string | undefined
    defaultValue?: string | undefined
    disabled?: boolean | undefined
    readOnly?: boolean | undefined
    invalid?: boolean | undefined
    status?: 'error' | 'warning' | undefined
    autoSize?: TextareaAutoSize | undefined
    allowClear?: boolean | undefined
    class?: string | undefined
  }>(),
  { defaultValue: '', disabled: false, readOnly: false, invalid: false, allowClear: false },
)
const emit = defineEmits<{
  change: [value: string, meta: { reason: 'input' | 'clear'; event?: Event }]
  clear: [meta: { reason: 'clear' }]
}>()
const textarea = useTextarea({
  value: () => props.value,
  defaultValue: () => props.defaultValue,
  disabled: () => props.disabled,
  readOnly: () => props.readOnly,
  invalid: () => props.invalid || props.status === 'error',
  autoSize: () => props.autoSize,
  onChange: (value, meta) => emit('change', value, meta),
  onClear: (meta) => emit('clear', meta),
})
provide(textareaContextKey, textarea)
const className = computed(() => cn(textareaRootClassName, props.class))
</script>

<template>
  <div
    v-bind="$attrs"
    data-slot="textarea-root"
    :data-disabled="textarea.disabled.value || undefined"
    :data-readonly="textarea.readOnly.value || undefined"
    :data-invalid="textarea.invalid.value || undefined"
    :data-status="props.status"
    :class="className"
  >
    <slot />
    <TextareaClear v-if="props.allowClear" />
  </div>
</template>
