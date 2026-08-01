import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  Transfer,
  TransferActionsTemplate,
  TransferItemTemplate,
  TransferPanelTemplate,
} from '@fex/components-angular/primitive/transfer'
import { ChevronLeftIcon, ChevronRightIcon } from '@fex/components-angular/icon/chevron'
import { Badge } from '@fex/components-angular/ui/badge'
import { Button } from '@fex/components-angular/ui/button'
import Card from '@fex/components-angular/ui/card'
import { transferFieldNames, transferMembers } from './data'

@Component({
  selector: 'fex-transfer-custom-demo',
  standalone: true,
  imports: [
    Card,
    Transfer,
    TransferActionsTemplate,
    TransferItemTemplate,
    TransferPanelTemplate,
    Button,
    Badge,
    ChevronLeftIcon,
    ChevronRightIcon,
  ],
  templateUrl: './custom-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransferCustomDemoComponent {
  protected readonly members = transferMembers
  protected readonly fieldNames = transferFieldNames
}
