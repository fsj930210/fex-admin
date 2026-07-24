import type { SelectOption } from '@fex/components-core/select/types'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  SelectContent,
  SelectList,
  SelectRoot,
  SelectTrigger,
} from '@fex/components-angular/primitive/select'
import Card from '@fex/components-angular/ui/card'
export
@Component({
  selector: 'fex-select-change-meta-demo',
  standalone: true,
  imports: [Card, SelectRoot, SelectTrigger, SelectContent, SelectList],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './change-meta-demo.component.html',
})
class ChangeMetaDemo {
  protected readonly options: SelectOption[] = [
    { value: 'u-101', label: 'Ada Lovelace', data: { id: 101, department: 'Research' } },
    { value: 'u-102', label: 'Grace Hopper', data: { id: 102, department: 'Platform' } },
  ]
  protected result = '请选择用户'
  protected update(event: { value: unknown; meta: unknown }) {
    this.result = JSON.stringify(event, null, 2)
  }
}
