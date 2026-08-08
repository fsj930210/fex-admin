import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { BasicDemo } from './basic-demo.component'
import { CustomConfigDemo } from './custom-config-demo.component'
import { ImageDemo } from './image-demo.component'
import { ModalDrawerDemo } from './modal-drawer-demo.component'
import { MultilineDemo } from './multiline-demo.component'
import { RestoreDemo } from './restore-demo.component'

@Component({
  selector: 'fex-watermark-page',
  standalone: true,
  imports: [
    RouterLink,
    BasicDemo,
    MultilineDemo,
    ImageDemo,
    CustomConfigDemo,
    ModalDrawerDemo,
    RestoreDemo,
  ],
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WatermarkComponent {}
