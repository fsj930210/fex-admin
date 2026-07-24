import { SelectContent, SelectRoot, SelectTrigger } from '@fex/components-solid/primitive/select'
import { frameworkOptions } from './data'
import { SelectDemoSection as Demo } from './demo-section'
export function CustomSearchDemo() {
  return (
    <Demo title="Custom search" description="A custom filterOption matches labels by prefix only.">
      <SelectRoot
        showSearch
        options={frameworkOptions}
        filterOption={(keyword, option) =>
          option.label.toLocaleLowerCase().startsWith(keyword.trim().toLocaleLowerCase())
        }
      >
        <SelectTrigger placeholder="按名称前缀搜索" />
        <SelectContent />
      </SelectRoot>
    </Demo>
  )
}
