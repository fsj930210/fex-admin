import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import Card from '@fex/components-angular/ui/card'
import { DropdownBasicDemoComponent } from './basic-demo.component'
import { DropdownCustomPanelDemoComponent } from './custom-panel-demo.component'
import { DropdownCustomTriggerDemoComponent } from './custom-trigger-demo.component'
import { DropdownNestedDemoComponent } from './nested-demo.component'

@Component({ selector: 'app-dropdown-page', standalone: true, imports: [RouterLink, Card, DropdownBasicDemoComponent, DropdownNestedDemoComponent, DropdownCustomPanelDemoComponent, DropdownCustomTriggerDemoComponent], changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './index.component.html' })
export class DropdownComponent {}
