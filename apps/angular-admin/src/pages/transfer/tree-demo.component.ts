import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Transfer, TransferPanelTemplate } from '@fex/components-angular/primitive/transfer'
import Card from '@fex/components-angular/ui/card'
import { transferFieldNames, transferMembers } from './data'
import { TransferTreePanelComponent } from './tree-panel.component'

@Component({
  selector: 'fex-transfer-tree-demo',
  standalone: true,
  imports: [Card, Transfer, TransferPanelTemplate, TransferTreePanelComponent],
  templateUrl: './tree-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransferTreeDemoComponent {
  protected readonly members = transferMembers
  protected readonly fieldNames = transferFieldNames
}
