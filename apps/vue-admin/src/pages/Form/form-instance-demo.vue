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
  title="Form instance and defaultValue"
  description="字段默认值，以及 getFieldValue、setFieldValue、reset 等 TanStack Form 实例方法。"
  ><FormHost :form="instanceForm" class="grid max-w-xl gap-space-lg"
    ><Field name="source" v-slot="{ field, state }"
      ><FieldRoot has-description
        ><FieldLabel>Form 初始值</FieldLabel
        ><FieldControl v-slot="{ props }"
          ><InputRoot :value="state.value" @value-change="field.handleChange"
            ><InputControl
              v-bind="props"
              @blur="field.handleBlur" /></InputRoot></FieldControl
        ><FieldDescription>来自 useForm.defaultValues。</FieldDescription></FieldRoot
      ></Field
    ><Field
      name="nickname"
      :defaultValue="'来自 Field defaultValue'"
      v-slot="{ field, state }"
      ><FieldRoot has-description
        ><FieldLabel>字段初始值</FieldLabel
        ><FieldControl v-slot="{ props }"
          ><InputRoot :value="state.value" @value-change="field.handleChange"
            ><InputControl
              v-bind="props"
              @blur="field.handleBlur" /></InputRoot></FieldControl
        ><FieldDescription>使用 TanStack 原生 defaultValue。</FieldDescription></FieldRoot
      ></Field
    >
    <div class="flex flex-wrap gap-space-sm">
      <Button
        type="button"
        @click="instanceForm.setFieldValue('nickname', '通过 setFieldValue 设置')"
        >设置昵称</Button
      ><Button
        type="button"
        variant="outline"
        @click="instanceResult = String(instanceForm.getFieldValue('nickname'))"
        >读取昵称</Button
      ><Button type="button" variant="outline" @click="instanceForm.reset()">重置</Button>
    </div>
    <p class="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground" aria-live="polite">
      {{ instanceResult }}
    </p></FormHost
  ></Card
>
</template>
