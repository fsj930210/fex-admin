import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from '@fex-design/angular/primitive/avatar'
import Card from '@fex-design/angular/ui/card'
@Component({
  selector: 'fex-avatar-content-demo',
  standalone: true,
  imports: [Card, Avatar, AvatarImage, AvatarFallback, AvatarBadge],
  templateUrl: './content-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarContentDemoComponent {}
