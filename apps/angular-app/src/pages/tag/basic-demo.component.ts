import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Tag } from '@fex-design/angular/primitive/tag'
import Card from '@fex-design/angular/ui/card'

@Component({ selector:'fex-tag-basic-demo',standalone:true,imports:[Card,Tag],changeDetection:ChangeDetectionStrategy.OnPush,templateUrl:'./basic-demo.component.html' })
export class TagBasicDemoComponent {}
