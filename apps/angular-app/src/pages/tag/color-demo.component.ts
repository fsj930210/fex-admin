import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Tag } from '@fex-design/angular/primitive/tag'
import Card from '@fex-design/angular/ui/card'

@Component({ selector:'fex-tag-color-demo',standalone:true,imports:[Card,Tag],changeDetection:ChangeDetectionStrategy.OnPush,templateUrl:'./color-demo.component.html' })
export class TagColorDemoComponent { protected readonly presets=['neutral','primary','success','warning','danger'] as const }
