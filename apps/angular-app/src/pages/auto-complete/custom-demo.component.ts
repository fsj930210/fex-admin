import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  AutoCompleteContent,
  AutoCompleteList,
  AutoCompleteRoot,
  AutoCompleteTrigger,
} from '@fex-design/angular/primitive/auto-complete'
import Card from '@fex-design/angular/ui/card'
import { fieldNames, users } from './data'

@Component({
  selector: 'fex-auto-complete-custom-demo',
  standalone: true,
  imports: [Card, AutoCompleteRoot, AutoCompleteTrigger, AutoCompleteContent, AutoCompleteList],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './custom-demo.component.html',
})
export class CustomDemo {
  protected readonly users = users
  protected readonly fieldNames = fieldNames
}
