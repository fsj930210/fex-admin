import { Form, scrollToField, useForm } from '@fex/components-react/primitive/form'
import { Button } from '@fex/components-react/ui/button'
import { Card } from '@fex/components-react/ui/card'
import { TextField, type SetDemoResult } from './shared'

export function ScrollDemo({ setResult }: { setResult: SetDemoResult }) {
  const scrollForm = useForm({
    defaultValues: { note: '', deliveryAddress: '' },
    onSubmit: ({ value }) => setResult(`长表单：${JSON.stringify(value)}`),
  })

  return (
    <Card title="Scroll to a specific field" description="scrollToField 是独立方法，可以定位任意字段；Form 提交失败时才自动定位第一个无效 FieldControl。">
      <Form form={scrollForm} className="grid max-w-xl gap-space-lg">
        <div className="flex flex-wrap gap-space-sm">
          <Button type="button" variant="outline" onClick={() => void scrollToField(document, 'deliveryAddress', { behavior: 'smooth', block: 'center', focus: true })}>定位收货地址</Button>
          <Button type="submit">提交并定位首个错误</Button>
        </div>
        <TextField name="note" label="备注（选填）" />
        <div className="flex min-h-[24rem] items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">模拟长表单内容</div>
        <TextField name="deliveryAddress" label="收货地址" required placeholder="位于长表单底部" validators={{ onSubmit: ({ value }) => String(value).trim() ? undefined : '请输入收货地址' }} />
      </Form>
    </Card>
  )
}
