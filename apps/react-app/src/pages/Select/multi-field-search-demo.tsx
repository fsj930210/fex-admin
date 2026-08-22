import { defaultSelectFilterOption } from '@fex-design/core/select/filter-options'
import {
  SelectContent,
  SelectList,
  SelectRoot,
  SelectTrigger,
} from '@fex-design/react/primitive/select'
import { frameworkOptions } from './data'
import { SelectDemoSection } from './demo-section'

export function MultiFieldSearchDemo() {
  return (
    <SelectDemoSection
      title="Multi-field search"
      description="Search label, searchText and keywords; try google or meta."
    >
      <SelectRoot showSearch options={frameworkOptions} filterOption={defaultSelectFilterOption}>
        <SelectTrigger placeholder="输入 google 或 meta" />
        <SelectContent>
          <SelectList />
        </SelectContent>
      </SelectRoot>
    </SelectDemoSection>
  )
}
