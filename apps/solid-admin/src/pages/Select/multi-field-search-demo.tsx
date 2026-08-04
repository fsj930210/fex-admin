import { defaultSelectFilterOption } from '@fex-design/core/select/filter-options'
import { SelectContent, SelectRoot, SelectTrigger } from '@fex-design/solid/primitive/select'
import { frameworkOptions } from './data'
import { SelectDemoSection as Demo } from './demo-section'
export function MultiFieldSearchDemo() {
  return (
    <Demo
      title="Multi-field search"
      description="Search label, searchText and keywords; try google or meta."
    >
      <SelectRoot showSearch filterOption={defaultSelectFilterOption} options={frameworkOptions}>
        <SelectTrigger placeholder="输入 google 或 meta" />
        <SelectContent />
      </SelectRoot>
    </Demo>
  )
}
