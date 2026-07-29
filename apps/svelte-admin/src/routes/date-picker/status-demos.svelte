<script lang="ts">
  import FieldRoot from '@fex/components-svelte/primitive/field'
  import FieldDescription from '@fex/components-svelte/primitive/field-description'
  import FieldError from '@fex/components-svelte/primitive/field-error'
  import FieldLabel from '@fex/components-svelte/primitive/field-label'
  import {
    DatePickerContent,
    DatePickerPanel,
    DatePickerRoot,
    DatePickerTrigger,
    RangePickerContent,
    RangePickerPanelGroup,
    RangePickerRoot,
    RangePickerTrigger,
  } from '@fex/components-svelte/primitive/date-picker'
  import Card from '@fex/components-svelte/ui/card'

  const demoContentClass = 'flex min-w-0 flex-wrap items-start gap-space-md'
</script>

<Card title="表单状态" description="DatePicker 和 RangePicker 接收外部表单状态，仅负责展示 error / warning 样式。" class={{ content: demoContentClass }}>
  <FieldRoot invalid hasError hasDescription>
    <FieldLabel>开始日期</FieldLabel>
    <DatePickerRoot status="error">
      <DatePickerTrigger status="error" class="w-56" placeholder="请选择日期" />
      <DatePickerContent class="overflow-hidden p-0">
        <DatePickerPanel />
      </DatePickerContent>
    </DatePickerRoot>
    <FieldDescription>状态来自 Form / Field，不由 DatePicker 自己校验。</FieldDescription>
    <FieldError>请选择开始日期</FieldError>
  </FieldRoot>

  <FieldRoot hasDescription>
    <FieldLabel>审批范围</FieldLabel>
    <RangePickerRoot status="warning">
      <RangePickerTrigger status="warning" class="w-80" startPlaceholder="开始日期" endPlaceholder="结束日期" />
      <RangePickerContent class="overflow-hidden p-0">
        <RangePickerPanelGroup />
      </RangePickerContent>
    </RangePickerRoot>
    <FieldDescription>warning 只改变视觉状态，提交仍交给外层 Form。</FieldDescription>
  </FieldRoot>
</Card>
