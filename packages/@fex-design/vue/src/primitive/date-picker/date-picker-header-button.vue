<script setup lang="ts">
import { getNextViewDateByHeaderAction } from '@fex-design/core/date-picker/panel'
import type { DatePickerHeaderAction } from '@fex-design/core/date-picker/types'
import {
  datePickerHeaderDoubleIconClassName,
  datePickerHeaderNavigationClassName,
} from '@fex-design/styles/date-picker'
import { cn } from '@fex/utils'
import { computed } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '../../icon/chevron'
import Button from '../button/button.vue'
import { useCalendarContext } from '../calendar/context'
import { useHeaderOwner } from './date-picker-header-owner'

const props = defineProps<{ action: DatePickerHeaderAction; class?: string }>()
const owner = useHeaderOwner('DatePickerHeaderButton')
const calendar = useCalendarContext('DatePickerHeaderButton')
const isPrevious = computed(() => props.action.startsWith('previous'))
const isDouble = computed(() => props.action.includes('year') || props.action.includes('panel'))

function runAction(event: Event) {
  if (event.defaultPrevented) return
  const nextViewDate = getNextViewDateByHeaderAction(
    calendar.viewDate.value,
    props.action,
    calendar.panel.value,
  )
  calendar.setViewDate(nextViewDate)
  owner.setViewDate(nextViewDate)
}
</script>

<template>
  <Button
    data-slot="date-picker-header-button"
    :data-action="props.action"
    :class="cn(datePickerHeaderNavigationClassName, props.class)"
    @click="runAction"
  >
    <slot>
      <span class="flex items-center">
        <template v-if="isDouble">
          <ChevronLeftIcon v-if="isPrevious" class="size-4" />
          <ChevronLeftIcon
            v-if="isPrevious"
            :class="cn(datePickerHeaderDoubleIconClassName, 'size-4')"
          />
          <ChevronRightIcon v-if="!isPrevious" class="size-4" />
          <ChevronRightIcon
            v-if="!isPrevious"
            :class="cn(datePickerHeaderDoubleIconClassName, 'size-4')"
          />
        </template>
        <template v-else>
          <ChevronLeftIcon v-if="isPrevious" class="size-4" />
          <ChevronRightIcon v-else class="size-4" />
        </template>
      </span>
    </slot>
  </Button>
</template>
