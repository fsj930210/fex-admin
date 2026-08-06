import {
  TextareaClear,
  TextareaFooter,
  TextareaInput,
  TextareaRoot,
} from '@fex-design/react/primitive/textarea'
import { Button } from '@fex-design/react/ui/button'
import { Card } from '@fex-design/react/ui/card'
import { CheckIcon } from '@fex-design/react/icon/check'
import { InfoIcon } from '@fex-design/react/icon/info'
import { PlusIcon } from '@fex-design/react/icon/plus'
import { useState } from 'react'

export function FooterDemo() {
  const [value, setValue] = useState('')

  return (
    <Card title="Footer" description="Footer is only a layout slot; actions are fully owned by the caller.">
      <TextareaRoot
        value={value}
        onChange={setValue}
        autoSize={{ minRows: 1, maxRows: 8 }}
        className="max-w-2xl"
      >
        <TextareaInput aria-label="AI message" placeholder="Ask anything" />
        <TextareaClear aria-label="Clear message" />
        <TextareaFooter>
          <div className="flex min-w-0 flex-wrap items-center gap-1">
            <Button aria-label="Attach" icon={<PlusIcon />} size="icon-sm" variant="ghost" />
            <Button icon={<InfoIcon />} size="sm" variant="ghost">
              Context
            </Button>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span>{value.length} / 2000</span>
            <Button
              aria-label="Send"
              disabled={!value.trim()}
              icon={<CheckIcon />}
              size="icon-sm"
            />
          </div>
        </TextareaFooter>
      </TextareaRoot>
    </Card>
  )
}
