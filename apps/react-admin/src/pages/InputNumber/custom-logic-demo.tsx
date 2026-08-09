import { useInputNumber } from '@fex-design/react/primitive/input-number/use-input-number'
import { MinusIcon } from '@fex-design/react/icon/minus'
import { PlusIcon } from '@fex-design/react/icon/plus'
import { Button } from '@fex-design/react/ui/button'
import { Card } from '@fex-design/react/ui/card'

export function CustomLogicDemo() {
  const number = useInputNumber({ defaultValue: 5, min: 0, max: 10 })
  return (
    <Card
      title="Custom primitive logic"
      description="The public hook can drive custom DOM without the default InputNumber presentation."
    >
      <div className="inline-flex items-center gap-space-md">
        <Button
          aria-label="Decrease value"
          disabled={!number.canDecrement}
          onClick={number.decrement}
        >
          <MinusIcon />
        </Button>
        <output className="min-w-10 text-center text-sm font-medium">{number.value}</output>
        <Button
          aria-label="Increase value"
          disabled={!number.canIncrement}
          onClick={number.increment}
        >
          <PlusIcon />
        </Button>
      </div>
    </Card>
  )
}
