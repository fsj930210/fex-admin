<script setup lang="ts">
import {
  createCalendarGrid,
  getCalendarToday,
  type CalendarDate,
  type CalendarGranularity,
  type CalendarPanel,
  type CalendarRange,
  type CalendarValue,
  type CalendarWeekday,
} from '@fex/components-core/calendar'
import { computed, provide, ref, toRef, watch } from 'vue'
import { calendarContextKey } from './context'

const props = withDefaults(
  defineProps<{
    value?: CalendarValue | null | undefined
    values?: readonly CalendarValue[] | undefined
    range?: CalendarRange | undefined
    defaultValue?: CalendarValue | null | undefined
    viewDate?: CalendarDate | undefined
    defaultViewDate?: CalendarDate | undefined
    panel?: CalendarPanel | undefined
    defaultPanel?: CalendarPanel | undefined
    granularity?: CalendarGranularity | undefined
    weekStartsOn?: CalendarWeekday | undefined
    today?: CalendarDate | undefined
    min?: CalendarDate | undefined
    max?: CalendarDate | undefined
    disabledDate?: ((date: CalendarDate) => boolean) | undefined
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
  cellSelect: [cell: import('@fex/components-core/calendar').CalendarCell]
  cellHover: [cell: import('@fex/components-core/calendar').CalendarCell]
  viewDateChange: [viewDate: CalendarDate]
  panelChange: [panel: CalendarPanel]
}>()

const internalValue = ref<CalendarValue | null>(props.defaultValue)
const internalViewDate = ref(props.defaultViewDate ?? getCalendarToday())
const internalPanel = ref<CalendarPanel>(props.defaultPanel)
const hoveredRowIndex = ref<number | null>(null)

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
    ...(props.values ? { values: props.values } : {}),
    ...(props.range ? { range: props.range } : {}),
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
  hoveredRowIndex,
  setViewDate,
  setPanel,
  selectCell: (cell) => {
    if (cell.state.disabled) return
    emit('cellSelect', cell)
    if (props.value === undefined) internalValue.value = cell.value
    emit('valueChange', cell.value)
  },
  hoverCell: (cell) => {
    if (cell.state.disabled) return
    hoveredRowIndex.value = cell.rowIndex
    emit('cellHover', cell)
  },
  clearHoveredRow: () => {
    hoveredRowIndex.value = null
  },
})
</script>

<template>
  <div
    data-slot="calendar-root"
    :data-panel="currentPanel"
    :data-granularity="currentGranularity"
    @mouseleave="hoveredRowIndex = null"
  >
    <slot />
  </div>
</template>
