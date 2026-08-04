import {
  AutoCompleteContent,
  AutoCompleteRoot,
  AutoCompleteTrigger,
} from '@fex-design/react/primitive/auto-complete'
import { Card } from '@fex-design/react/ui/card'
import { useState } from 'react'
import { fieldNames, userSuggestions } from './data'

export function BasicDemo() {
  const [selected, setSelected] = useState('No suggestion accepted')
  return (
    <Card
      title="Free input and local suggestions"
      description="Type any text, or accept a matching name with pointer or keyboard."
    >
      <AutoCompleteRoot
        items={userSuggestions}
        fieldNames={fieldNames}
        onSelect={(_, meta) =>
          setSelected(`${meta.selectedItem.name} · ${meta.selectedItem.email}`)
        }
      >
        <AutoCompleteTrigger placeholder="Try A or Bella" clearable />
        <AutoCompleteContent />
      </AutoCompleteRoot>
      <p className="mt-space-sm text-xs text-muted-foreground">{selected}</p>
    </Card>
  )
}
