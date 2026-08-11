import {
  SelectContent,
  SelectList,
  SelectRoot,
  SelectTrigger,
} from '@fex-design/react/primitive/select'
import { Tag } from '@fex-design/react/primitive/tag'
import { frameworkOptions } from './data'
import { SelectDemoSection } from './demo-section'

const tagColors: Record<string, string> = {
  react: '#0284c7', vue: '#059669', angular: '#dc2626',
}

export function CustomTagDemo() {
  return (
    <SelectDemoSection
      title="Custom selected tags"
      description="tagRender controls each selected value while remove keeps the shared selection behavior."
    >
      <SelectRoot multiple options={frameworkOptions} defaultValue={['react', 'vue', 'angular']}>
        <SelectTrigger
          placeholder="请选择框架"
          tagRender={(option, context) => (
            <Tag size="sm" closable color={tagColors[String(option.value)] ?? 'neutral'} onPointerDownCapture={(event) => event.preventDefault()} onClose={(event) => { event.stopPropagation(); context.remove() }}>
              {option.label}
            </Tag>
          )}
        />
        <SelectContent>
          <SelectList />
        </SelectContent>
      </SelectRoot>
    </SelectDemoSection>
  )
}
