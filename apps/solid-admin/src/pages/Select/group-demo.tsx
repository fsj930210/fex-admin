import { SelectContent, SelectRoot, SelectTrigger } from '@fex/components-solid/primitive/select'
import { frameworkOptions } from './data'
import { SelectDemoSection as Demo } from './demo-section'
export function GroupDemo() {
  return (
    <Demo title="Group" description="Options sharing a group render below a stable group label.">
      <SelectRoot options={frameworkOptions}>
        <SelectTrigger placeholder="请选择" />
        <SelectContent />
      </SelectRoot>
    </Demo>
  )
}
