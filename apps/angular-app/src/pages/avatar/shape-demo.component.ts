import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Avatar, AvatarFallback } from '@fex-design/angular/primitive/avatar'
import Card from '@fex-design/angular/ui/card'
@Component({
  selector: 'fex-avatar-shape-demo',
  standalone: true,
  imports: [Card, Avatar, AvatarFallback],
  templateUrl: './shape-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarShapeDemoComponent {}
