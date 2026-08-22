import { ChangeDetectionStrategy, Component } from '@angular/core'
import { TabsContent, TabsItem, TabsList, TabsRoot } from '@fex-design/angular/primitive/tabs'
import Card from '@fex-design/angular/ui/card'
@Component({
  selector: 'fex-basic-tabs-demo',
  standalone: true,
  imports: [Card, TabsRoot, TabsList, TabsItem, TabsContent],
  templateUrl: './basic-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicTabsDemoComponent {}
