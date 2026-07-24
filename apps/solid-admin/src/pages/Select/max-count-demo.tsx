import { SelectContent, SelectRoot, SelectTrigger } from '@fex/components-solid/primitive/select'
import { frameworkOptions } from './data'
import { SelectDemoSection as Demo } from './demo-section'
export function MaxCountDemo() {
  return (
    <Demo
      title="Maximum selection count"
      description="maxCount limits actual selection; maxTagCount only controls presentation."
    >
      <SelectRoot multiple maxCount={3} options={frameworkOptions} defaultValue={['react']}>
        <SelectTrigger maxTagCount={2} placeholder="最多选择三个" />
        <SelectContent />
      </SelectRoot>
    </Demo>
  )
}
