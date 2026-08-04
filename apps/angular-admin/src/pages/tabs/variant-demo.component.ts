import { ChangeDetectionStrategy, Component } from '@angular/core'
import { TabsContent, TabsItem, TabsList, TabsRoot } from '@fex-design/angular/primitive/tabs'
import Card from '@fex-design/angular/ui/card'
@Component({
  selector: 'fex-variant-tabs-demo',
  standalone: true,
  imports: [Card, TabsRoot, TabsList, TabsItem, TabsContent],
  templateUrl: './variant-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VariantTabsDemoComponent {}
