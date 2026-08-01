import {
  AutoCompleteContent,
  AutoCompleteRoot,
  AutoCompleteTrigger,
} from '@fex/components-solid/primitive/auto-complete'
import Card from '@fex/components-solid/ui/card'
import { createSignal } from 'solid-js'
import { fieldNames, users } from './data'

export function ControlledDemo() {
  const [value, setValue] = createSignal('A')
  const [open, setOpen] = createSignal(false)
  return (
    <Card
      title="Controlled value and panel"
      description="Both public states are controlled; active suggestion stays internal."
    >
      <AutoCompleteRoot
        items={users}
        fieldNames={fieldNames}
        value={value()}
        open={open()}
        onChange={setValue}
        onOpenChange={setOpen}
      >
        <AutoCompleteTrigger placeholder="Controlled input" clearable />
        <AutoCompleteContent />
      </AutoCompleteRoot>
      <p class="mt-space-sm text-xs text-muted-foreground">
        value: {value() || '(empty)'} · open: {String(open())}
      </p>
    </Card>
  )
}
