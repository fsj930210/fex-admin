import { Tag } from '@fex-design/solid/primitive/tag'
import { SelectContent, SelectRoot, SelectTrigger } from '@fex-design/solid/primitive/select'
import { frameworkOptions } from './data'
import { SelectDemoSection as Demo } from './demo-section'
const colors: Record<string, string> = {
  react: '#0284c7', vue: '#059669', angular: '#dc2626',
}
export function CustomTagDemo() {
  return (
    <Demo
      title="Custom selected tags"
      description="tagRender controls each selected value while remove keeps shared behavior."
    >
      <SelectRoot multiple options={frameworkOptions} defaultValue={['react', 'vue', 'angular']}>
        <SelectTrigger
          tagRender={(option, { remove }) => (
            <Tag size="sm" closable color={colors[String(option.value)] ?? 'neutral'} onPointerDownCapture={(event) => event.preventDefault()} onClose={(event) => { event.stopPropagation(); remove() }}>
              {option.label}
            </Tag>
          )}
          placeholder="请选择"
        />
        <SelectContent />
      </SelectRoot>
    </Demo>
  )
}
