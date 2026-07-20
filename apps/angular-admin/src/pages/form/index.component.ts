import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { FieldContent, FieldControl, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldRequiredIndicator, FieldRoot, FieldSet, FieldTitle } from '@fex/components-angular/primitive/field'
import { Form, FormField, injectForm, scrollToField, type AnyFieldApi } from '@fex/components-angular/primitive/form'
import { InputControl, InputRoot } from '@fex/components-angular/primitive/input'
import { Button } from '@fex/components-angular/ui/button'
import Card from '@fex/components-angular/ui/card'
import { Checkbox } from '@fex/components-angular/ui/checkbox'

const locations = { 浙江: ['杭州', '宁波', '温州'], 江苏: ['南京', '苏州', '无锡'], 广东: ['广州', '深圳', '珠海'] } as const
type Province = keyof typeof locations
interface Contact { email: string; id: string; name: string; notifications: boolean }
const emailValidator = ({ value }: { value: unknown }) => /^\S+@\S+\.\S+$/.test(String(value)) ? undefined : '请输入有效邮箱'

@Component({
  selector: 'fex-form-page',
  standalone: true,
  imports: [RouterLink, Card, Button, Checkbox, Form, FormField, FieldRoot, FieldControl, FieldLabel, FieldRequiredIndicator, FieldDescription, FieldError, FieldGroup, FieldSet, FieldLegend, FieldTitle, FieldContent, InputRoot, InputControl],
  host: { class: 'block' },
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent {
  protected readonly locations = locations
  protected readonly provinceNames = Object.keys(locations) as Province[]
  protected readonly selectClass = 'h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20'
  protected readonly result = signal('尚未提交')
  protected readonly instanceResult = signal('点击按钮读取或设置字段值')
  protected readonly loginForm = injectForm({ defaultValues: { account: '', password: '', remember: false }, onSubmit: async ({ value }) => { await new Promise(resolve => setTimeout(resolve, 300)); this.result.set(`登录：${JSON.stringify(value)}`) } })
  protected readonly validationForm = injectForm({ defaultValues: { username: '', password: '', confirmPassword: '' }, onSubmit: ({ value }) => this.result.set(`校验：${JSON.stringify(value)}`) })
  protected readonly dynamicForm = injectForm({ defaultValues: { nicknameRequired: true, nickname: '' }, onSubmit: ({ value }) => this.result.set(`动态规则：${JSON.stringify(value)}`) })
  protected readonly cascadeForm = injectForm({ defaultValues: { province: '浙江' as Province, city: '杭州' }, onSubmit: ({ value }) => this.result.set(`级联：${JSON.stringify(value)}`) })
  protected readonly instanceForm = injectForm({ defaultValues: { source: '来自 Form defaultValues', nickname: '' }, onSubmit: ({ value }) => this.result.set(`实例：${JSON.stringify(value)}`) })
  protected readonly layoutForm = injectForm({ defaultValues: { vertical: '', horizontal: '', responsive: '' } })
  protected readonly contactsForm = injectForm({ defaultValues: { contacts: [{ id: 'primary', name: '', email: '', notifications: true }] as Contact[] }, onSubmit: ({ value }) => this.result.set(`联系人：${JSON.stringify(value)}`) })
  protected readonly prefixedForm = injectForm({ defaultValues: { profile: { displayName: '', email: '' } }, onSubmit: ({ value }) => this.result.set(`路径前缀：${JSON.stringify(value)}`) })
  protected readonly profileForm = injectForm({ defaultValues: { name: '', email: '' }, onSubmit: ({ value }) => this.result.set(`资料表单：${JSON.stringify(value)}`) })
  protected readonly securityForm = injectForm({ defaultValues: { notificationEmail: '', twoFactor: false }, onSubmit: ({ value }) => this.result.set(`安全表单：${JSON.stringify(value)}`) })
  protected readonly scrollForm = injectForm({ defaultValues: { note: '', deliveryAddress: '' }, onSubmit: ({ value }) => this.result.set(`长表单：${JSON.stringify(value)}`) })

  protected readonly accountValidators = { onBlur: ({ value }: { value: string }) => value.trim() ? undefined : '请输入账号', onSubmit: ({ value }: { value: string }) => value.trim() ? undefined : '请输入账号' }
  protected readonly loginPasswordValidators = { onChange: ({ value }: { value: string }) => value.length >= 6 ? undefined : '密码至少 6 位', onSubmit: ({ value }: { value: string }) => value.length >= 6 ? undefined : '密码至少 6 位' }
  protected readonly usernameValidators = { onBlur: ({ value }: { value: string }) => value.trim() ? undefined : '请输入用户名', onChangeAsync: async ({ value }: { value: string }) => { await new Promise(resolve => setTimeout(resolve, 200)); return value === 'admin' ? '用户名已被占用' : undefined }, onChangeAsyncDebounceMs: 400 }
  protected readonly newPasswordValidators = { onChange: ({ value }: { value: string }) => value.length >= 8 ? undefined : '密码至少 8 位' }
  protected readonly confirmValidators = { onChange: ({ value }: { value: string }) => !value ? '请再次输入密码' : value === this.validationForm.getFieldValue('password') ? undefined : '两次密码不一致', onChangeListenTo: ['password'] }
  protected readonly nicknameValidators = { onChange: ({ value }: { value: string }) => this.dynamicForm.getFieldValue('nicknameRequired') && !value.trim() ? '请输入昵称' : undefined, onChangeListenTo: ['nicknameRequired'] }
  protected readonly contactsValidators = { onSubmit: ({ value }: { value: Contact[] }) => value.length > 0 ? undefined : '至少保留一位联系人' }
  protected readonly contactNameValidators = { onChange: ({ value }: { value: string }) => value.trim() ? undefined : '请输入联系人姓名' }
  protected readonly contactEmailValidators = { onChange: ({ value }: { value: string }) => /^\S+@\S+\.\S+$/.test(value) ? undefined : '邮箱格式不正确' }
  protected readonly displayNameValidators = { onChange: ({ value }: { value: string }) => value.trim() ? undefined : '请输入显示名称' }
  protected readonly profileEmailValidators = { onBlur: ({ value }: { value: string }) => !value || emailValidator({ value }) }
  protected readonly requiredEmailValidators = { onChange: emailValidator }
  protected readonly deliveryAddressValidators = { onSubmit: ({ value }: { value: string }) => value.trim() ? undefined : '请输入收货地址' }

  protected invalid(field: AnyFieldApi) { return field.state.meta.isTouched && !field.state.meta.isValid }
  protected errors(field: AnyFieldApi) { return [...new Set(field.state.meta.errors.map(String))] }
  protected cities(province: Province) { return locations[province] }
  protected changeProvince(field: AnyFieldApi, event: Event) { const province = (event.target as HTMLSelectElement).value as Province; field.handleChange(province); this.cascadeForm.setFieldValue('city', locations[province][0]) }
  protected setNickname() { this.instanceForm.setFieldValue('nickname', '通过 setFieldValue 设置') }
  protected getNickname() { this.instanceResult.set(String(this.instanceForm.getFieldValue('nickname'))) }
  protected createContact(): Contact { return { id: crypto.randomUUID(), name: '', email: '', notifications: false } }
  protected useProfileEmail() { this.securityForm.setFieldValue('notificationEmail', this.profileForm.getFieldValue('email')) }
  protected scrollToAddress() { void scrollToField(document, 'deliveryAddress', { behavior: 'smooth', block: 'center', focus: true }) }
}
