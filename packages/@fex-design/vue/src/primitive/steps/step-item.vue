<script setup lang="ts">
import { serializeStepValue, type StepRecord, type StepStatus, type StepValue } from '@fex-design/core/steps/types'
import { stepClassName } from '@fex-design/styles/steps'
import { cn } from '@fex/utils'
import { computed, inject, onBeforeUnmount, onMounted, provide, ref, useAttrs, watch } from 'vue'
import { stepContextKey, stepsContextKey } from './context'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ value: StepValue; disabled?: boolean; status?: StepStatus; data?: unknown }>()
const context = inject(stepsContextKey)
if (!context) throw new Error('Step must be used inside Steps.')
const record = (): StepRecord => ({ value: props.value, disabled: props.disabled, status: props.status, data: props.data })
const element = ref<HTMLElement | null>(null)
context.controller.registerStep(record())
onMounted(() => { context.registerElement(props.value, element.value); queueMicrotask(() => context.registerElement(props.value, element.value)) })
onBeforeUnmount(() => { context.registerElement(props.value, null); context.controller.unregisterStep(props.value) })
watch(() => [props.disabled, props.status, props.data] as const, () => context.controller.registerStep(record()))
watch(() => props.value, (value, previousValue) => { context.registerElement(previousValue, null); context.controller.unregisterStep(previousValue); context.controller.registerStep({ ...record(), value }); context.registerElement(value, element.value) })
const info = computed(() => { context.snapshot.value.revision; return context.controller.getStepInfo(props.value) ?? { value: props.value, status: props.status ?? 'wait', disabled: props.disabled === true } })
const position = computed(() => Math.max(1, context.controller.getPosition(props.value) + 1))
provide(stepContextKey, { info, position })
const attrs = useAttrs()
function keydown(event: KeyboardEvent) {
  if (!context.navigation() || info.value.disabled) return
  if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); context.controller.select(props.value, 'keyboard'); return }
  const horizontal = context.orientation() === 'horizontal'
  const direction = event.key === 'Home' ? 'first' : event.key === 'End' ? 'last' : event.key === (horizontal ? 'ArrowRight' : 'ArrowDown') ? 'next' : event.key === (horizontal ? 'ArrowLeft' : 'ArrowUp') ? 'previous' : undefined
  if (direction) { event.preventDefault(); const value = context.controller.move(props.value, direction); if (value !== undefined) { document.querySelector<HTMLElement>(`[data-step-value="${serializeStepValue(value)}"]`)?.focus(); context.controller.select(value, 'keyboard') } }
}
</script>

<template>
  <li ref="element" v-bind="attrs" :class="cn(stepClassName, attrs.class as string | undefined)" :data-step-value="serializeStepValue(value)" :data-status="info.status" :data-disabled="info.disabled || undefined" :data-navigation="context.navigation() || undefined" :aria-current="context.snapshot.value.current === value ? 'step' : undefined" :aria-disabled="info.disabled || undefined" :role="context.navigation() ? 'button' : undefined" :tabindex="context.navigation() && !info.disabled ? (context.snapshot.value.current === value ? 0 : -1) : undefined" @click="context.controller.select(value, 'pointer')" @keydown="keydown"><slot /></li>
</template>
