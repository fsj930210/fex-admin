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
  title="Dynamic nested fields"
  description="数组本身也是 Field；在用户事件中调用 pushValue、insertValue、removeValue。嵌套字段使用完整路径，数组项使用稳定业务 id 作为 React key。"
  ><FormHost :form="contactsForm" class="grid gap-space-lg"
    ><Field name="contacts" :validators="contactsValidators" v-slot="{ field, state }"
      ><FieldSet
        ><FieldLegend>联系人</FieldLegend>
        <p class="text-sm text-muted-foreground">
          每位联系人的姓名、邮箱和通知偏好都是独立的嵌套字段。
        </p>
        <FieldGroup
          ><div
            v-for="(contact, index) in state.value"
            :key="contact.id"
            class="rounded-md border border-border p-4"
          >
            <FieldTitle>联系人 {{ Number(index) + 1 }}</FieldTitle
            ><FieldGroup class="mt-space-md"
              ><Field
                :name="`contacts[${index}].name`"
                :validators="contactNameValidators"
                v-slot="{ field: nameField, state: nameState }"
                ><FieldRoot
                  required
                  :invalid="invalid(nameState)"
                  :has-error="invalid(nameState)"
                  ><FieldLabel>姓名 <FieldRequiredIndicator /></FieldLabel
                  ><FieldControl v-slot="{ props }"
                    ><InputRoot
                      :value="nameState.value"
                      :invalid="invalid(nameState)"
                      @value-change="nameField.handleChange"
                      ><InputControl
                        v-bind="props"
                        @blur="nameField.handleBlur" /></InputRoot></FieldControl
                  ><FieldError
                    v-if="invalid(nameState)"
                    :errors="errors(nameState.meta.errors)" /></FieldRoot></Field
              ><Field
                :name="`contacts[${index}].email`"
                :validators="contactEmailValidators"
                v-slot="{ field: emailField, state: emailState }"
                ><FieldRoot
                  required
                  :invalid="invalid(emailState)"
                  :has-error="invalid(emailState)"
                  ><FieldLabel>邮箱 <FieldRequiredIndicator /></FieldLabel
                  ><FieldControl v-slot="{ props }"
                    ><InputRoot
                      :value="emailState.value"
                      :invalid="invalid(emailState)"
                      @value-change="emailField.handleChange"
                      ><InputControl
                        v-bind="props"
                        type="email"
                        @blur="emailField.handleBlur" /></InputRoot></FieldControl
                  ><FieldError
                    v-if="invalid(emailState)"
                    :errors="errors(emailState.meta.errors)" /></FieldRoot></Field
              ><Field
                :name="`contacts[${index}].notifications`"
                v-slot="{ field: notifyField, state: notifyState }"
                ><FieldRoot orientation="horizontal"
                  ><FieldControl v-slot="{ props }"
                    ><Checkbox
                      v-bind="props"
                      :checked="notifyState.value"
                      @checked-change="
                        notifyField.handleChange($event === true)
                      " /></FieldControl
                  ><FieldContent
                    ><FieldLabel>接收通知</FieldLabel
                    ><FieldDescription>嵌套布尔字段。</FieldDescription></FieldContent
                  ></FieldRoot
                ></Field
              ></FieldGroup
            >
            <div class="mt-space-md flex gap-space-sm">
              <Button
                type="button"
                variant="outline"
                @click="field.insertValue(Number(index) + 1, createContact())"
                >在后面插入</Button
              ><Button
                type="button"
                variant="outline"
                :disabled="state.value.length === 1"
                @click="field.removeValue(Number(index))"
                >删除</Button
              >
            </div>
          </div></FieldGroup
        ></FieldSet
      ><Button
        class="w-fit"
        type="button"
        variant="outline"
        @click="field.pushValue(createContact())"
        >新增联系人</Button
      ></Field
    ><Button class="w-fit" type="submit">校验并保存联系人</Button></FormHost
  ></Card
>
</template>
