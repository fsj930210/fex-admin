import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Avatar, AvatarFallback, AvatarGroup } from '@fex-design/angular/primitive/avatar'
import Card from '@fex-design/angular/ui/card'

@Component({
  selector: 'fex-avatar-group-demo',
  standalone: true,
  imports: [Card, Avatar, AvatarFallback, AvatarGroup],
  templateUrl: './group-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarGroupDemoComponent {
  protected readonly names = ['AM', 'BL', 'CS', 'DT', 'ER']
}
