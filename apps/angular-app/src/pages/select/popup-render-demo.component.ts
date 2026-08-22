import type { SelectOption } from '@fex-design/core/select/types'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { PlusIcon } from '@fex-design/angular/icon/plus'
import { InputControl, InputRoot } from '@fex-design/angular/primitive/input'
import {
  SelectContent,
  SelectList,
  SelectRoot,
  SelectTrigger,
} from '@fex-design/angular/primitive/select'
import { Button } from '@fex-design/angular/ui/button'
import Card from '@fex-design/angular/ui/card'
export
@Component({
  selector: 'fex-select-popup-render-demo',
  standalone: true,
  imports: [
    Card,
    PlusIcon,
    InputRoot,
    InputControl,
    Button,
    SelectRoot,
    SelectTrigger,
    SelectContent,
    SelectList,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './popup-render-demo.component.html',
})
class PopupRenderDemo {
  protected options: SelectOption[] = [
    { value: 'jack', label: 'Jack' },
    { value: 'lucy', label: 'Lucy' },
  ]
  protected name = ''
  protected add() {
    const label = this.name.trim()
    if (!label || this.options.some((item) => item.value === label.toLocaleLowerCase())) return
    this.options = [...this.options, { value: label.toLocaleLowerCase(), label }]
    this.name = ''
  }
}
