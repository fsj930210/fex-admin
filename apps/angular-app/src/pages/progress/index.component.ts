import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { CheckIcon } from '@fex-design/angular/icon/check'
import { MinusIcon } from '@fex-design/angular/icon/minus'
import { PlusIcon } from '@fex-design/angular/icon/plus'
import { Progress } from '@fex-design/angular/primitive/progress'
import { Button } from '@fex-design/angular/ui/button'
import Card from '@fex-design/angular/ui/card'
@Component({
  selector: 'fex-progress-page',
  standalone: true,
  imports: [Card, Progress, Button, CheckIcon, MinusIcon, PlusIcon],
  host: { class: 'block' },
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressComponent {
  protected readonly gradient = { from: '#1677ff', to: '#87d068', direction: 'to right' } as const
  protected readonly segmentGradient = {
    stops: {
      '0%': 'var(--success)',
      '49.999%': 'var(--success)',
      '50%': 'var(--info)',
      '100%': 'var(--info)',
    },
    direction: 'to right',
  } as const
  protected readonly stepLineDemos = [
    { value: 50, steps: 5, color: 'var(--info)' },
    { value: 30, steps: 5, color: 'var(--info)' },
    { value: 100, steps: 5, color: 'var(--success)', success: true },
    { value: 60, steps: 5, color: 'var(--success)' },
  ]
  protected readonly circleStepDemos = [
    { label: 'Custom count', value: 50, steps: 12, gap: 2, color: 'var(--info)' },
    { label: 'Custom gap', value: 100, steps: 8, gap: 5, color: 'var(--success)', success: true },
  ]
  protected readonly dynamicValue = signal(20)

  protected readonly getRange = (count: number) => Array.from({ length: count }, (_, index) => index)

  protected getActiveSteps(value: number, steps: number) {
    return Math.round((value / 100) * steps)
  }

  protected getStepDasharray(steps: number, gap: number) {
    const stepLength = 100 / steps
    const dash = Math.max(0, stepLength - gap)
    return `${dash} ${100 - dash}`
  }

  protected getStepDashoffset(index: number, steps: number) {
    return 50 - index * (100 / steps)
  }

  protected decrease() {
    this.dynamicValue.update((value) => Math.max(0, value - 10))
  }

  protected increase() {
    this.dynamicValue.update((value) => Math.min(100, value + 10))
  }
}
