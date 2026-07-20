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
import { Form as FormHost, scrollToField, useForm } from '@fex/components-vue/primitive/form'
import { InputControl, InputRoot } from '@fex/components-vue/primitive/input'
import Button from '@fex/components-vue/ui/button'
import Card from '@fex/components-vue/ui/card'
import { Checkbox } from '@fex/components-vue/ui/checkbox'
import { provideFormDemoContext } from './form-demo-context'
import BasicFormDemo from './basic-form-demo.vue'
import ValidationTimingDemo from './validation-timing-demo.vue'
import DynamicValidationDemo from './dynamic-validation-demo.vue'
import FieldLayoutDemo from './field-layout-demo.vue'
import FormInstanceDemo from './form-instance-demo.vue'
import DynamicNestedDemo from './dynamic-nested-demo.vue'
import CoordinationDemo from './coordination-demo.vue'
import ScrollDemo from './scroll-demo.vue'
import { ref } from 'vue'

const locations = {
  浙江: ['杭州', '宁波', '温州'],
  江苏: ['南京', '苏州', '无锡'],
  广东: ['广州', '深圳', '珠海'],
} as const
type Province = keyof typeof locations
interface Contact {
  email: string
  id: string
  name: string
  notifications: boolean
}
const selectClassName =
  'h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20'
const result = ref('尚未提交')
const instanceResult = ref('点击按钮读取或设置字段值')
const emailValidator = ({ value }: { value: unknown }) =>
  /^\S+@\S+\.\S+$/.test(String(value)) ? undefined : '请输入有效邮箱'
const errors = (items: readonly unknown[]) => [...new Set(items.map(String))]
const createContact = (): Contact => ({
  id: crypto.randomUUID(),
  name: '',
  email: '',
  notifications: false,
})

const loginForm = useForm({
  defaultValues: { account: '', password: '', remember: false },
  onSubmit: async ({ value }) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    result.value = `登录：${JSON.stringify(value)}`
  },
})
const validationForm = useForm({
  defaultValues: { username: '', password: '', confirmPassword: '' },
  onSubmit: ({ value }) => {
    result.value = `校验：${JSON.stringify(value)}`
  },
})
const dynamicRuleForm = useForm({
  defaultValues: { nicknameRequired: true, nickname: '' },
  onSubmit: ({ value }) => {
    result.value = `动态规则：${JSON.stringify(value)}`
  },
})
const cascadeForm = useForm({
  defaultValues: { province: '浙江' as Province, city: '杭州' },
  onSubmit: ({ value }) => {
    result.value = `级联：${JSON.stringify(value)}`
  },
})
const instanceForm = useForm({ defaultValues: { source: '来自 Form defaultValues', nickname: '' } })
const contactsForm = useForm({
  defaultValues: {
    contacts: [{ id: 'primary', name: '', email: '', notifications: true }] as Contact[],
  },
  onSubmit: ({ value }) => {
    result.value = `联系人：${JSON.stringify(value)}`
  },
})
const prefixedForm = useForm({
  defaultValues: { profile: { displayName: '', email: '' } },
  onSubmit: ({ value }) => {
    result.value = `路径前缀：${JSON.stringify(value)}`
  },
})
const profileForm = useForm({
  defaultValues: { name: '', email: '' },
  onSubmit: ({ value }) => {
    result.value = `资料表单：${JSON.stringify(value)}`
  },
})
const securityForm = useForm({
  defaultValues: { notificationEmail: '', twoFactor: false },
  onSubmit: ({ value }) => {
    result.value = `安全表单：${JSON.stringify(value)}`
  },
})
const scrollForm = useForm({
  defaultValues: { note: '', deliveryAddress: '' },
  onSubmit: ({ value }) => {
    result.value = `长表单：${JSON.stringify(value)}`
  },
})

