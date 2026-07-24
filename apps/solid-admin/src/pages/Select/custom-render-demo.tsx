import {
  SelectContent,
  SelectList,
  SelectRoot,
  SelectTrigger,
} from '@fex/components-solid/primitive/select'
import { frameworkOptions } from './data'
import { SelectDemoSection as Demo } from './demo-section'
export function CustomRenderDemo() {
  return (
    <Demo
      title="Custom option rendering"
      description="optionRender replaces option content while shared behavior remains intact."
    >
      <SelectRoot options={frameworkOptions}>
        <SelectTrigger placeholder="请选择技术" />
        <SelectContent>
          <SelectList
            optionRender={(option) => (
              <div class="flex items-center justify-between gap-3">
                <span>{option.label}</span>
                <span class="text-xs text-muted-foreground">{option.group}</span>
              </div>
            )}
          />
        </SelectContent>
      </SelectRoot>
    </Demo>
  )
}
