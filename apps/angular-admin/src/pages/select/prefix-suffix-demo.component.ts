import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CheckIcon } from '@fex/components-angular/icon/check'
import { InfoIcon } from '@fex/components-angular/icon/info'
import {
  SelectContent,
  SelectList,
  SelectRoot,
  SelectTrigger,
} from '@fex/components-angular/primitive/select'
import Card from '@fex/components-angular/ui/card'
import { frameworkOptions } from './data'
export
@Component({
  selector: 'fex-select-prefix-suffix-demo',
  standalone: true,
  imports: [Card, InfoIcon, CheckIcon, SelectRoot, SelectTrigger, SelectContent, SelectList],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './prefix-suffix-demo.component.html',
})
class PrefixSuffixDemo {
  protected readonly options = frameworkOptions
}
