<script setup lang="ts">
import { groupSelectOptions } from '@fex/components-core/select/filter-options'
import { getSelectVirtualRange } from '@fex/components-core/select/virtual'
import type { SelectOption } from '@fex/components-core/select/types'
import {
  selectEmptyClassName,
  selectGroupLabelClassName,
  selectListClassName,
  selectLoadingClassName,
  selectOptionClassName,
  selectOptionIndicatorClassName,
  selectOptionLabelClassName,
} from '@fex/components-styles/select'
import { cn } from '@fex/utils'
import { computed, ref } from 'vue'
import { CheckIcon } from '../../icon/check'
import { useSelect } from './use-select'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ class?: string; emptyText?: string; loadingText?: string }>()
const select = useSelect('SelectList')
const groups = computed(() => groupSelectOptions(select.visibleOptions.value))
const className = computed(() => cn(selectListClassName, props.class))
const viewport = ref({ scrollTop: 0, height: 320 })
const range = computed(() =>
  select.virtual.value
    ? getSelectVirtualRange(
        select.visibleOptions.value.length,
        viewport.value.scrollTop,
        viewport.value.height,
        select.virtual.value,
      )
    : undefined,
)
const virtualItems = computed(() =>
  range.value ? select.visibleOptions.value.slice(range.value.start, range.value.end) : [],
)
function selected(option: SelectOption) {
  return select.controller.selection.isSelected(option.value)
}
function disabled(option: SelectOption) {
  return option.disabled === true || select.controller.selection.isDisabled(option.value)
}
function choose(option: SelectOption) {
  if (!disabled(option)) select.controller.selectValue(option.value)
}
function scroll(event: Event) {
  const element = event.currentTarget as HTMLDivElement
  viewport.value = { scrollTop: element.scrollTop, height: element.clientHeight }
}
</script>
<template>
  <div
    v-bind="$attrs"
    :id="select.listId"
    role="listbox"
    :aria-multiselectable="select.multiple.value || undefined"
    :class="className"
    @scroll="scroll"
  >
    <div v-if="select.loading.value" :class="selectLoadingClassName">
      <slot name="loading">{{ props.loadingText ?? 'Loading…' }}</slot>
    </div>
    <div v-else-if="!select.visibleOptions.value.length" :class="selectEmptyClassName">
      <slot name="empty">{{ props.emptyText ?? 'No options' }}</slot>
    </div>
    <div v-else-if="range" :style="{ height: `${range.totalSize}px`, position: 'relative' }">
      <div :style="{ position: 'absolute', insetInline: '0', top: `${range.offset}px` }">
        <div
          v-for="option in virtualItems"
          :id="`${select.listId}-${option.value}`"
          :key="option.value"
          role="option"
          :aria-selected="selected(option)"
          :data-selected="selected(option)"
          :data-active="select.snapshot.value.activeValue === option.value"
          :class="selectOptionClassName"
          @pointermove="select.controller.setActiveValue(option.value, 'pointer')"
          @pointerdown.prevent
          @click="choose(option)"
        >
          <span :class="selectOptionLabelClassName"
            ><slot name="option" :option="option">{{ option.label }}</slot></span
          ><span :class="selectOptionIndicatorClassName"><CheckIcon /></span>
        </div>
      </div>
    </div>
    <template v-else v-for="group in groups" :key="group.label ?? 'ungrouped'">
      <div v-if="group.label" role="presentation" :class="selectGroupLabelClassName">
        {{ group.label }}
      </div>
      <div
        v-for="option in group.options"
        :id="`${select.listId}-${option.value}`"
        :key="option.value"
        role="option"
        :aria-selected="selected(option)"
        :aria-disabled="disabled(option) || undefined"
        :data-selected="selected(option)"
        :data-active="select.snapshot.value.activeValue === option.value"
        :data-disabled="disabled(option) || undefined"
        :class="selectOptionClassName"
        @pointermove="select.controller.setActiveValue(option.value, 'pointer')"
        @pointerdown.prevent
        @click="choose(option)"
      >
        <span :class="selectOptionLabelClassName"
          ><slot
            name="option"
            :option="option"
            :selected="selected(option)"
            :active="select.snapshot.value.activeValue === option.value"
            :disabled="disabled(option)"
            >{{ option.label }}</slot
          ></span
        >
        <span :class="selectOptionIndicatorClassName"><CheckIcon /></span>
      </div>
    </template>
  </div>
</template>
