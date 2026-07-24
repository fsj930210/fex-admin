import { SelectContent, SelectRoot, SelectTrigger } from '@fex/components-solid/primitive/select'
import { frameworkOptions } from './data'
import { SelectDemoSection as Demo } from './demo-section'
export function SingleDemo() {
  return (
    <Demo title="Single" description="Single selection closes the panel after choosing an option.">
      <SelectRoot options={frameworkOptions} defaultValue="react">
        <SelectTrigger placeholder="请选择" />
        <SelectContent />
      </SelectRoot>
    </Demo>
  )
}
