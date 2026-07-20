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
  title="Path prefix and multiple forms"
  description="primitive 不隐藏路径来源，也不注册全局 Form.Provider；跨表单更新由明确的用户事件完成。"
  ><div class="grid gap-space-xl lg:grid-cols-2">
    <FormHost :form="prefixedForm" class="grid gap-space-lg"
      ><FieldSet
        ><FieldLegend>profile</FieldLegend
        ><FieldGroup
          ><Field
            name="profile.displayName"
            :validators="displayNameValidators"
            v-slot="{ field, state }"
            ><FieldRoot required :invalid="invalid(state)" :has-error="invalid(state)"
              ><FieldLabel>显示名称 <FieldRequiredIndicator /></FieldLabel
              ><FieldControl v-slot="{ props }"
                ><InputRoot
                  :value="state.value"
                  :invalid="invalid(state)"
                  @value-change="field.handleChange"
                  ><InputControl
                    v-bind="props"
                    @blur="field.handleBlur" /></InputRoot></FieldControl
              ><FieldError
                v-if="invalid(state)"
                :errors="errors(state.meta.errors)" /></FieldRoot></Field
          ><Field
            name="profile.email"
            :validators="profileEmailValidators"
            v-slot="{ field, state }"
            ><FieldRoot :invalid="invalid(state)" :has-error="invalid(state)"
              ><FieldLabel>联系邮箱</FieldLabel
              ><FieldControl v-slot="{ props }"
                ><InputRoot
                  :value="state.value"
                  :invalid="invalid(state)"
                  @value-change="field.handleChange"
                  ><InputControl
                    v-bind="props"
                    type="email"
                    @blur="field.handleBlur" /></InputRoot></FieldControl
              ><FieldError
                v-if="invalid(state)"
                :errors="
                  errors(state.meta.errors)
                " /></FieldRoot></Field></FieldGroup></FieldSet
      ><Button class="w-fit" type="submit">提交 profile</Button></FormHost
    >
    <div class="grid gap-space-md">
      <FormHost
        :form="profileForm"
        class="grid gap-space-md rounded-md border border-border p-4"
        ><FieldTitle>资料表单</FieldTitle
        ><Field name="name" v-slot="{ field, state }"
          ><FieldRoot
            ><FieldLabel>姓名</FieldLabel
            ><FieldControl v-slot="{ props }"
              ><InputRoot :value="state.value" @value-change="field.handleChange"
                ><InputControl
                  v-bind="props"
                  @blur="field.handleBlur" /></InputRoot></FieldControl></FieldRoot></Field
        ><Field name="email" :validators="requiredEmailValidators" v-slot="{ field, state }"
          ><FieldRoot required :invalid="invalid(state)" :has-error="invalid(state)"
            ><FieldLabel>资料邮箱 <FieldRequiredIndicator /></FieldLabel
            ><FieldControl v-slot="{ props }"
              ><InputRoot
                :value="state.value"
                :invalid="invalid(state)"
                @value-change="field.handleChange"
                ><InputControl
                  v-bind="props"
                  type="email"
                  @blur="field.handleBlur" /></InputRoot></FieldControl
            ><FieldError
              v-if="invalid(state)"
              :errors="errors(state.meta.errors)" /></FieldRoot></Field
        ><Button class="w-fit" type="submit">保存资料</Button></FormHost
      ><FormHost
        :form="securityForm"
        class="grid gap-space-md rounded-md border border-border p-4"
        ><FieldTitle>安全表单</FieldTitle
        ><Field
          name="notificationEmail"
          :validators="requiredEmailValidators"
          v-slot="{ field, state }"
          ><FieldRoot required :invalid="invalid(state)" :has-error="invalid(state)"
            ><FieldLabel>通知邮箱 <FieldRequiredIndicator /></FieldLabel
            ><FieldControl v-slot="{ props }"
              ><InputRoot
                :value="state.value"
                :invalid="invalid(state)"
                @value-change="field.handleChange"
                ><InputControl
                  v-bind="props"
                  type="email"
                  @blur="field.handleBlur" /></InputRoot></FieldControl
            ><FieldError
              v-if="invalid(state)"
              :errors="errors(state.meta.errors)" /></FieldRoot></Field
        ><Field name="twoFactor" v-slot="{ field, state }"
          ><FieldRoot orientation="horizontal"
            ><FieldControl v-slot="{ props }"
              ><Checkbox
                v-bind="props"
                :checked="state.value"
                @checked-change="field.handleChange($event === true)" /></FieldControl
            ><FieldLabel>开启双因素认证</FieldLabel></FieldRoot
          ></Field
        >
        <div class="flex gap-space-sm">
          <Button
            type="button"
            variant="outline"
            @click="
              securityForm.setFieldValue(
                'notificationEmail',
                profileForm.getFieldValue('email'),
              )
            "
            >使用资料邮箱</Button
          ><Button type="submit">保存安全设置</Button>
        </div></FormHost
      >
    </div>
  </div></Card
>
</template>
