import { defaultSelectFilterOption } from '@fex-design/core/select/filter-options'
import { SelectContent, SelectRoot, SelectTrigger } from '@fex-design/solid/primitive/select'
import { frameworkOptions } from './data'
import { SelectDemoSection as Demo } from './demo-section'
export function LocalSearchDemo() {
  return (
    <Demo
      title="Local search"
      description="filterOption filters locally and onSearch still receives every keyword."
    >
      <SelectRoot showSearch filterOption={defaultSelectFilterOption} options={frameworkOptions}>
        <SelectTrigger placeholder="搜索选项" />
        <SelectContent />
      </SelectRoot>
    </Demo>
  )
}
