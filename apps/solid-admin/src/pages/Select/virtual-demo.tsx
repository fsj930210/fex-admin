import { SelectContent, SelectRoot, SelectTrigger } from '@fex/components-solid/primitive/select'
import { virtualOptions } from './data'
import { SelectDemoSection as Demo } from './demo-section'
export function VirtualDemo() {
  return (
    <Demo
      title="Virtual scrolling"
      description="Only visible fixed-height options and overscan are mounted from 1,000 entries."
    >
      <SelectRoot showSearch options={virtualOptions} virtual={{ itemHeight: 32, overscan: 4 }}>
        <SelectTrigger placeholder="请输入关键词或选择选项" />
        <SelectContent class="[--select-content-max-height:256px]" />
      </SelectRoot>
    </Demo>
  )
}
