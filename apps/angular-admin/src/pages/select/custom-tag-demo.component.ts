import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Tag } from '@fex-design/angular/primitive/tag'
import {
  SelectContent,
  SelectList,
  SelectRoot,
  SelectTrigger,
} from '@fex-design/angular/primitive/select'
import Card from '@fex-design/angular/ui/card'
import { frameworkOptions } from './data'
export
@Component({
  selector: 'fex-select-custom-tag-demo',
  standalone: true,
  imports: [Card, Tag, SelectRoot, SelectTrigger, SelectContent, SelectList],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './custom-tag-demo.component.html',
})
class CustomTagDemo {
  protected readonly options = frameworkOptions
  protected readonly values = ['react', 'vue', 'angular']
  protected color(value: string) {
    return (
      {
        react: '#0284c7', vue: '#059669', angular: '#dc2626',
      }[value] ?? 'neutral'
    )
  }
}
