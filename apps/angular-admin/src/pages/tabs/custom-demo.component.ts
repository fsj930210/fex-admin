import { ChangeDetectionStrategy, Component } from '@angular/core'
import { TabsContent, TabsItem, TabsList, TabsRoot } from '@fex-design/angular/primitive/tabs'
import Card from '@fex-design/angular/ui/card'
@Component({
  selector: 'fex-custom-tabs-demo',
  standalone: true,
  imports: [Card, TabsRoot, TabsList, TabsItem, TabsContent],
  templateUrl: './custom-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomTabsDemoComponent {}
