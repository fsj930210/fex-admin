<script setup lang="ts">
import {
  createCalendarGrid,
  getCalendarToday,
  type CalendarDate,
  type CalendarGranularity,
  type CalendarPanel,
  type CalendarValue,
  type CalendarWeekday,
} from '@fex/components-core/calendar'
import { computed, provide, ref, toRef, watch } from 'vue'
import { calendarContextKey } from './context'

const props = withDefaults(
  defineProps<{
    value?: CalendarValue | null
    defaultValue?: CalendarValue | null
    viewDate?: CalendarDate
    defaultViewDate?: CalendarDate
    panel?: CalendarPanel
    defaultPanel?: CalendarPanel
    granularity?: CalendarGranularity
    weekStartsOn?: CalendarWeekday
    today?: CalendarDate
    min?: CalendarDate
    max?: CalendarDate
    disabledDate?: (date: CalendarDate) => boolean
  }>(),
  {
    defaultValue: null,
    defaultPanel: 'date',
    granularity: 'date',
    weekStartsOn: 0,
  },
)

const emit = defineEmits<{
  valueChange: [value: CalendarValue]
  viewDateChange: [viewDate: CalendarDate]
  panelChange: [panel: CalendarPanel]
}>()

const internalValue = ref<CalendarValue | null>(props.defaultValue)
const internalViewDate = ref(props.defaultViewDate ?? getCalendarToday())
const internalPanel = ref<CalendarPanel>(props.defaultPanel)

watch(
  () => props.defaultValue,
  (nextValue) => {
    if (props.value === undefined) internalValue.value = nextValue ?? null
  },
)

const currentValue = computed(() => props.value ?? internalValue.value)
const currentViewDate = computed(() => props.viewDate ?? internalViewDate.value)
const currentPanel = computed(() => props.panel ?? internalPanel.value)
const currentGranularity = toRef(props, 'granularity')
const currentWeekStartsOn = toRef(props, 'weekStartsOn')

const grid = computed(() =>
  createCalendarGrid({
    viewDate: currentViewDate.value,
    panel: currentPanel.value,
    granularity: currentGranularity.value,
    weekStartsOn: currentWeekStartsOn.value,
    ...(props.today ? { today: props.today } : {}),
    ...(props.min ? { min: props.min } : {}),
    ...(props.max ? { max: props.max } : {}),
    ...(props.disabledDate ? { disabledDate: props.disabledDate } : {}),
    ...(currentValue.value ? { value: currentValue.value } : {}),
  }),
)

function setViewDate(viewDate: CalendarDate) {
  if (props.viewDate === undefined) internalViewDate.value = viewDate
  emit('viewDateChange', viewDate)
}

function setPanel(panel: CalendarPanel) {
  if (props.panel === undefined) internalPanel.value = panel
  emit('panelChange', panel)
}

provide(calendarContextKey, {
  grid,
  value: currentValue,
  viewDate: currentViewDate,
  panel: currentPanel,
  granularity: currentGranularity,
  weekStartsOn: currentWeekStartsOn,
  setViewDate,
  setPanel,
  selectCell: (cell) => {
    if (cell.state.disabled) return
    if (props.value === undefined) internalValue.value = cell.value
    emit('valueChange', cell.value)
  },
})
</script>

<template>
  <div data-slot="calendar-root" :data-panel="currentPanel" :data-granularity="currentGranularity">
    <slot />
  </div>
</template>
