import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import {
  AutoCompleteContent,
  AutoCompleteList,
  AutoCompleteRoot,
  AutoCompleteTrigger,
} from '@fex-design/angular/primitive/auto-complete'
import Card from '@fex-design/angular/ui/card'
import { fieldNames, users } from './data'

@Component({
  selector: 'fex-auto-complete-controlled-demo',
  standalone: true,
  imports: [Card, AutoCompleteRoot, AutoCompleteTrigger, AutoCompleteContent, AutoCompleteList],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './controlled-demo.component.html',
})
export class ControlledDemo {
  protected readonly users = users
  protected readonly fieldNames = fieldNames
  protected readonly value = signal('A')
  protected readonly open = signal(false)
}
