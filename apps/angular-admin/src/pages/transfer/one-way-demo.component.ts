import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import {
  Transfer,
  TransferActionsTemplate,
  TransferPanelTemplate,
} from '@fex/components-angular/primitive/transfer'
import { ChevronRightIcon } from '@fex/components-angular/icon/chevron'
import { TrashIcon } from '@fex/components-angular/icon/trash'
import { SwitchRoot, SwitchThumb } from '@fex/components-angular/primitive/switch'
import { Button } from '@fex/components-angular/ui/button'
import Card from '@fex/components-angular/ui/card'
import { transferFieldNames, transferMembers } from './data'

@Component({
  selector: 'fex-transfer-one-way-demo',
  standalone: true,
  imports: [
    Card,
    Transfer,
    TransferActionsTemplate,
    TransferPanelTemplate,
    Button,
    ChevronRightIcon,
    TrashIcon,
    SwitchRoot,
    SwitchThumb,
  ],
  templateUrl: './one-way-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransferOneWayDemoComponent {
  protected readonly members = transferMembers
  protected readonly fieldNames = transferFieldNames
  protected readonly disabled = signal(false)
}
