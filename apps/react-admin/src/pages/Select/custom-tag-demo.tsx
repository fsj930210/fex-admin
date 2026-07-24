import {
  SelectContent,
  SelectList,
  SelectRoot,
  SelectTrigger,
} from '@fex/components-react/primitive/select'
import { CloseIcon } from '@fex/components-react/icon/close'
import { frameworkOptions } from './data'
import { SelectDemoSection } from './demo-section'

const tagColors: Record<string, string> = {
  react: 'bg-sky-100 text-sky-700',
  vue: 'bg-emerald-100 text-emerald-700',
  angular: 'bg-red-100 text-red-700',
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
            <span
              className={`inline-flex h-6 items-center gap-1 rounded-md px-2 text-xs ${tagColors[String(option.value)] ?? 'bg-muted-background'}`}
            >
              {option.label}
              <button
                type="button"
                aria-label={`Remove ${option.label}`}
                onPointerDown={(event) => event.preventDefault()}
                onClick={(event) => {
                  event.stopPropagation()
                  context.remove()
                }}
              >
                <CloseIcon className="size-3" />
              </button>
            </span>
          )}
        />
        <SelectContent>
          <SelectList />
        </SelectContent>
      </SelectRoot>
    </SelectDemoSection>
  )
}
