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
  title="Validation timing, async validation and dependencies"
  description="展示 onBlur、onChangeAsync、防抖与 onChangeListenTo。"
  ><FormHost :form="validationForm" class="grid max-w-xl gap-space-lg"
    ><Field name="username" :validators="usernameValidators" v-slot="{ field, state }"
      ><FieldRoot
        required
        :invalid="invalid(state)"
        has-description
        :has-error="invalid(state)"
        ><FieldLabel>用户名 <FieldRequiredIndicator /></FieldLabel
        ><FieldControl v-slot="{ props }"
          ><InputRoot
            :value="state.value"
            :invalid="invalid(state)"
            @value-change="field.handleChange"
            ><InputControl
              v-bind="props"
              @blur="field.handleBlur" /></InputRoot></FieldControl
        ><FieldDescription
          >onBlur 校验必填；onChangeAsync 经 400ms 防抖校验占用。</FieldDescription
        ><FieldError
          v-if="invalid(state)"
          :errors="errors(state.meta.errors)" /></FieldRoot></Field
    ><Field name="password" :validators="newPasswordValidators" v-slot="{ field, state }"
      ><FieldRoot required :invalid="invalid(state)" :has-error="invalid(state)"
        ><FieldLabel>新密码 <FieldRequiredIndicator /></FieldLabel
        ><FieldControl v-slot="{ props }"
          ><InputRoot
            :value="state.value"
            :invalid="invalid(state)"
            @value-change="field.handleChange"
            ><InputControl
              v-bind="props"
              type="password"
              @blur="field.handleBlur" /></InputRoot></FieldControl
        ><FieldError
          v-if="invalid(state)"
          :errors="errors(state.meta.errors)" /></FieldRoot></Field
    ><Field name="confirmPassword" :validators="confirmValidators" v-slot="{ field, state }"
      ><FieldRoot
        required
        :invalid="invalid(state)"
        has-description
        :has-error="invalid(state)"
        ><FieldLabel>确认密码 <FieldRequiredIndicator /></FieldLabel
        ><FieldControl v-slot="{ props }"
          ><InputRoot
            :value="state.value"
            :invalid="invalid(state)"
            @value-change="field.handleChange"
            ><InputControl
              v-bind="props"
              type="password"
              @blur="field.handleBlur" /></InputRoot></FieldControl
        ><FieldDescription
          >password 变化时，onChangeListenTo 会重跑当前字段校验。</FieldDescription
        ><FieldError
          v-if="invalid(state)"
          :errors="errors(state.meta.errors)" /></FieldRoot></Field
    ><Button class="w-fit" type="submit">验证</Button></FormHost
  ></Card
>
</template>
