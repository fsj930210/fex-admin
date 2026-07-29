import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { TransferBasicDemoComponent } from './basic-demo.component'
import { TransferCustomDemoComponent } from './custom-demo.component'
import { TransferOneWayDemoComponent } from './one-way-demo.component'
import { TransferTableDemoComponent } from './table-demo.component'
import { TransferTreeDemoComponent } from './tree-demo.component'
import { TransferValidationDemoComponent } from './validation-demo.component'

@Component({
  selector: 'fex-transfer-page',
  standalone: true,
  imports: [
    RouterLink,
    TransferBasicDemoComponent,
    TransferOneWayDemoComponent,
    TransferCustomDemoComponent,
    TransferTreeDemoComponent,
    TransferTableDemoComponent,
    TransferValidationDemoComponent,
  ],
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransferComponent {}
