<script setup lang="ts">
import {
  selectPlaceholderClassName,
  selectTagClassName,
  selectTagOverflowClassName,
  selectTagRemoveClassName,
  selectValueClassName,
} from '@fex/components-styles/select'
import { CloseIcon } from '../../icon/close'
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
          <span :class="selectTagClassName"
            >{{ option.label
            }}<button
              type="button"
              :class="selectTagRemoveClassName"
              @pointerdown.prevent
              @click.stop="select.removeValue(option.value)"
            >
              <CloseIcon /></button
          ></span>
        </slot>
      </template>
      <span
        v-if="
          props.maxTagCount !== undefined && select.selectedOptions.value.length > props.maxTagCount
        "
        :class="selectTagOverflowClassName"
        >+{{ select.selectedOptions.value.length - props.maxTagCount }}</span
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
