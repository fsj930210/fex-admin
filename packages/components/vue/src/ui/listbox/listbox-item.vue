<script setup lang="ts">
import type { SelectionValue } from '@fex/components-core/selection/types'
import { listboxItemClassName, listboxItemContentClassName, listboxItemDescriptionClassName, listboxItemIndicatorClassName, listboxItemTitleClassName } from '@fex/components-styles/listbox'
import { cn } from '@fex/utils'
import { useAttrs } from 'vue'
import { CheckIcon } from '../../icon/check'
import { ListboxItem, ListboxItemIndicator } from '../../primitive/listbox/listbox'
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{ value: SelectionValue, disabled?: boolean, title?: string, description?: string }>(), { disabled: false })
const attrs = useAttrs()
</script>
<template><ListboxItem v-bind="attrs" :value="props.value" :disabled="props.disabled" :class="cn(listboxItemClassName({}), attrs.class as string | undefined)"><slot><span :class="listboxItemContentClassName"><span :class="listboxItemTitleClassName">{{ props.title }}</span><span v-if="props.description" :class="listboxItemDescriptionClassName">{{ props.description }}</span></span><ListboxItemIndicator :class="listboxItemIndicatorClassName"><CheckIcon /></ListboxItemIndicator></slot></ListboxItem></template>
