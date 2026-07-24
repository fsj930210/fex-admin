import { defaultSelectFilterOption } from '@fex/components-core/select/filter-options'
import {
  SelectContent,
  SelectList,
  SelectRoot,
  SelectTrigger,
} from '@fex/components-react/primitive/select'
import { frameworkOptions } from './data'
import { SelectDemoSection } from './demo-section'

export function TagsDemo() {
  return (
    <SelectDemoSection
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
        <SelectContent>
          <SelectList />
        </SelectContent>
      </SelectRoot>
    </SelectDemoSection>
  )
}
