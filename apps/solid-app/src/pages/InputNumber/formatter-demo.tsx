import { InputNumber } from '@fex-design/solid/primitive/input-number'
import Card from '@fex-design/solid/ui/card'
export function FormatterDemo() {
  return (
    <Card title="Parser and formatter" description="Blur restores currency presentation.">
      <InputNumber
        class="max-w-sm"
        defaultValue={1234.5}
        parser={(text) => {
          const value = Number(text.replace(/[￥,\s]/g, ''))
          return Number.isFinite(value) ? value : undefined
        }}
        formatter={(value, info) =>
          info.userTyping
            ? info.input
            : value === undefined
              ? ''
              : `￥${new Intl.NumberFormat('zh-CN').format(value)}`
        }
      />
    </Card>
  )
}
