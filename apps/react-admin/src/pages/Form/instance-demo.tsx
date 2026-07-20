import { Field, FieldControl, FieldDescription, FieldLabel, FieldRoot } from '@fex/components-react/primitive/field'
import { Form, useForm } from '@fex/components-react/primitive/form'
import { InputControl, InputRoot } from '@fex/components-react/primitive/input'
import { Button } from '@fex/components-react/ui/button'
import { Card } from '@fex/components-react/ui/card'
import { useState } from 'react'

export function InstanceDemo() {
  const [result, setResult] = useState('点击按钮读取或设置字段值')
  const form = useForm({ defaultValues: { source: '来自 Form defaultValues', nickname: '' } })

  return (
    <Card title="Form instance and defaultValue" description="字段默认值，以及 getFieldValue、setFieldValue、reset 等 TanStack Form 实例方法。">
      <Form form={form} className="grid max-w-xl gap-space-lg">
        <Field name="source">
          {(field) => <FieldRoot hasDescription><FieldLabel>Form 初始值</FieldLabel><FieldControl>{({ props }) => <InputRoot value={field.state.value as string} onValueChange={field.handleChange}><InputControl {...props} onBlur={field.handleBlur} /></InputRoot>}</FieldControl><FieldDescription>来自 useForm.defaultValues。</FieldDescription></FieldRoot>}
        </Field>
        <Field name="nickname" defaultValue="来自 Field defaultValue">
          {(field) => <FieldRoot hasDescription><FieldLabel>字段初始值</FieldLabel><FieldControl>{({ props }) => <InputRoot value={field.state.value as string} onValueChange={field.handleChange}><InputControl {...props} onBlur={field.handleBlur} /></InputRoot>}</FieldControl><FieldDescription>使用 TanStack 原生 defaultValue。</FieldDescription></FieldRoot>}
        </Field>
        <div className="flex flex-wrap gap-space-sm">
          <Button type="button" onClick={() => form.setFieldValue('nickname', '通过 setFieldValue 设置')}>设置昵称</Button>
          <Button type="button" variant="outline" onClick={() => setResult(String(form.getFieldValue('nickname')))}>读取昵称</Button>
          <Button type="button" variant="outline" onClick={() => form.reset()}>重置</Button>
        </div>
        <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground" aria-live="polite">{result}</p>
      </Form>
    </Card>
  )
}
