import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { BasicDemo } from './basic-demo.component'
import { ControlledDemo } from './controlled-demo.component'
import { CustomDemo } from './custom-demo.component'
import { RemoteDemo } from './remote-demo.component'

@Component({
  selector: 'fex-auto-complete-page',
  standalone: true,
  imports: [RouterLink, BasicDemo, ControlledDemo, RemoteDemo, CustomDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './index.component.html',
})
export class AutoCompleteComponent {}
