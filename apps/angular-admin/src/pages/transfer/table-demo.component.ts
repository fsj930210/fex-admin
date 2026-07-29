import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Transfer, TransferPanelTemplate } from '@fex/components-angular/primitive/transfer'
import Card from '@fex/components-angular/ui/card'
import { transferFieldNames, transferMembers } from './data'
import { TransferTablePanelComponent } from './table-panel.component'

@Component({
  selector: 'fex-transfer-table-demo',
  standalone: true,
  imports: [Card, Transfer, TransferPanelTemplate, TransferTablePanelComponent],
  templateUrl: './table-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransferTableDemoComponent {
  protected readonly members = transferMembers
  protected readonly fieldNames = transferFieldNames
}
