import {
  SelectContent,
  SelectEmpty,
  SelectRoot,
  SelectTrigger,
} from '@fex/components-solid/primitive/select'
import { SelectDemoSection as Demo } from './demo-section'
export function EmptyDemo() {
  return (
    <Demo
      title="Empty"
      description="An explicit empty state is rendered when there are no options."
    >
      <SelectRoot options={[]}>
        <SelectTrigger placeholder="请选择" />
        <SelectContent>
          <SelectEmpty />
        </SelectContent>
      </SelectRoot>
    </Demo>
  )
}
