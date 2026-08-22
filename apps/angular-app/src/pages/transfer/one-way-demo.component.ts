import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import {
  Transfer,
  TransferActionsTemplate,
  TransferPanelTemplate,
} from '@fex-design/angular/primitive/transfer'
import { ChevronRightIcon } from '@fex-design/angular/icon/chevron'
import { TrashIcon } from '@fex-design/angular/icon/trash'
import { SwitchRoot, SwitchThumb } from '@fex-design/angular/primitive/switch'
import { Button } from '@fex-design/angular/ui/button'
import Card from '@fex-design/angular/ui/card'
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
