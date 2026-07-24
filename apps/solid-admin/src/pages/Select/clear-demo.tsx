import { SelectContent, SelectRoot, SelectTrigger } from '@fex/components-solid/primitive/select'
import { frameworkOptions } from './data'
import { SelectDemoSection as Demo } from './demo-section'
export function ClearDemo() {
  return (
    <Demo
      title="Clear"
      description="Clear and the dropdown indicator share one suffix position and never render together."
    >
      <SelectRoot clearable options={frameworkOptions} defaultValue="solid">
        <SelectTrigger placeholder="请选择" />
        <SelectContent />
      </SelectRoot>
    </Demo>
  )
}
