import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { AutoCompleteContent, AutoCompleteList, AutoCompleteRoot, AutoCompleteTrigger } from '@fex/components-angular/primitive/auto-complete'
import Card from '@fex/components-angular/ui/card'
import { fieldNames, users } from './data'

@Component({
  selector: 'fex-auto-complete-basic-demo',
  standalone: true,
  imports: [Card, AutoCompleteRoot, AutoCompleteTrigger, AutoCompleteContent, AutoCompleteList],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './basic-demo.component.html',
})
export class BasicDemo {
  protected readonly users = users
  protected readonly fieldNames = fieldNames
  protected readonly selected = signal('No suggestion accepted')
  protected accept(event: { meta: { selectedItem: Record<string, unknown> } }) {
    this.selected.set(`${event.meta.selectedItem['name']} · ${event.meta.selectedItem['email']}`)
  }
}
