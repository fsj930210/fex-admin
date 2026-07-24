import {
  SelectContent,
  SelectList,
  SelectRoot,
  SelectTrigger,
} from '@fex/components-react/primitive/select'
import { frameworkOptions } from './data'
import { SelectDemoSection } from './demo-section'

export function CustomRenderDemo() {
  return (
    <SelectDemoSection
      title="Custom option rendering"
      description="optionRender replaces option content while selection and keyboard behavior remain intact."
    >
      <SelectRoot options={frameworkOptions}>
        <SelectTrigger placeholder="请选择技术" />
        <SelectContent>
          <SelectList
            optionRender={(option) => (
              <div className="flex items-center justify-between gap-3">
                <span>{option.label}</span>
                <span className="text-xs text-muted-foreground">{option.group}</span>
              </div>
            )}
          />
        </SelectContent>
      </SelectRoot>
    </SelectDemoSection>
  )
}
