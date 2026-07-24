import { ChangeDetectionStrategy, Component } from '@angular/core'
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
  selector: 'fex-select-custom-render-demo',
  standalone: true,
  imports: [Card, SelectRoot, SelectTrigger, SelectContent, SelectList],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './custom-render-demo.component.html',
})
class CustomRenderDemo {
  protected readonly options = frameworkOptions
}
