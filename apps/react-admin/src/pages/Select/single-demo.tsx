import {
  SelectContent,
  SelectList,
  SelectRoot,
  SelectTrigger,
} from '@fex/components-react/primitive/select'
import { frameworkOptions } from './data'
import { SelectDemoSection } from './demo-section'

export function SingleDemo() {
  return (
    <SelectDemoSection
      title="Single"
      description="Single selection closes the panel after choosing an option."
    >
      <SelectRoot options={frameworkOptions} defaultValue="react">
        <SelectTrigger placeholder="请选择框架" />
        <SelectContent>
          <SelectList />
        </SelectContent>
      </SelectRoot>
    </SelectDemoSection>
  )
}
