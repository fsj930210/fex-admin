import {
  SelectContent,
  SelectList,
  SelectRoot,
  SelectTrigger,
} from '@fex/components-react/primitive/select'
import { frameworkOptions } from './data'
import { SelectDemoSection } from './demo-section'

export function ClearDemo() {
  return (
    <SelectDemoSection
      title="Clear"
      description="Clear and the dropdown indicator share one suffix position and never render together."
    >
      <SelectRoot clearable options={frameworkOptions} defaultValue="solid">
        <SelectTrigger placeholder="请选择框架" />
        <SelectContent>
          <SelectList />
        </SelectContent>
      </SelectRoot>
    </SelectDemoSection>
  )
}
