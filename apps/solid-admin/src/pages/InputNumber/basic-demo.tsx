import { InputNumber } from '@fex-design/solid/primitive/input-number'
import Card from '@fex-design/solid/ui/card'
import { createSignal } from 'solid-js'
export function BasicDemo() {
  const [value, setValue] = createSignal<number>()
  return (
    <Card title="Basic" description="Controlled and uncontrolled numeric values use icon actions.">
      <div class="grid gap-space-lg md:grid-cols-2">
        <InputNumber defaultValue={3} aria-label="Uncontrolled number" />
        <div>
          <InputNumber
            value={value()}
            onChange={(_, next) => setValue(next)}
            aria-label="Controlled number"
          />
          <p class="text-sm text-muted-foreground">Value: {value() ?? 'empty'}</p>
        </div>
      </div>
    </Card>
  )
}
