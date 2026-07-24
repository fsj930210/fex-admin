import {
  SelectContent,
  SelectList,
  SelectRoot,
  SelectTrigger,
} from '@fex/components-react/primitive/select'
import { frameworkOptions } from './data'
import { SelectDemoSection } from './demo-section'

export function GroupDemo() {
  return (
    <SelectDemoSection
      title="Group"
      description="Options with the same group are rendered under one accessible group label."
    >
      <SelectRoot options={frameworkOptions}>
        <SelectTrigger placeholder="请选择技术" />
        <SelectContent>
          <SelectList />
        </SelectContent>
      </SelectRoot>
    </SelectDemoSection>
  )
}
