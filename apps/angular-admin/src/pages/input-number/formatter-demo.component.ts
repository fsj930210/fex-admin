import type { InputNumberFormatInfo } from '@fex-design/core/input-number/types'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { InputNumber } from '@fex-design/angular/primitive/input-number'
import Card from '@fex-design/angular/ui/card'

@Component({
  selector: 'fex-input-number-formatter-demo',
  standalone: true,
  imports: [Card, InputNumber],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './formatter-demo.component.html',
})
export class FormatterDemoComponent {
  protected parser = (text: string) => {
    const value = Number(text.replace(/[¥,\s]/g, ''))
    return Number.isFinite(value) ? value : undefined
  }
  protected formatter = (value: number | undefined, info: InputNumberFormatInfo) =>
    info.userTyping
      ? info.input
      : value === undefined
        ? ''
        : `¥${new Intl.NumberFormat('zh-CN').format(value)}`
}
