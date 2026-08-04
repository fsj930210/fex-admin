import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  Transfer,
  TransferActionsTemplate,
  TransferItemTemplate,
  TransferPanelTemplate,
} from '@fex-design/angular/primitive/transfer'
import { ChevronLeftIcon, ChevronRightIcon } from '@fex-design/angular/icon/chevron'
import { Badge } from '@fex-design/angular/ui/badge'
import { Button } from '@fex-design/angular/ui/button'
import Card from '@fex-design/angular/ui/card'
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
