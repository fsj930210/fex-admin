<script setup lang="ts">
import {
  Field,
  FieldContent,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldRequiredIndicator,
  FieldRoot,
  FieldSet,
  FieldTitle,
} from '@fex/components-vue/primitive/field'
import { Form as FormHost } from '@fex/components-vue/primitive/form'
import { InputControl, InputRoot } from '@fex/components-vue/primitive/input'
import Button from '@fex/components-vue/ui/button'
import Card from '@fex/components-vue/ui/card'
import { Checkbox } from '@fex/components-vue/ui/checkbox'
import { useFormDemoContext } from './form-demo-context'

const {
  accountValidators,
  cascadeForm,
  changeProvince,
  confirmValidators,
  contactEmailValidators,
  contactNameValidators,
  contactsForm,
  contactsValidators,
  createContact,
  deliveryAddressValidators,
  displayNameValidators,
  dynamicRuleForm,
  errors,
  invalid,
  instanceForm,
  instanceResult,
  locations,
  loginForm,
  loginPasswordValidators,
  newPasswordValidators,
  nicknameValidators,
  prefixedForm,
  profileEmailValidators,
  profileForm,
  queueScrollToAddress,
  requiredEmailValidators,
  scrollForm,
  scrollToAddress,
  securityForm,
  selectClassName,
  usernameValidators,
  validationForm,
} = useFormDemoContext()
type Province = keyof typeof locations
</script>

<template>
<Card
  title="Scroll to a specific field"
  description="scrollToField 是独立方法，可以定位任意字段；Form 提交失败时才自动定位第一个无效 FieldControl。"
  ><FormHost
    :form="scrollForm"
    class="grid max-w-xl gap-space-lg"
    @submit="queueScrollToAddress"
    ><div class="flex flex-wrap gap-space-sm">
      <Button type="button" variant="outline" @click="scrollToAddress()">定位收货地址</Button
      ><Button type="submit">提交并定位首个错误</Button>
    </div>
    <Field name="note" v-slot="{ field, state }"
      ><FieldRoot
        ><FieldLabel>备注（选填）</FieldLabel
        ><FieldControl v-slot="{ props }"
          ><InputRoot :value="state.value" @value-change="field.handleChange"
            ><InputControl
              v-bind="props"
              @blur="field.handleBlur" /></InputRoot></FieldControl></FieldRoot
    ></Field>
    <div
      class="flex min-h-[24rem] items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground"
    >
      模拟长表单内容
    </div>
    <Field
      name="deliveryAddress"
      :validators="deliveryAddressValidators"
      v-slot="{ field, state }"
      ><FieldRoot required :invalid="invalid(state)" :has-error="invalid(state)"
        ><FieldLabel>收货地址 <FieldRequiredIndicator /></FieldLabel
        ><FieldControl v-slot="{ props }"
          ><InputRoot
            :value="state.value"
            :invalid="invalid(state)"
            @value-change="field.handleChange"
            ><InputControl
              v-bind="props"
              placeholder="位于长表单底部"
              @blur="field.handleBlur" /></InputRoot></FieldControl
        ><FieldError
          v-if="invalid(state)"
          :errors="errors(state.meta.errors)" /></FieldRoot></Field></FormHost
></Card>
</template>
