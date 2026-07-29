import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { getRangePanelViewDates } from '@fex/components-core/date-picker/panel'
import { datePickerPanelsClassName } from '@fex/components-styles/date-picker'
import { RangePickerPanel } from './date-picker-panel'
import { RangePickerState } from './use-range-picker'

@Component({
  selector: 'fex-range-picker-panel-group',
  standalone: true,
  imports: [RangePickerPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'range-picker-panel-group',
    '[class]': 'className',
    '(mouseleave)': 'state.setHoverValue(null)',
  },
  templateUrl: './range-picker-panel-group.html',
})
export class RangePickerPanelGroup {
  @Input() panelCount: 1 | 2 = 2
  protected readonly className = datePickerPanelsClassName

  constructor(readonly state: RangePickerState) {}

  viewDates() {
    const context = this.state.context()
    const viewDates = getRangePanelViewDates(context.viewDate, context.panel)
    return this.panelCount === 2 ? viewDates : [viewDates[0]]
  }
}
