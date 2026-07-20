import { Field, FieldContent, FieldControl, FieldDescription, FieldLabel, FieldRoot } from '@fex/components-react/primitive/field'
import { Form, useForm } from '@fex/components-react/primitive/form'
import { Button } from '@fex/components-react/ui/button'
import { Card } from '@fex/components-react/ui/card'
import { Checkbox } from '@fex/components-react/ui/checkbox'
import { TextField, type SetDemoResult } from './shared'

export function BasicValidationDemo({ setResult }: { setResult: SetDemoResult }) {
  const loginForm = useForm({
    defaultValues: { account: '', password: '', remember: false },
    onSubmit: async ({ value }) => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      setResult(`登录：${JSON.stringify(value)}`)
    },
  })
  const validationForm = useForm({
    defaultValues: { username: '', password: '', confirmPassword: '' },
    onSubmit: ({ value }) => setResult(`校验：${JSON.stringify(value)}`),
  })

  return (
    <>
      <Card title="Basic form" description="Field 是唯一字段入口；直接使用 TanStack validators 管理校验。">
        <Form form={loginForm} className="grid max-w-xl gap-space-lg">
          <TextField
            name="account"
            label="账号"
            required
            placeholder="admin"
            description="使用 validators.onBlur 校验必填。"
            validators={{
              onBlur: ({ value }) => String(value).trim() ? undefined : '请输入账号',
              onSubmit: ({ value }) => String(value).trim() ? undefined : '请输入账号',
            }}
          />
          <TextField
            name="password"
            label="密码"
            required
            type="password"
            validators={{
              onChange: ({ value }) => String(value).length >= 6 ? undefined : '密码至少 6 位',
              onSubmit: ({ value }) => String(value).length >= 6 ? undefined : '密码至少 6 位',
            }}
          />
          <Field name="remember">
            {(field) => (
              <FieldRoot orientation="horizontal">
                <FieldControl>
                  {({ props }) => <Checkbox {...props} checked={field.state.value as boolean} onCheckedChange={(checked) => field.handleChange(checked === true)} />}
                </FieldControl>
                <FieldContent>
                  <FieldLabel>记住登录状态</FieldLabel>
                  <FieldDescription>自定义控件显式绑定值与事件。</FieldDescription>
                </FieldContent>
              </FieldRoot>
            )}
          </Field>
          <loginForm.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
            {([canSubmit, isSubmitting]) => (
              <div className="flex gap-space-sm">
                <Button type="submit" disabled={!canSubmit || isSubmitting}>{isSubmitting ? '提交中…' : '登录'}</Button>
                <Button type="button" variant="outline" onClick={() => loginForm.reset()}>重置</Button>
              </div>
            )}
          </loginForm.Subscribe>
        </Form>
      </Card>

      <Card title="Validation timing, async validation and dependencies" description="展示 onBlur、onChangeAsync、防抖与 onChangeListenTo。">
        <Form form={validationForm} className="grid max-w-xl gap-space-lg">
          <TextField
            name="username"
            label="用户名"
            required
            description="onBlur 校验必填；onChangeAsync 经 400ms 防抖校验占用。"
            validators={{
              onBlur: ({ value }) => String(value).trim() ? undefined : '请输入用户名',
              onChangeAsync: async ({ value }) => {
                await new Promise((resolve) => setTimeout(resolve, 200))
                return value === 'admin' ? '用户名已被占用' : undefined
              },
              onChangeAsyncDebounceMs: 400,
            }}
          />
          <TextField name="password" label="新密码" required type="password" validators={{ onChange: ({ value }) => String(value).length >= 8 ? undefined : '密码至少 8 位' }} />
          <TextField
            name="confirmPassword"
            label="确认密码"
            required
            type="password"
            description="password 变化时，onChangeListenTo 会重跑当前字段校验。"
            validators={{
              onChange: ({ value }) => !value ? '请再次输入密码' : value === validationForm.getFieldValue('password') ? undefined : '两次密码不一致',
              onChangeListenTo: ['password'],
            }}
          />
          <Button className="w-fit" type="submit">验证</Button>
        </Form>
      </Card>
    </>
  )
}
