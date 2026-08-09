<script setup lang="ts">
import { cascaderClearClassName, cascaderIndicatorClassName, cascaderInputClassName, cascaderSuffixClassName, cascaderTriggerClassName, cascaderValueContainerClassName } from '@fex-design/styles/cascader'
import { cn } from '@fex/utils'
import { computed } from 'vue'
import { ChevronDownIcon } from '../../icon/chevron'
import { CloseIcon } from '../../icon/close'
import { LoadingIcon } from '../../icon/loading'
import PrimitiveButton from '../button/button.vue'
import PopoverTrigger from '../popover/popover-trigger.vue'
import CascaderValue from './cascader-value.vue'
import { useCascader } from './use-cascader'
defineOptions({ inheritAttrs: false })
const props = defineProps<{ class?: string }>()
const cascader = useCascader('CascaderTrigger')
const className = computed(() => cn(cascaderTriggerClassName(), props.class))
function input(event: Event) { const keyword=(event.target as HTMLInputElement).value;cascader.controller.setSearchValue(keyword);keyword.trim()?cascader.controller.open():cascader.controller.close() }
function focus() { if (!cascader.showSearch.value) cascader.controller.open() }
function keydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') cascader.controller.moveActive(event.key === 'ArrowDown' ? 1 : -1)
  else if (event.key === 'ArrowRight') cascader.controller.moveToChild(); else if (event.key === 'ArrowLeft') cascader.controller.moveToParent()
  else if (event.key === 'Home' || event.key === 'End') cascader.controller.moveToBoundary(event.key === 'Home' ? 'first' : 'last')
  else if (event.key === 'Enter' || event.key === ' ') cascader.controller.selectActive(); else if (event.key === 'Escape') cascader.controller.close(); else return
  event.preventDefault(); cascader.controller.open()
}
</script>
<template><PopoverTrigger v-slot="trigger"><div v-bind="{ ...$attrs, ...trigger.props }" :ref="trigger.ref" role="presentation" :data-disabled="cascader.disabled.value || undefined" :data-status="cascader.status.value" :class="className" @keydown="keydown"><div :class="cascaderValueContainerClassName"><slot><CascaderValue /></slot><input role="combobox" :aria-expanded="cascader.snapshot.value.open" :disabled="cascader.disabled.value" :readonly="!cascader.showSearch.value" :value="cascader.snapshot.value.searchValue" :placeholder="cascader.showSearch.value && !cascader.selectedPaths.value.length ? cascader.placeholder.value : undefined" :class="cascaderInputClassName" @focus="focus" @click.stop @input="input" /></div><span :class="cascaderSuffixClassName"><LoadingIcon v-if="cascader.loading.value" class="animate-spin" /><PrimitiveButton v-else-if="cascader.clearable.value && cascader.selectedPaths.value.length" :class="cascaderClearClassName" @click.stop="cascader.controller.clear()"><CloseIcon /></PrimitiveButton><span v-else :data-state="cascader.snapshot.value.open ? 'open' : 'closed'" :class="cascaderIndicatorClassName"><ChevronDownIcon /></span></span></div></PopoverTrigger></template>
