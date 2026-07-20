import { Field, FieldContent, FieldControl, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldRoot, FieldSet, FieldTitle } from '@fex/components-react/primitive/field'
import { Form, useForm } from '@fex/components-react/primitive/form'
import { Button } from '@fex/components-react/ui/button'
import { Card } from '@fex/components-react/ui/card'
import { Checkbox } from '@fex/components-react/ui/checkbox'
import { TextField, type SetDemoResult } from './shared'

interface Contact {
  email: string
  id: string
  name: string
  notifications: boolean
}

function createContact(): Contact {
  return { id: crypto.randomUUID(), name: '', email: '', notifications: false }
}

export function DynamicNestedDemo({ setResult }: { setResult: SetDemoResult }) {
  const contactsForm = useForm({
    defaultValues: { contacts: [{ id: 'primary', name: '', email: '', notifications: true }] },
    onSubmit: ({ value }) => setResult(`联系人：${JSON.stringify(value)}`),
  })

  return (
    <Card title="Dynamic nested fields" description="数组本身也是 Field；在用户事件中调用 pushValue、insertValue、removeValue。嵌套字段使用完整路径，数组项使用稳定业务 id 作为 React key。">
      <Form form={contactsForm} className="grid gap-space-lg">
        <Field name="contacts" validators={{ onSubmit: ({ value }) => value.length > 0 ? undefined : '至少保留一位联系人' }}>
          {(contactsField) => (
            <>
              <FieldSet>
                <FieldLegend>联系人</FieldLegend>
                <p className="text-sm text-muted-foreground">每位联系人的姓名、邮箱和通知偏好都是独立的嵌套字段。</p>
                <FieldGroup>
                  {(contactsField.state.value as Contact[]).map((contact, index) => (
                    <div key={contact.id} className="rounded-md border border-border p-4">
                      <FieldTitle>联系人 {index + 1}</FieldTitle>
                      <FieldGroup className="mt-space-md">
                        <TextField
                          name={`contacts[${index}].name`}
                          label="姓名"
                          required
                          validators={{ onChange: ({ value }) => String(value).trim() ? undefined : '请输入联系人姓名' }}
                        />
                        <TextField
                          name={`contacts[${index}].email`}
                          label="邮箱"
                          required
                          type="email"
                          validators={{ onChange: ({ value }) => /^\S+@\S+\.\S+$/.test(String(value)) ? undefined : '邮箱格式不正确' }}
                        />
                        <Field name={`contacts[${index}].notifications`}>
                          {(field) => (
                            <FieldRoot orientation="horizontal">
                              <FieldControl>
                                {({ props }) => <Checkbox {...props} checked={field.state.value as boolean} onCheckedChange={(checked) => field.handleChange(checked === true)} />}
                              </FieldControl>
                              <FieldContent>
                                <FieldLabel>接收通知</FieldLabel>
                                <FieldDescription>嵌套布尔字段。</FieldDescription>
                              </FieldContent>
                            </FieldRoot>
                          )}
                        </Field>
                      </FieldGroup>
                      <div className="mt-space-md flex gap-space-sm">
                        <Button type="button" variant="outline" onClick={() => void contactsField.insertValue(index + 1, createContact())}>在后面插入</Button>
                        <Button type="button" variant="outline" disabled={(contactsField.state.value as Contact[]).length === 1} onClick={() => void contactsField.removeValue(index)}>删除</Button>
                      </div>
                    </div>
                  ))}
                </FieldGroup>
              </FieldSet>
              <Button className="w-fit" type="button" variant="outline" onClick={() => contactsField.pushValue(createContact())}>新增联系人</Button>
            </>
          )}
        </Field>
        <Button className="w-fit" type="submit">校验并保存联系人</Button>
      </Form>
    </Card>
  )
}
