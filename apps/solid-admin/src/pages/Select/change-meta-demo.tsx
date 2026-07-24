import type { SelectOption } from '@fex/components-core/select/types'
import { SelectContent, SelectRoot, SelectTrigger } from '@fex/components-solid/primitive/select'
import { createSignal } from 'solid-js'
import { SelectDemoSection as Demo } from './demo-section'
const options: SelectOption[] = [
  { value: 'u-101', label: 'Ada Lovelace', data: { id: 101, department: 'Research' } },
  { value: 'u-102', label: 'Grace Hopper', data: { id: 102, department: 'Platform' } },
]
export function ChangeMetaDemo() {
  const [result, setResult] = createSignal('请选择用户')
  return (
    <Demo
      title="Change metadata"
      description="onChange returns value plus the complete selected option for backend fields."
    >
      <div class="space-y-space-md">
        <SelectRoot
          options={options}
          onChange={(value, meta) =>
            setResult(JSON.stringify({ value, selectedItem: meta.selectedItem }, null, 2))
          }
        >
          <SelectTrigger placeholder="请选择用户" />
          <SelectContent />
        </SelectRoot>
        <pre class="overflow-auto rounded-md bg-muted-background p-3 text-xs">{result()}</pre>
      </div>
    </Demo>
  )
}
