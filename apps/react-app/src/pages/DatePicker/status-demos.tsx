import {
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldRoot,
} from '@fex-design/react/primitive/field'
import { DemoDatePicker, DemoRangePicker, DemoSection } from './shared'

export function StatusDemos() {
  return (
    <DemoSection
      title="表单状态"
      description="DatePicker 和 RangePicker 接收外部表单状态，仅负责展示 error / warning 样式。"
    >
      <FieldRoot invalid hasError hasDescription>
        <FieldLabel>开始日期</FieldLabel>
        <DemoDatePicker status="error" triggerProps={{ placeholder: '请选择日期' }} />
        <FieldDescription>状态来自 Form / Field，不由 DatePicker 自己校验。</FieldDescription>
        <FieldError>请选择开始日期</FieldError>
      </FieldRoot>

      <FieldRoot hasDescription>
        <FieldLabel>审批范围</FieldLabel>
        <DemoRangePicker
          status="warning"
          triggerProps={{ startPlaceholder: '开始日期', endPlaceholder: '结束日期' }}
        />
        <FieldDescription>warning 只改变视觉状态，提交仍交给外层 Form。</FieldDescription>
      </FieldRoot>
    </DemoSection>
  )
}
