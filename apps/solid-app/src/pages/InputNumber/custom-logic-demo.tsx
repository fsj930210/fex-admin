import { stepInputNumber } from '@fex-design/core/input-number/value'
import { MinusIcon } from '@fex-design/solid/icon/minus'
import { PlusIcon } from '@fex-design/solid/icon/plus'
import Button from '@fex-design/solid/ui/button'
import Card from '@fex-design/solid/ui/card'
import { createSignal } from 'solid-js'
export function CustomLogicDemo() {
  const [value, setValue] = createSignal(5)
  const step = (direction: 'increment' | 'decrement') =>
    setValue(stepInputNumber(value(), direction, { min: 0, max: 10 }))
  return (
    <Card title="Custom primitive logic" description="Core rules drive custom DOM.">
      <div class="inline-flex items-center gap-space-md">
        <Button aria-label="Decrease value" onClick={() => step('decrement')}>
          <MinusIcon />
        </Button>
        <output>{value()}</output>
        <Button aria-label="Increase value" onClick={() => step('increment')}>
          <PlusIcon />
        </Button>
      </div>
    </Card>
  )
}
