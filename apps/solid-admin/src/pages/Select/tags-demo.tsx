import { defaultSelectFilterOption } from '@fex/components-core/select/filter-options'
import { SelectContent, SelectRoot, SelectTrigger } from '@fex/components-solid/primitive/select'
import { frameworkOptions } from './data'
import { SelectDemoSection as Demo } from './demo-section'
export function TagsDemo() {
  return (
    <Demo
      title="Tags"
      description="Type a new value and press Enter, or choose an existing option."
    >
      <SelectRoot
        mode="tags"
        filterOption={defaultSelectFilterOption}
        options={frameworkOptions}
        defaultValue={['react']}
      >
        <SelectTrigger placeholder="请输入或选择标签" />
        <SelectContent />
      </SelectRoot>
    </Demo>
  )
}
