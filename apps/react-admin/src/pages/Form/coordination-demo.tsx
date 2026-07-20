import { Field, FieldControl, FieldGroup, FieldLabel, FieldLegend, FieldRoot, FieldSet, FieldTitle } from '@fex/components-react/primitive/field'
import { Form, useForm } from '@fex/components-react/primitive/form'
import { Button } from '@fex/components-react/ui/button'
import { Card } from '@fex/components-react/ui/card'
import { Checkbox } from '@fex/components-react/ui/checkbox'
import { TextField, type SetDemoResult } from './shared'

const emailValidator = ({ value }: { value: unknown }) => /^\S+@\S+\.\S+$/.test(String(value)) ? undefined : '请输入有效邮箱'

export function CoordinationDemo({ setResult }: { setResult: SetDemoResult }) {
  const prefixedForm = useForm({
    defaultValues: { profile: { displayName: '', email: '' } },
    onSubmit: ({ value }) => setResult(`路径前缀：${JSON.stringify(value)}`),
  })
  const profileForm = useForm({
    defaultValues: { name: '', email: '' },
    onSubmit: ({ value }) => setResult(`资料表单：${JSON.stringify(value)}`),
  })
  const securityForm = useForm({
    defaultValues: { notificationEmail: '', twoFactor: false },
    onSubmit: ({ value }) => setResult(`安全表单：${JSON.stringify(value)}`),
  })

  return (
    <Card title="Path prefix and multiple forms" description="primitive 不隐藏路径来源，也不注册全局 Form.Provider；跨表单更新由明确的用户事件完成。">
      <div className="grid gap-space-xl lg:grid-cols-2">
        <Form form={prefixedForm} className="grid gap-space-lg">
          <FieldSet>
            <FieldLegend>profile</FieldLegend>
            <FieldGroup>
              <TextField name="profile.displayName" label="显示名称" required validators={{ onChange: ({ value }) => String(value).trim() ? undefined : '请输入显示名称' }} />
              <TextField name="profile.email" label="联系邮箱" type="email" validators={{ onBlur: ({ value }) => !value || emailValidator({ value }) }} />
            </FieldGroup>
          </FieldSet>
          <Button className="w-fit" type="submit">提交 profile</Button>
        </Form>

        <div className="grid gap-space-md">
          <Form form={profileForm} className="grid gap-space-md rounded-md border border-border p-4">
            <FieldTitle>资料表单</FieldTitle>
            <TextField name="name" label="姓名" />
            <TextField name="email" label="资料邮箱" type="email" required validators={{ onChange: emailValidator }} />
            <Button className="w-fit" type="submit">保存资料</Button>
          </Form>
          <Form form={securityForm} className="grid gap-space-md rounded-md border border-border p-4">
            <FieldTitle>安全表单</FieldTitle>
            <TextField name="notificationEmail" label="通知邮箱" type="email" required validators={{ onChange: emailValidator }} />
            <Field name="twoFactor">
              {(field) => (
                <FieldRoot orientation="horizontal">
                  <FieldControl>
                    {({ props }) => <Checkbox {...props} checked={field.state.value as boolean} onCheckedChange={(checked) => field.handleChange(checked === true)} />}
                  </FieldControl>
                  <FieldLabel>开启双因素认证</FieldLabel>
                </FieldRoot>
              )}
            </Field>
            <div className="flex gap-space-sm">
              <Button type="button" variant="outline" onClick={() => securityForm.setFieldValue('notificationEmail', profileForm.getFieldValue('email'))}>使用资料邮箱</Button>
              <Button type="submit">保存安全设置</Button>
            </div>
          </Form>
        </div>
      </div>
    </Card>
  )
}
