<script setup lang="ts">
import { createCalendarDate, getCalendarValueKey } from '@fex/components-core/calendar'
import {
  CalendarCell as CalendarCellView,
  CalendarGrid,
  CalendarWeekHeader,
} from '@fex/components-vue/primitive/calendar'
import {
  DatePickerContent,
  DatePickerFooter,
  DatePickerPanel,
  DatePickerRoot,
  DatePickerTrigger,
} from '@fex/components-vue/primitive/date-picker'
import Button from '@fex/components-vue/ui/button'
import Card from '@fex/components-vue/ui/card'
import CustomPanel from './custom-panel.vue'

const releaseDate = createCalendarDate(2026, 7, 30)
const gridClass =
  'grid gap-1 p-3 [&>[data-slot=calendar-row]]:grid [&>[data-slot=calendar-row]]:grid-cols-7 [&>[data-slot=calendar-row]]:gap-1'
const cellClass =
  'min-h-10 cursor-pointer rounded-md text-sm hover:bg-muted-background data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground'
</script>

<template>
  <Card
    title="自定义单元格"
    description="DatePickerPanel 透传 Calendar，可以直接自定义 CalendarGrid / CalendarCell。"
  >
    <div class="flex min-w-0 flex-wrap items-start gap-space-md">
      <DatePickerRoot>
        <DatePickerTrigger class="w-56" placeholder="YYYY-MM-DD" />
        <DatePickerContent class="overflow-hidden p-0">
          <DatePickerPanel>
            <CalendarWeekHeader
              class="grid grid-cols-7 px-3 py-2 text-center text-xs text-muted-foreground"
            />
            <CalendarGrid :class="gridClass">
              <template #default="{ cell }">
                <CalendarCellView :cell="cell" :class="cellClass">
                  <span class="flex flex-col items-center">
                    <span>{{ cell.label }}</span>
                    <span
                      v-if="getCalendarValueKey(cell.value) === getCalendarValueKey(releaseDate)"
                      class="text-[10px]"
                      >发布</span
                    >
                  </span>
                </CalendarCellView>
              </template>
            </CalendarGrid>
          </DatePickerPanel>
        </DatePickerContent>
      </DatePickerRoot>
    </div>
  </Card>
  <Card
    title="自定义 Footer"
    description="Footer 通过 context 获取 close / confirm / cancel / clear。"
  >
    <div class="flex min-w-0 flex-wrap items-start gap-space-md">
      <DatePickerRoot need-confirm>
        <DatePickerTrigger class="w-56" placeholder="YYYY-MM-DD" />
        <DatePickerContent class="overflow-hidden p-0">
          <DatePickerPanel />
          <DatePickerFooter v-slot="{ close, clear, confirm }">
            <Button size="sm" variant="ghost" @click="clear()">清空</Button>
            <Button size="sm" variant="outline" @click="close()">只关闭</Button>
            <Button size="sm" @click="confirm()">确认</Button>
          </DatePickerFooter>
        </DatePickerContent>
      </DatePickerRoot>
    </div>
  </Card>
  <Card
    title="自定义面板"
    description="自定义面板可以调用 primitive 暴露的 close，并按业务自由组合内容。"
  >
    <div class="flex min-w-0 flex-wrap items-start gap-space-md">
      <DatePickerRoot>
        <DatePickerTrigger class="w-56" placeholder="YYYY-MM-DD" />
        <DatePickerContent class="overflow-hidden p-0">
          <CustomPanel />
        </DatePickerContent>
      </DatePickerRoot>
    </div>
  </Card>
</template>
