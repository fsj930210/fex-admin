import type { SelectOption } from '@fex/components-core/select/types'
import { PlusIcon } from '@fex/components-solid/icon/plus'
import { InputControl, InputRoot } from '@fex/components-solid/primitive/input'
import {
  SelectContent,
  SelectList,
  SelectRoot,
  SelectTrigger,
} from '@fex/components-solid/primitive/select'
import { Button } from '@fex/components-solid/ui/button'
import { createSignal } from 'solid-js'
import { SelectDemoSection as Demo } from './demo-section'
export function PopupRenderDemo() {
  const [options, setOptions] = createSignal<SelectOption[]>([
    { value: 'jack', label: 'Jack' },
    { value: 'lucy', label: 'Lucy' },
  ])
  const [name, setName] = createSignal('')
  const add = () => {
    const label = name().trim()
    if (!label || options().some((item) => item.value === label.toLocaleLowerCase())) return
    setOptions((current) => [...current, { value: label.toLocaleLowerCase(), label }])
    setName('')
  }
  return (
    <Demo
      title="Custom popup rendering"
      description="popupRender wraps the default menu with interactive content."
    >
      <SelectRoot options={options()}>
        <SelectTrigger placeholder="自定义下拉面板" />
        <SelectContent
          popupRender={(menu) => (
            <div>
              {menu}
              <div
                class="flex items-center gap-2 border-t border-border p-2"
                onPointerDown={(event) => event.stopPropagation()}
              >
                <InputRoot value={name()} onValueChange={setName} class="flex-1">
                  <InputControl placeholder="请输入新选项" />
                </InputRoot>
                <Button size="sm" variant="ghost" icon={<PlusIcon />} onClick={add}>
                  添加
                </Button>
              </div>
            </div>
          )}
        />
      </SelectRoot>
    </Demo>
  )
}
