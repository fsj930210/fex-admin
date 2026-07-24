import { CheckIcon } from '@fex/components-solid/icon/check'
import { InfoIcon } from '@fex/components-solid/icon/info'
import { SelectContent, SelectRoot, SelectTrigger } from '@fex/components-solid/primitive/select'
import { frameworkOptions } from './data'
import { SelectDemoSection as Demo } from './demo-section'
export function PrefixSuffixDemo() {
  return (
    <Demo
      title="Prefix and suffix"
      description="prefix decorates the input; suffix replaces only the default chevron."
    >
      <div class="space-y-space-md">
        <SelectRoot options={frameworkOptions}>
          <SelectTrigger prefix={<InfoIcon class="size-4" />} placeholder="带前缀" />
          <SelectContent />
        </SelectRoot>
        <SelectRoot options={frameworkOptions}>
          <SelectTrigger suffix={<CheckIcon />} placeholder="自定义后缀" />
          <SelectContent />
        </SelectRoot>
      </div>
    </Demo>
  )
}
