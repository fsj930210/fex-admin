import { createCalendarDate, getCalendarValueKey } from '@fex-design/core/calendar'
import {
  CalendarCell,
  CalendarGrid,
  CalendarWeekHeader,
} from '@fex-design/solid/primitive/calendar'
import {
  DatePickerFooter,
  DatePickerPanel,
  useDatePickerContext,
} from '@fex-design/solid/primitive/date-picker'
import { Button } from '@fex-design/solid/ui/button'
import { DemoDatePicker, Section } from './shared'

const releaseDate = createCalendarDate(2026, 7, 30)

export function CustomDemos() {
  return (
    <>
      <Section
        title="自定义单元格"
        description="DatePickerPanel 透传 Calendar，可以直接自定义 CalendarGrid / CalendarCell。"
      >
        <DemoDatePicker>
          <DatePickerPanel>
            <CalendarWeekHeader class="grid grid-cols-7 px-3 py-2 text-center text-xs text-muted-foreground" />
            <CalendarGrid class="grid gap-1 p-3 [&>[data-slot=calendar-row]]:grid [&>[data-slot=calendar-row]]:grid-cols-7 [&>[data-slot=calendar-row]]:gap-1">
              {(cell) => (
                <CalendarCell
                  cell={cell}
                  class="min-h-10 cursor-pointer rounded-md text-sm hover:bg-muted-background data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground"
                >
                  <span class="flex flex-col items-center">
                    <span>{cell.label}</span>
                    {getCalendarValueKey(cell.value) === getCalendarValueKey(releaseDate) ? (
                      <span class="text-[10px]">发布</span>
                    ) : null}
                  </span>
                </CalendarCell>
              )}
            </CalendarGrid>
          </DatePickerPanel>
        </DemoDatePicker>
      </Section>
      <Section
        title="自定义 Footer"
        description="Footer 通过 context 获取 close / confirm / cancel / clear。"
      >
        <DemoDatePicker
          needConfirm
          footer={
            <DatePickerFooter>
              {({ close, clear, confirm }) => (
                <>
                  <Button size="sm" variant="ghost" onClick={clear}>
                    清空
                  </Button>
                  <Button size="sm" variant="outline" onClick={close}>
                    只关闭
                  </Button>
                  <Button size="sm" onClick={confirm}>
                    确认
                  </Button>
                </>
              )}
            </DatePickerFooter>
          }
        />
      </Section>
      <Section
        title="自定义面板"
        description="自定义面板可以调用 primitive 暴露的 close，并按业务自由组合内容。"
      >
        <DemoDatePicker>
          <CustomPanel />
        </DemoDatePicker>
      </Section>
    </>
  )
}

function CustomPanel() {
  const picker = useDatePickerContext('CustomPanel')
  return (
    <div class="grid gap-space-sm p-space-md">
      <p class="text-sm text-muted-foreground">
        这是完全自定义面板，仍可访问 DatePicker primitive 暴露的关闭方法。
      </p>
      <Button size="sm" onClick={picker.close}>
        关闭面板
      </Button>
    </div>
  )
}
