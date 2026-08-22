import {
  AutoCompleteContent,
  AutoCompleteRoot,
  AutoCompleteTrigger,
} from '@fex-design/solid/primitive/auto-complete'
import Card from '@fex-design/solid/ui/card'
import { createSignal } from 'solid-js'
import { fieldNames, users } from './data'

export function BasicDemo() {
  const [selected, setSelected] = createSignal('No suggestion accepted')
  return (
    <Card
      title="Free input and local suggestions"
      description="Type any text, or accept a matching name with pointer or keyboard."
    >
      <AutoCompleteRoot
        items={users}
        fieldNames={fieldNames}
        onSelect={(_, meta) =>
          setSelected(`${meta.selectedItem.name} · ${meta.selectedItem.email}`)
        }
      >
        <AutoCompleteTrigger placeholder="Try A or Bella" clearable />
        <AutoCompleteContent />
      </AutoCompleteRoot>
      <p class="mt-space-sm text-xs text-muted-foreground">{selected()}</p>
    </Card>
  )
}
