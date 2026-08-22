import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import Card from '@fex-design/angular/ui/card'
import { MenuHorizontalNestedDemoComponent } from './horizontal-nested-demo.component'
import { MenuMenubarDemoComponent } from './menubar-demo.component'
import { MenuNavDemoComponent } from './nav-demo.component'
import { MenuRestoredDemosComponent } from './restored-demos.component'

@Component({
  selector: 'app-menu-page',
  standalone: true,
  imports: [RouterLink, Card, MenuHorizontalNestedDemoComponent, MenuMenubarDemoComponent, MenuNavDemoComponent, MenuRestoredDemosComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './index.component.html',
})
export class MenuComponent {}
