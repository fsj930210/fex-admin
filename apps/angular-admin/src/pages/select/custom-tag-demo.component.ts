import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CloseIcon } from '@fex/components-angular/icon/close'
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
  selector: 'fex-select-custom-tag-demo',
  standalone: true,
  imports: [Card, CloseIcon, SelectRoot, SelectTrigger, SelectContent, SelectList],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './custom-tag-demo.component.html',
})
class CustomTagDemo {
  protected readonly options = frameworkOptions
  protected readonly values = ['react', 'vue', 'angular']
  protected color(value: string) {
    return (
      {
        react: 'bg-sky-100 text-sky-700',
        vue: 'bg-emerald-100 text-emerald-700',
        angular: 'bg-red-100 text-red-700',
      }[value] ?? 'bg-muted-background'
    )
  }
}
