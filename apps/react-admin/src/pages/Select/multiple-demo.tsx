import {
  SelectContent,
  SelectList,
  SelectRoot,
  SelectTrigger,
} from '@fex/components-react/primitive/select'
import { frameworkOptions } from './data'
import { SelectDemoSection } from './demo-section'

export function MultipleDemo() {
  return (
    <SelectDemoSection
      title="Multiple"
      description="Multiple selection keeps the panel open and renders selected values together."
    >
      <SelectRoot multiple options={frameworkOptions} defaultValue={['react', 'vue']}>
        <SelectTrigger maxTagCount={3} placeholder="请选择框架" />
        <SelectContent>
          <SelectList />
        </SelectContent>
      </SelectRoot>
    </SelectDemoSection>
  )
}
