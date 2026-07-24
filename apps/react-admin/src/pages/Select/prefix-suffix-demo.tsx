import { InfoIcon } from '@fex/components-react/icon/info'
import { CheckIcon } from '@fex/components-react/icon/check'
import {
  SelectContent,
  SelectList,
  SelectRoot,
  SelectTrigger,
} from '@fex/components-react/primitive/select'
import { frameworkOptions } from './data'
import { SelectDemoSection } from './demo-section'

export function PrefixSuffixDemo() {
  return (
    <SelectDemoSection
      title="Prefix and suffix"
      description="prefix decorates the input; suffix replaces only the default dropdown chevron."
    >
      <div className="space-y-space-md">
        <SelectRoot options={frameworkOptions}>
          <SelectTrigger
            prefix={<InfoIcon className="size-4 text-muted-foreground" />}
            placeholder="带前缀"
          />
          <SelectContent>
            <SelectList />
          </SelectContent>
        </SelectRoot>
        <SelectRoot options={frameworkOptions}>
          <SelectTrigger suffix={<CheckIcon />} placeholder="自定义后缀" />
          <SelectContent>
            <SelectList />
          </SelectContent>
        </SelectRoot>
      </div>
    </SelectDemoSection>
  )
}
