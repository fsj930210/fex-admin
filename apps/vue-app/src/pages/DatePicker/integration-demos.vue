<script setup lang="ts">
import {
  getCalendarToday,
  type CalendarRange,
  type CalendarValue,
} from '@fex-design/core/calendar'
import { formatDatePickerValue } from '@fex-design/core/date-picker/value'
import { datePickerDateTimePanelClassName } from '@fex-design/styles/date-picker'
import {
  DatePickerCancel,
  DatePickerConfirm,
  DatePickerContent,
  DatePickerFooter,
  DatePickerPanel,
  DatePickerRoot,
  DatePickerTrigger,
  RangePickerContent,
  RangePickerPanelGroup,
  RangePickerRoot,
  RangePickerTrigger,
} from '@fex-design/vue/primitive/date-picker'
import {
  TimePickerHourColumn,
  TimePickerMinuteColumn,
  TimePickerPanel,
  TimePickerRoot,
  TimePickerSecondColumn,
  type TimeValue,
} from '@fex-design/vue/primitive/time-picker'
import Card from '@fex-design/vue/ui/card'
import { ref } from 'vue'
import PresetRangePanel from './preset-range-panel.vue'

const today = getCalendarToday()
const presetRange = ref<CalendarRange<CalendarValue>>(lastDays(7))
const submitted = ref<CalendarRange<CalendarValue>>({})
const submitCount = ref(0)
const dateTimeDate = ref<CalendarValue | null>(today)
const time = ref<TimeValue>({ hour: 9, minute: 30, second: 0 })
const draftTime = ref<TimeValue>(time.value)

function lastDays(days: number): CalendarRange<CalendarValue> {
  return { start: today.subtract({ days: days - 1 }), end: today }
}

function setPreset(value: CalendarRange) {
  presetRange.value = value as CalendarRange<CalendarValue>
}

function setSubmitted(value: CalendarRange<CalendarValue>) {
  submitted.value = value
}

function setDateTimeDate(value: CalendarValue | readonly CalendarValue[] | null) {
  dateTimeDate.value = Array.isArray(value) ? null : (value as CalendarValue | null)
}

function rangeText(value: CalendarRange<CalendarValue>) {
  return `${value.start ? formatDatePickerValue(value.start, { picker: 'date' }) : '空'} ~ ${value.end ? formatDatePickerValue(value.end, { picker: 'date' }) : '空'}`
}

function dateTimeDisplayValue() {
  return `${formatDatePickerValue(dateTimeDate.value, { picker: 'date' })} ${formatTime(time.value)}`.trim()
}

function formatTime(value: TimeValue) {
  return `${String(value.hour).padStart(2, '0')}:${String(value.minute).padStart(2, '0')}:${String(value.second ?? 0).padStart(2, '0')}`
}
</script>

<template>
  <Card
    title="预设范围"
    description="预设会直接写入受控范围并保持面板打开，可用于报表、审计和运营筛选。"
  >
    <div>
      <RangePickerRoot :value="presetRange" @change="setPreset">
        <RangePickerTrigger class="w-80" />
        <RangePickerContent class="overflow-hidden p-0">
          <PresetRangePanel @select="setPreset" />
        </RangePickerContent>
      </RangePickerRoot>
      <p class="mt-space-sm w-full text-xs text-muted-foreground">
        当前范围：{{ rangeText(presetRange) }}
      </p>
    </div>
  </Card>

  <Card
    title="确认后提交"
    description="选择过程只更新面板草稿；点击确认并提交后，才向外部提交范围。"
  >
    <div>
      <RangePickerRoot need-confirm @change="setSubmitted">
        <RangePickerTrigger class="w-80" />
        <RangePickerContent class="overflow-hidden p-0">
          <RangePickerPanelGroup />
          <DatePickerFooter>
            <DatePickerConfirm @click="submitCount += 1">确认并提交</DatePickerConfirm>
          </DatePickerFooter>
        </RangePickerContent>
      </RangePickerRoot>
      <p class="mt-space-sm w-full text-xs text-muted-foreground">
        当前范围：{{ rangeText(submitted) }}
      </p>
      <p class="mt-space-sm text-xs text-muted-foreground">已提交 {{ submitCount }} 次</p>
    </div>
  </Card>

  <Card title="日期与时间" description="一个触发器组合日期和时间，确认后一起关闭面板。">
    <DatePickerRoot
      need-confirm
      placement="bottom"
      :value="dateTimeDate"
      @change="setDateTimeDate"
      @open-change="
        (open) => {
          if (open) draftTime = time
        }
      "
    >
      <DatePickerTrigger
        class="w-64"
        :display-value="dateTimeDisplayValue()"
        placeholder="请选择日期和时间"
      />
      <DatePickerContent class="w-[36rem] min-w-[36rem] overflow-hidden p-0">
        <TimePickerRoot
          :open="true"
          :value="draftTime"
          format="HH:mm:ss"
          @change="
            (next) => {
              if (next) draftTime = next
            }
          "
        >
          <div class="flex">
            <DatePickerPanel
              :class="`min-w-0 flex-1 self-start ${datePickerDateTimePanelClassName}`"
            />
            <div class="flex w-42 shrink-0 flex-col border-l border-border">
              <div
                class="flex h-12 shrink-0 items-center justify-center border-b border-border text-sm font-semibold"
              >
                {{ formatTime(draftTime) }}
              </div>
              <TimePickerPanel class="h-[224px] min-h-0 overflow-hidden">
                <TimePickerHourColumn class="h-[224px]" />
                <TimePickerMinuteColumn class="h-[224px]" />
                <TimePickerSecondColumn class="h-[224px]" />
              </TimePickerPanel>
            </div>
          </div>
        </TimePickerRoot>
        <DatePickerFooter>
          <DatePickerCancel @click="draftTime = time">取消</DatePickerCancel>
          <DatePickerConfirm @click="time = draftTime">确定</DatePickerConfirm>
        </DatePickerFooter>
      </DatePickerContent>
    </DatePickerRoot>
  </Card>
</template>
