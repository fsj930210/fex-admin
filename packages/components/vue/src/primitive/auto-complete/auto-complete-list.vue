<script setup lang="ts">
import {
  autoCompleteListClassName,
  autoCompleteOptionClassName,
} from '@fex/components-styles/auto-complete'
import { cn } from '@fex/utils'
import { computed } from 'vue'
import { Empty, EmptyDescription } from '../empty/empty'
import { Spinner } from '../../ui/spinner/spinner'
import { useAutoComplete } from './use-auto-complete'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ class?: string }>()
const autoComplete = useAutoComplete('AutoCompleteList')
const className = computed(() => cn(autoCompleteListClassName, props.class))
</script>
<template>
  <div v-bind="$attrs" :id="autoComplete.listId" role="listbox" :class="className">
    <slot v-if="autoComplete.loading.value" name="loading"
      ><div class="flex min-h-20 items-center justify-center"><Spinner /></div
    ></slot>
    <slot v-else-if="!autoComplete.items.value.length" name="empty"
      ><Empty><EmptyDescription>No suggestions</EmptyDescription></Empty></slot
    >
    <slot v-else>
      <div
        v-for="entry in autoComplete.items.value"
        :id="`${autoComplete.listId}-${entry.key}`"
        :key="entry.key"
        role="option"
        :aria-selected="autoComplete.snapshot.value.activeKey === entry.key"
        :aria-disabled="entry.disabled || undefined"
        :data-active="autoComplete.snapshot.value.activeKey === entry.key || undefined"
        :data-disabled="entry.disabled || undefined"
        :class="autoCompleteOptionClassName"
        @pointermove="autoComplete.controller.setActiveKey(entry.key, 'pointer')"
        @pointerdown.prevent
        @click="autoComplete.controller.selectItem(entry.key)"
      >
        <slot
          name="option"
          :item="entry.item"
          :active="autoComplete.snapshot.value.activeKey === entry.key"
          :disabled="entry.disabled"
          >{{ entry.label }}</slot
        >
      </div>
    </slot>
  </div>
</template>
