import { InputNumber } from '@fex-design/solid/primitive/input-number'
import Card from '@fex-design/solid/ui/card'
import { createSignal } from 'solid-js'
export function KeyboardDemo() {
  const [message, setMessage] = createSignal('Use ArrowUp, ArrowDown or buttons.')
  return (
    <Card title="Keyboard and events" description="Native event stays first.">
      <InputNumber
        clearable
        defaultValue={5}
        onChange={(event, value) => setMessage(`${event.type}: ${value ?? 'empty'}`)}
      />
      <p class="text-sm text-muted-foreground">{message()}</p>
    </Card>
  )
}
