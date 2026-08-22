import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Avatar, AvatarFallback } from '@fex-design/angular/primitive/avatar'
import Card from '@fex-design/angular/ui/card'
@Component({
  selector: 'fex-avatar-size-demo',
  standalone: true,
  imports: [Card, Avatar, AvatarFallback],
  templateUrl: './size-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarSizeDemoComponent {}
