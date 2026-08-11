<script setup lang="ts">
import {
  selectPlaceholderClassName,
  selectValueClassName,
} from '@fex-design/styles/select'
import Tag from '../tag/tag.vue'
import { useSelect } from './use-select'

const props = defineProps<{ placeholder?: string | undefined; maxTagCount?: number | undefined }>()
const select = useSelect('SelectValue')
</script>
<template>
  <div :class="selectValueClassName">
    <template v-if="select.multiple.value">
      <template
        v-for="option in select.selectedOptions.value.slice(0, props.maxTagCount)"
        :key="option.value"
      >
        <slot name="tag" :option="option" :remove="() => select.removeValue(option.value)">
          <Tag size="sm" closable :close-label="`Remove ${String(option.label)}`" @pointerdown.capture.prevent @close.stop="select.removeValue(option.value)">{{ option.label }}</Tag>
        </slot>
      </template>
      <Tag
        v-if="
          props.maxTagCount !== undefined && select.selectedOptions.value.length > props.maxTagCount
        "
        size="sm"
        >+{{ select.selectedOptions.value.length - props.maxTagCount }}</Tag
      >
    </template>
    <slot
      v-else-if="select.selectedOptions.value[0]"
      name="value"
      :option="select.selectedOptions.value[0]"
      >{{ select.selectedOptions.value[0]?.label }}</slot
    >
    <span v-else-if="!select.snapshot.value.searchValue" :class="selectPlaceholderClassName">{{
      props.placeholder
    }}</span>
  </div>
</template>
