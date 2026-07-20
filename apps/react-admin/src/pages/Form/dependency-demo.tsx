import { Field, FieldContent, FieldControl, FieldDescription, FieldLabel, FieldRoot } from '@fex/components-react/primitive/field'
import { Form, useForm } from '@fex/components-react/primitive/form'
import { InputControl, InputRoot } from '@fex/components-react/primitive/input'
import { Button } from '@fex/components-react/ui/button'
import { Card } from '@fex/components-react/ui/card'
import { Checkbox } from '@fex/components-react/ui/checkbox'
import { locations, selectClassName, type SetDemoResult } from './shared'

export function DependencyDemo({ setResult }: { setResult: SetDemoResult }) {
  const dynamicRuleForm = useForm({
    defaultValues: { nicknameRequired: true, nickname: '' },
    onSubmit: ({ value }) => setResult(`动态规则：${JSON.stringify(value)}`),
  })
  const cascadeForm = useForm({
    defaultValues: { province: '浙江' as keyof typeof locations, city: '杭州' },
    onSubmit: ({ value }) => setResult(`级联：${JSON.stringify(value)}`),
  })

  return (
    <Card title="Dynamic validation and cascading updates" description="业务联动在用户事件中完成；校验依赖使用 TanStack validators.onChangeListenTo。">
      <div className="grid gap-space-xl lg:grid-cols-2">
        <Form form={dynamicRuleForm} className="grid gap-space-lg">
          <Field name="nicknameRequired">
            {(field) => (
              <FieldRoot orientation="horizontal">
                <FieldControl>
                  {({ props }) => <Checkbox {...props} checked={field.state.value as boolean} onCheckedChange={(checked) => field.handleChange(checked === true)} />}
                </FieldControl>
                <FieldContent>
                  <FieldLabel>昵称必填</FieldLabel>
                  <FieldDescription>开关改变后，昵称字段的 onChange 校验会自动重跑。</FieldDescription>
                </FieldContent>
              </FieldRoot>
            )}
          </Field>
          <Field
            name="nickname"
            validators={{
              onChange: ({ value }) => dynamicRuleForm.getFieldValue('nicknameRequired') && !String(value).trim() ? '请输入昵称' : undefined,
              onChangeListenTo: ['nicknameRequired'],
            }}
          >
            {(field) => {
              const required = dynamicRuleForm.getFieldValue('nicknameRequired')
              const invalid = field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <FieldRoot required={required} invalid={invalid} hasError={invalid}>
                  <FieldLabel>昵称</FieldLabel>
                  <FieldControl>
                    {({ props }) => <InputRoot value={field.state.value as string} onValueChange={field.handleChange} invalid={invalid}><InputControl {...props} onBlur={field.handleBlur} /></InputRoot>}
                  </FieldControl>
                </FieldRoot>
              )
            }}
          </Field>
          <Button className="w-fit" type="submit">检查规则</Button>
        </Form>

        <Form form={cascadeForm} className="grid gap-space-lg">
          <Field name="province">
            {(field) => (
              <FieldRoot>
                <FieldLabel>省份</FieldLabel>
                <FieldControl>
                  {({ props }) => (
                    <select
                      {...props}
                      className={selectClassName}
                      value={field.state.value as string}
                      onChange={(event) => {
                        const province = event.target.value as keyof typeof locations
                        field.handleChange(province)
                        cascadeForm.setFieldValue('city', locations[province][0])
                      }}
                    >
                      {Object.keys(locations).map((province) => <option key={province} value={province}>{province}</option>)}
                    </select>
                  )}
                </FieldControl>
              </FieldRoot>
            )}
          </Field>
          <cascadeForm.Subscribe selector={(state) => state.values.province}>
            {(province) => (
              <Field name="city">
                {() => (
                  <FieldRoot hasDescription>
                    <FieldLabel>城市</FieldLabel>
                    <FieldControl>
                      {({ props }) => <select {...props} className={selectClassName} value={cascadeForm.getFieldValue('city')} onChange={(event) => cascadeForm.setFieldValue('city', event.target.value)}>{locations[province].map((city) => <option key={city}>{city}</option>)}</select>}
                    </FieldControl>
                    <FieldDescription>省份 change 事件中同步重设城市。</FieldDescription>
                  </FieldRoot>
                )}
              </Field>
            )}
          </cascadeForm.Subscribe>
          <Button className="w-fit" type="submit">保存地区</Button>
        </Form>
      </div>
    </Card>
  )
}
