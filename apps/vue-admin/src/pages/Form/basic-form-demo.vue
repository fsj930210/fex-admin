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
  title="Basic form"
  description="Field 是唯一字段入口；直接使用 TanStack validators 管理校验。"
  ><FormHost :form="loginForm" class="grid max-w-xl gap-space-lg"
    ><Field name="account" :validators="accountValidators" v-slot="{ field, state }"
      ><FieldRoot
        required
        :invalid="invalid(state)"
        has-description
        :has-error="invalid(state)"
        ><FieldLabel>账号 <FieldRequiredIndicator /></FieldLabel
        ><FieldControl v-slot="{ props }"
          ><InputRoot
            :value="state.value"
            :invalid="invalid(state)"
            @value-change="field.handleChange"
            ><InputControl
              v-bind="props"
              autocomplete="username"
              placeholder="admin"
              @blur="field.handleBlur" /></InputRoot></FieldControl
        ><FieldDescription>使用 validators.onBlur 校验必填。</FieldDescription
        ><FieldError
          v-if="invalid(state)"
          :errors="errors(state.meta.errors)" /></FieldRoot></Field
    ><Field name="password" :validators="loginPasswordValidators" v-slot="{ field, state }"
      ><FieldRoot required :invalid="invalid(state)" :has-error="invalid(state)"
        ><FieldLabel>密码 <FieldRequiredIndicator /></FieldLabel
        ><FieldControl v-slot="{ props }"
          ><InputRoot
            :value="state.value"
            :invalid="invalid(state)"
            @value-change="field.handleChange"
            ><InputControl
              v-bind="props"
              type="password"
              autocomplete="current-password"
              @blur="field.handleBlur" /></InputRoot></FieldControl
        ><FieldError
          v-if="invalid(state)"
          :errors="errors(state.meta.errors)" /></FieldRoot></Field
    ><Field name="remember" v-slot="{ field, state }"
      ><FieldRoot orientation="horizontal"
        ><FieldControl v-slot="{ props }"
          ><Checkbox
            v-bind="props"
            :checked="state.value"
            @checked-change="field.handleChange($event === true)" /></FieldControl
        ><FieldContent
          ><FieldLabel>记住登录状态</FieldLabel
          ><FieldDescription>自定义控件显式绑定值与事件。</FieldDescription></FieldContent
        ></FieldRoot
      ></Field
    >
    <div class="flex gap-space-sm">
      <component
        :is="loginForm.Subscribe"
              :selector="(state: any) => [state.canSubmit, state.isSubmitting]"
        v-slot="value"
        ><Button type="submit" :disabled="Boolean(!value[0] || value[1])">{{
          value[1] ? '提交中…' : '登录'
        }}</Button></component
      ><Button type="button" variant="outline" @click="loginForm.reset()">重置</Button>
    </div></FormHost
  ></Card
>
</template>
