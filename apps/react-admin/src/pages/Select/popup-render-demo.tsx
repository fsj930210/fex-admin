import type { SelectOption } from '@fex/components-core/select/types'
import { InputControl, InputRoot } from '@fex/components-react/primitive/input'
import { SelectContent, SelectRoot, SelectTrigger } from '@fex/components-react/primitive/select'
import { Button } from '@fex/components-react/ui/button'
import { PlusIcon } from '@fex/components-react/icon/plus'
import { useState } from 'react'
import { SelectDemoSection } from './demo-section'

const initialOptions: SelectOption[] = [
  { value: 'jack', label: 'Jack' },
  { value: 'lucy', label: 'Lucy' },
]

export function PopupRenderDemo() {
  const [options, setOptions] = useState<readonly SelectOption[]>(initialOptions)
  const [name, setName] = useState('')
  const addItem = () => {
    const label = name.trim()
    if (!label || options.some((option) => option.value === label.toLocaleLowerCase())) return
    setOptions((current) => [...current, { value: label.toLocaleLowerCase(), label }])
    setName('')
  }
  return (
    <SelectDemoSection
      title="Custom popup rendering"
      description="popupRender wraps the default menu with interactive custom content."
    >
      <SelectRoot options={options}>
        <SelectTrigger placeholder="自定义下拉面板" />
        <SelectContent
          popupRender={(menu) => (
            <div>
              {menu}
              <div
                className="flex items-center gap-2 border-t border-border p-2"
                onPointerDown={(event) => event.stopPropagation()}
              >
                <InputRoot value={name} onValueChange={setName} className="flex-1">
                  <InputControl placeholder="请输入新选项" />
                </InputRoot>
                <Button size="sm" variant="ghost" icon={<PlusIcon />} onClick={addItem}>
                  添加
                </Button>
              </div>
            </div>
          )}
        />
      </SelectRoot>
    </SelectDemoSection>
  )
}
