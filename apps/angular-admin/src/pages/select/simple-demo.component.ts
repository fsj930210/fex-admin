import type {
  SelectFilterOption,
  SelectMode,
  SelectOption,
  SelectVirtualOptions,
} from '@fex/components-core/select/types'
import type { SelectionValue } from '@fex/components-core/selection/types'
import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import {
  SelectContent,
  SelectList,
  SelectRoot,
  SelectTrigger,
} from '@fex/components-angular/primitive/select'
import Card from '@fex/components-angular/ui/card'
export
@Component({
  selector: 'fex-select-simple-demo',
  standalone: true,
  imports: [Card, SelectRoot, SelectTrigger, SelectContent, SelectList],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './simple-demo.component.html',
})
class SimpleSelectDemo {
  @Input({ required: true }) title = ''
  @Input({ required: true }) description = ''
  @Input() options: readonly SelectOption[] = []
  @Input() mode?: SelectMode
  @Input() multiple = false
  @Input() clearable = false
  @Input() showSearch = false
  @Input() defaultValue?: SelectionValue | SelectionValue[]
  @Input() filterOption?: SelectFilterOption
  @Input() maxCount?: number
  @Input() maxTagCount?: number
  @Input() virtual?: SelectVirtualOptions
  @Input() placeholder = '请选择'
}
