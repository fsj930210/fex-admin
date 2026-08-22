import { ChangeDetectionStrategy, Component } from '@angular/core'
import { AvatarContentDemoComponent } from './content-demo.component'
import { AvatarShapeDemoComponent } from './shape-demo.component'
import { AvatarSizeDemoComponent } from './size-demo.component'
import { AvatarGroupDemoComponent } from './group-demo.component'
@Component({
  selector: 'fex-avatar-page',
  standalone: true,
  imports: [AvatarSizeDemoComponent, AvatarShapeDemoComponent, AvatarContentDemoComponent, AvatarGroupDemoComponent],
  host: { class: 'block' },
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {}
