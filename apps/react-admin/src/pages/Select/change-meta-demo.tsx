import type { SelectOption } from '@fex/components-core/select/types'
import {
  SelectContent,
  SelectList,
  SelectRoot,
  SelectTrigger,
  type SelectChangeMeta,
} from '@fex/components-react/primitive/select'
import type { SelectionValue } from '@fex/components-core/selection/types'
import { useState } from 'react'
import { SelectDemoSection } from './demo-section'

const backendOptions: SelectOption[] = [
  { value: 'u-101', label: 'Ada Lovelace', data: { id: 101, department: 'Research' } },
  { value: 'u-102', label: 'Grace Hopper', data: { id: 102, department: 'Platform' } },
]

export function ChangeMetaDemo() {
  const [result, setResult] = useState('请选择用户')
  const handleChange = (
    value: SelectionValue | SelectionValue[] | undefined,
    meta: SelectChangeMeta,
  ) => {
    setResult(JSON.stringify({ value, selectedItem: meta.selectedItem }, null, 2))
  }
  return (
    <SelectDemoSection
      title="Change metadata"
      description="onChange returns value plus the complete selected option for backend fields."
    >
      <div className="space-y-space-md">
        <SelectRoot options={backendOptions} onChange={handleChange}>
          <SelectTrigger placeholder="请选择用户" />
          <SelectContent>
            <SelectList />
          </SelectContent>
        </SelectRoot>
        <pre className="overflow-auto rounded-md bg-muted-background p-3 text-xs">{result}</pre>
      </div>
    </SelectDemoSection>
  )
}
