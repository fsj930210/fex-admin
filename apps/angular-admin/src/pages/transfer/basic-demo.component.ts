import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { Transfer } from '@fex/components-angular/primitive/transfer'
import Card from '@fex/components-angular/ui/card'
import { transferFieldNames, transferMembers } from './data'

@Component({
  selector: 'fex-transfer-basic-demo',
  standalone: true,
  imports: [Card, Transfer],
  templateUrl: './basic-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransferBasicDemoComponent {
  protected readonly members = transferMembers
  protected readonly fieldNames = transferFieldNames
  protected readonly targetKeys = signal<readonly (string | number)[]>(['susan'])
}
