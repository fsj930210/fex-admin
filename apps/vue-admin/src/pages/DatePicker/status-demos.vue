<script setup lang="ts">
import {
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldRoot,
} from '@fex/components-vue/primitive/field'
import Card from '@fex/components-vue/ui/card'
import DemoDatePicker from './demo-date-picker.vue'

const demoContentClass = 'flex min-w-0 flex-wrap items-start gap-space-md'
</script>

<template>
  <Card
    title="表单状态"
    description="DatePicker 和 RangePicker 接收外部表单状态，仅负责展示 error / warning 样式。"
  >
    <div :class="demoContentClass">
      <FieldRoot invalid has-error has-description>
        <FieldLabel>开始日期</FieldLabel>
        <DemoDatePicker status="error" placeholder="请选择日期" />
        <FieldDescription>状态来自 Form / Field，不由 DatePicker 自己校验。</FieldDescription>
        <FieldError>请选择开始日期</FieldError>
      </FieldRoot>

      <FieldRoot has-description>
        <FieldLabel>审批范围</FieldLabel>
        <DemoDatePicker range status="warning" />
        <FieldDescription>warning 只改变视觉状态，提交仍交给外层 Form。</FieldDescription>
      </FieldRoot>
    </div>
  </Card>
</template>
