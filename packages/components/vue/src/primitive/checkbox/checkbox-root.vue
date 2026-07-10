<script setup lang="ts">
import { createCheckboxController } from '@fex/components-core/checkbox/create-checkbox-controller'
import type { CheckboxChangeMeta, CheckboxCheckedState } from '@fex/components-core/checkbox/types'
import { computed } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ checked?: CheckboxCheckedState | undefined, defaultChecked?: CheckboxCheckedState | undefined, disabled?: boolean | undefined }>()
const emit = defineEmits<{ checkedChange: [checked: CheckboxCheckedState, meta: CheckboxChangeMeta] }>()
const controller = createCheckboxController({
  get checked() { return props.checked },
  get defaultChecked() { return props.defaultChecked },
  get disabled() { return props.disabled },
})
const snapshot = useCoreStore(controller)
const currentChecked = computed(() => props.checked ?? snapshot.value.checked)
const currentDisabled = computed(() => Boolean(props.disabled || snapshot.value.disabled))
const state = computed(() => currentChecked.value === 'indeterminate' ? 'indeterminate' : currentChecked.value ? 'checked' : 'unchecked')

function handleClick(event: MouseEvent) {
  if (event.defaultPrevented || currentDisabled.value) return
  const meta = props.checked === undefined
    ? controller.toggle()
    : { previousChecked: currentChecked.value, checked: currentChecked.value === true ? false : true }
  if (meta) emit('checkedChange', meta.checked, meta)
}
</script>

<template>
  <button v-bind="$attrs" type="button" role="checkbox" :disabled="currentDisabled" :aria-checked="currentChecked === 'indeterminate' ? 'mixed' : currentChecked" :data-state="state" :data-disabled="currentDisabled ? 'true' : undefined" @click="handleClick">
    <slot :checked="currentChecked" :state="state" />
  </button>
</template>
