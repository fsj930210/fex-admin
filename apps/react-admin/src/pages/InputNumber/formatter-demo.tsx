import { InputNumber } from '@fex-design/react/primitive/input-number'
import { Card } from '@fex-design/react/ui/card'

export function FormatterDemo() {
  return (
    <Card
      title="Parser and formatter"
      description="Typing keeps the raw draft; blur restores the currency presentation."
    >
      <InputNumber
        className="max-w-sm"
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
              : `￥${new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 2 }).format(value)}`
        }
        aria-label="Currency"
      />
    </Card>
  )
}
