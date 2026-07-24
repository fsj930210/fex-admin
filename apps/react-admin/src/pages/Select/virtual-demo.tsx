import {
  SelectContent,
  SelectList,
  SelectRoot,
  SelectTrigger,
} from '@fex/components-react/primitive/select'
import { virtualOptions } from './data'
import { SelectDemoSection } from './demo-section'

export function VirtualDemo() {
  return (
    <SelectDemoSection
      title="Virtual scrolling"
      description="Only the visible fixed-height options and overscan are mounted from 1,000 entries."
    >
      <SelectRoot showSearch options={virtualOptions} virtual={{ itemHeight: 32, overscan: 4 }}>
        <SelectTrigger placeholder="请输入关键词或选择选项" />
        <SelectContent className="[--select-content-max-height:256px]">
          <SelectList />
        </SelectContent>
      </SelectRoot>
    </SelectDemoSection>
  )
}
