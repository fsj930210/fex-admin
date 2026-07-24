import { CloseIcon } from '@fex/components-solid/icon/close'
import { SelectContent, SelectRoot, SelectTrigger } from '@fex/components-solid/primitive/select'
import { frameworkOptions } from './data'
import { SelectDemoSection as Demo } from './demo-section'
const colors: Record<string, string> = {
  react: 'bg-sky-100 text-sky-700',
  vue: 'bg-emerald-100 text-emerald-700',
  angular: 'bg-red-100 text-red-700',
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
            <span
              class={`inline-flex h-6 items-center gap-1 rounded-md px-2 text-xs ${colors[String(option.value)] ?? 'bg-muted-background'}`}
            >
              {option.label}
              <button
                type="button"
                class="inline-flex size-4 items-center justify-center"
                onPointerDown={(event) => event.preventDefault()}
                onClick={remove}
              >
                <CloseIcon class="size-3" />
              </button>
            </span>
          )}
          placeholder="请选择"
        />
        <SelectContent />
      </SelectRoot>
    </Demo>
  )
}