const accountValidators = {
  onBlur: ({ value }: { value: string }) => (value.trim() ? undefined : '请输入账号'),
  onSubmit: ({ value }: { value: string }) => (value.trim() ? undefined : '请输入账号'),
}
const loginPasswordValidators = {
  onChange: ({ value }: { value: string }) => (value.length >= 6 ? undefined : '密码至少 6 位'),
  onSubmit: ({ value }: { value: string }) => (value.length >= 6 ? undefined : '密码至少 6 位'),
}
const usernameValidators = {
  onBlur: ({ value }: { value: string }) => (value.trim() ? undefined : '请输入用户名'),
  onChangeAsync: async ({ value }: { value: string }) => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return value === 'admin' ? '用户名已被占用' : undefined
  },
  onChangeAsyncDebounceMs: 400,
}
const newPasswordValidators = {
  onChange: ({ value }: { value: string }) => (value.length >= 8 ? undefined : '密码至少 8 位'),
}
const confirmValidators = {
  onChange: ({ value }: { value: string }) =>
    !value
      ? '请再次输入密码'
      : value === validationForm.getFieldValue('password')
        ? undefined
        : '两次密码不一致',
  onChangeListenTo: ['password'],
}
const nicknameValidators = {
  onChange: ({ value }: { value: string }) =>
    dynamicRuleForm.getFieldValue('nicknameRequired') && !value.trim() ? '请输入昵称' : undefined,
  onChangeListenTo: ['nicknameRequired'],
}
const contactsValidators = {
  onSubmit: ({ value }: { value: Contact[] }) =>
    value.length > 0 ? undefined : '至少保留一位联系人',
}
const contactNameValidators = {
  onChange: ({ value }: { value: string }) => (value.trim() ? undefined : '请输入联系人姓名'),
}
const contactEmailValidators = {
  onChange: ({ value }: { value: string }) =>
    /^\S+@\S+\.\S+$/.test(value) ? undefined : '邮箱格式不正确',
}
const displayNameValidators = {
  onChange: ({ value }: { value: string }) => (value.trim() ? undefined : '请输入显示名称'),
}
const profileEmailValidators = {
  onBlur: ({ value }: { value: string }) => !value || emailValidator({ value }),
}
const requiredEmailValidators = { onChange: emailValidator }
const deliveryAddressValidators = {
  onSubmit: ({ value }: { value: string }) => (value.trim() ? undefined : '请输入收货地址'),
}
const invalid = (state: { meta: { isTouched: boolean; isValid: boolean } }) =>
  state.meta.isTouched && !state.meta.isValid
const changeProvince = (field: { handleChange: (value: Province) => void }, event: Event) => {
  const province = (event.target as HTMLSelectElement).value as Province
  field.handleChange(province)
  cascadeForm.setFieldValue('city', locations[province][0])
}
const scrollToAddress = () =>
  scrollToField(globalThis.document, 'deliveryAddress', {
    behavior: 'smooth',
    block: 'center',
    focus: true,
  })
const queueScrollToAddress = () => {
  if (!String(scrollForm.getFieldValue('deliveryAddress')).trim())
    globalThis.setTimeout(() => {
      void scrollToAddress()
    }, 50)
}
provideFormDemoContext({
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
  result,
  scrollForm,
  scrollToAddress,
  securityForm,
  selectClassName,
  usernameValidators,
  validationForm,
})
</script>

<template>
  <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
    <div class="mx-auto w-full max-w-5xl space-y-space-xl">
      <header class="space-y-space-md">
        <RouterLink class="text-sm text-muted-foreground hover:text-foreground" to="/"
          >返回首页</RouterLink
        >
        <div>
          <h1 class="text-2xl font-semibold text-foreground">Form and Field primitives</h1>
          <p class="max-w-3xl text-sm leading-6 text-muted-foreground">
            Form 提供提交边界和 form 实例上下文；Field
            是唯一字段状态入口。FieldRoot、Label、Control、Description 和 Error 只负责 DOM
            语义、可访问性与结构。
          </p>
        </div>
      </header>
      <BasicFormDemo />
      <ValidationTimingDemo />
      <DynamicValidationDemo />
      <FieldLayoutDemo />
      <FormInstanceDemo />
      <DynamicNestedDemo />
      <CoordinationDemo />
      <ScrollDemo />
      <Card title="Latest result">
        <pre class="overflow-auto rounded-md bg-muted p-3 text-sm text-muted-foreground">{{
          result
        }}</pre>
      </Card>
    </div>
  </main>
</template>
