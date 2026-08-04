import {
  AutoCompleteContent,
  AutoCompleteRoot,
  AutoCompleteTrigger,
} from '@fex-design/react/primitive/auto-complete'
import { Card } from '@fex-design/react/ui/card'
import { useState } from 'react'
import { fieldNames, userSuggestions } from './data'

export function ControlledDemo() {
  const [value, setValue] = useState('A')
  const [open, setOpen] = useState(false)
  return (
    <Card
      title="Controlled value and panel"
      description="Both public states are controlled; active suggestion stays internal."
    >
      <AutoCompleteRoot
        items={userSuggestions}
        fieldNames={fieldNames}
        value={value}
        open={open}
        onChange={setValue}
        onOpenChange={setOpen}
      >
        <AutoCompleteTrigger placeholder="Controlled input" clearable />
        <AutoCompleteContent />
      </AutoCompleteRoot>
      <p className="mt-space-sm text-xs text-muted-foreground">
        value: {value || '(empty)'} · open: {String(open)}
      </p>
    </Card>
  )
}
