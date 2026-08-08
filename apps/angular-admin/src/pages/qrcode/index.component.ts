import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { AdvancedDemo } from './advanced-demo.component'
import { BasicDemo } from './basic-demo.component'
import { ColorDemo } from './color-demo.component'
import { CustomStatusDemo } from './custom-status-demo.component'
import { DownloadDemo } from './download-demo.component'
import { ErrorLevelDemo } from './error-level-demo.component'
import { IconDemo } from './icon-demo.component'
import { RenderTypeDemo } from './render-type-demo.component'
import { SizeDemo } from './size-demo.component'
import { StatusDemo } from './status-demo.component'

@Component({
  selector: 'fex-qrcode-page',
  standalone: true,
  imports: [
    RouterLink,
    BasicDemo,
    IconDemo,
    StatusDemo,
    CustomStatusDemo,
    RenderTypeDemo,
    SizeDemo,
    ColorDemo,
    DownloadDemo,
    ErrorLevelDemo,
    AdvancedDemo,
  ],
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QRCodeComponent {}
