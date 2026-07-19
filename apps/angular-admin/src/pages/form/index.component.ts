import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { FieldContent, FieldControl, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldRequiredIndicator, FieldRoot, FieldSeparator, FieldSet, FieldTitle } from '@fex/components-angular/primitive/field'
import { Form, FormField, TanStackField, injectForm, type AnyFieldApi } from '@fex/components-angular/primitive/form'
import { InputControl, InputRoot } from '@fex/components-angular/primitive/input'
import { Button } from '@fex/components-angular/ui/button'
import Card from '@fex/components-angular/ui/card'
import { Checkbox } from '@fex/components-angular/ui/checkbox'

const locations = { 浙江: ['杭州', '宁波', '温州'], 江苏: ['南京', '苏州', '无锡'], 广东: ['广州', '深圳', '珠海'] } as const
type Province = keyof typeof locations

@Component({
  selector: 'fex-form-page',
  standalone: true,
  imports: [RouterLink, Card, Button, Checkbox, Form, FormField, TanStackField, FieldRoot, FieldControl, FieldLabel, FieldRequiredIndicator, FieldDescription, FieldError, FieldGroup, FieldSet, FieldLegend, FieldContent, FieldTitle, FieldSeparator, InputRoot, InputControl],
  host: { class: 'block' },
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent {
  protected readonly locations = locations
  protected readonly provinceNames = Object.keys(locations) as Province[]
  protected readonly selectClass = 'h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50'
  protected readonly result = signal('尚未提交')
  protected readonly instanceResult = signal('点击按钮读取或设置字段值')
  protected readonly scrollOptions = { behavior: 'smooth', block: 'center', focus: true } as const

  protected readonly form = injectForm({ defaultValues: { account: '', password: '', remember: false }, onSubmit: async ({ value }) => { await new Promise((resolve) => setTimeout(resolve, 300)); this.result.set(`登录：${JSON.stringify(value)}`) } })
  protected readonly validationForm = injectForm({ defaultValues: { username: '', password: '', confirmPassword: '' }, onSubmit: ({ value }) => { this.result.set(`校验：${JSON.stringify(value)}`) } })
  protected readonly dynamicForm = injectForm({ defaultValues: { nicknameRequired: true, nickname: '' }, onSubmit: ({ value }) => { this.result.set(`动态规则：${JSON.stringify(value)}`) } })
  protected readonly cascadeForm = injectForm({ defaultValues: { province: '浙江' as Province, city: '杭州' }, onSubmit: ({ value }) => { this.result.set(`级联：${JSON.stringify(value)}`) } })
  protected readonly scrollForm = injectForm({ defaultValues: { note: '', deliveryAddress: '' }, onSubmit: ({ value }) => { this.result.set(`长表单：${JSON.stringify(value)}`) } })
  protected readonly instanceForm = injectForm({ defaultValues: { source: '来自 Form defaultValues', nickname: '' }, onSubmit: ({ value }) => { this.result.set(`实例方法：${JSON.stringify(value)}`) } })
  protected readonly layoutForm = injectForm({ defaultValues: { vertical: '', horizontal: '', responsive: '' } })
  protected readonly preferencesForm = injectForm({ defaultValues: { productUpdates: false, securityAlerts: true }, onSubmit: ({ value }) => { this.result.set(`通知偏好：${JSON.stringify(value)}`) } })
  protected readonly nestedForm = injectForm({ defaultValues: { nickname: '' }, onSubmit: ({ value }) => { this.result.set(`无 DOM：${value.nickname}`) } })

  protected readonly accountRules = [{ required: true, message: '请输入账号', validateTrigger: 'blur' as const }]
  protected readonly passwordValidators = { onChange: ({ value }: { value: string }) => value.length >= 6 ? undefined : '密码至少 6 位' }
  protected readonly usernameRules = [{ required: true, message: '请输入用户名', validateTrigger: 'blur' as const }, { validateTrigger: 'change' as const, validator: async (_: unknown, value: unknown) => { await new Promise((resolve) => setTimeout(resolve, 200)); if (value === 'admin') throw new Error('用户名已被占用') } }]
  protected readonly passwordRules = [{ required: true, message: '请输入密码' }, { min: 8, message: '密码至少 8 位' }]
  protected readonly confirmPasswordRules = [{ required: true, message: '请再次输入密码' }, () => ({ validator: (_: unknown, value: unknown) => value === this.validationForm.getFieldValue('password') ? undefined : '两次密码不一致' })]
  protected readonly nicknameRules = [() => ({ required: this.dynamicForm.getFieldValue('nicknameRequired'), message: '请输入昵称' })]
  protected readonly deliveryRules = [{ required: true, message: '请输入收货地址', validateTrigger: 'submit' as const }]

  protected cities(province: Province) { return locations[province] }
  protected changeProvince(field: AnyFieldApi, event: Event) { const province = (event.target as HTMLSelectElement).value as Province; field.handleChange(province); this.cascadeForm.setFieldValue('city', locations[province][0]) }
  protected setNickname() { this.instanceForm.setFieldValue('nickname', '通过 setFieldValue 设置') }
  protected getNickname() { this.instanceResult.set(this.instanceForm.getFieldValue('nickname')) }
}
