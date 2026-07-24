import {
  SelectContent,
  SelectList,
  SelectRoot,
  SelectTrigger,
} from '@fex/components-react/primitive/select'
import { frameworkOptions } from './data'
import { SelectDemoSection } from './demo-section'

export function MaxCountDemo() {
  return (
    <SelectDemoSection
      title="Maximum selection count"
      description="maxCount limits actual selection; maxTagCount only controls presentation."
    >
      <SelectRoot multiple maxCount={2} options={frameworkOptions} defaultValue={['react']}>
        <SelectTrigger maxTagCount={2} placeholder="最多选择两项" />
        <SelectContent>
          <SelectList />
        </SelectContent>
      </SelectRoot>
    </SelectDemoSection>
  )
}
