<script setup lang="ts">
import type { CheckboxChangeMeta, CheckboxCheckedState } from '@fex/components-core/checkbox/types'
import { checkboxCheckIconClassName, checkboxClassName, checkboxIndicatorClassName, checkboxMinusIconClassName, type CheckboxStyleProps } from '@fex/components-styles/checkbox'
import { cn } from '@fex/utils'
import { useAttrs } from 'vue'
import { CheckIcon } from '../../icon/check'
import { MinusIcon } from '../../icon/minus'
import { CheckboxIndicator, CheckboxRoot } from '../../primitive/checkbox/checkbox'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ checked?: CheckboxCheckedState, defaultChecked?: CheckboxCheckedState, disabled?: boolean, size?: CheckboxStyleProps['size'] }>()
const emit = defineEmits<{ checkedChange: [checked: CheckboxCheckedState, meta: CheckboxChangeMeta] }>()
const attrs = useAttrs()
</script>

<template>
  <CheckboxRoot v-bind="attrs" :checked="props.checked" :default-checked="props.defaultChecked" :disabled="props.disabled" data-slot="checkbox" :class="cn(checkboxClassName({ size: props.size }), attrs.class as string | undefined)" @checked-change="(checked, meta) => emit('checkedChange', checked, meta)">
    <template #default="{ checked }">
      <CheckboxIndicator :checked="checked" data-slot="checkbox-indicator" :class="checkboxIndicatorClassName">
        <slot><CheckIcon :class="checkboxCheckIconClassName" /><MinusIcon :class="checkboxMinusIconClassName" /></slot>
      </CheckboxIndicator>
    </template>
  </CheckboxRoot>
</template>
