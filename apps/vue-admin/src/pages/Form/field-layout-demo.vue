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
  title="Field structure and primitive layouts"
  description="布局属于 Field 的 DOM 结构能力，不是 Form 的 labelCol/wrapperCol 配置；UI 层以后只组合这些 primitive。"
  ><FieldGroup
    ><FieldRoot orientation="vertical"
      ><FieldLabel>Vertical</FieldLabel
      ><InputRoot value=""><InputControl placeholder="标签在上方" /></InputRoot></FieldRoot
    ><FieldRoot orientation="horizontal"
      ><FieldLabel>Horizontal</FieldLabel
      ><InputRoot value=""
        ><InputControl placeholder="标签按内容宽度排列" /></InputRoot></FieldRoot
    ><FieldRoot orientation="responsive"
      ><FieldLabel>Responsive</FieldLabel
      ><InputRoot value=""
        ><InputControl
          placeholder="窄屏纵向，变宽后横向" /></InputRoot></FieldRoot></FieldGroup
  ><FieldGroup orientation="inline" class="mt-space-lg"
    ><FieldRoot orientation="inline"
      ><FieldLabel>关键字</FieldLabel
      ><InputRoot value=""
        ><InputControl class="w-48" placeholder="内联筛选" /></InputRoot></FieldRoot
    ><FieldRoot orientation="inline"
      ><FieldLabel>状态</FieldLabel
      ><select :class="`${selectClassName} w-32`">
        <option>全部</option>
        <option>启用</option>
      </select></FieldRoot
    ><Button type="button" variant="outline">查询</Button></FieldGroup
  ></Card
>
</template>
