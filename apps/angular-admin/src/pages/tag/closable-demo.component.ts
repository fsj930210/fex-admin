import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { Tag } from '@fex-design/angular/primitive/tag'
import Card from '@fex-design/angular/ui/card'

@Component({ selector:'fex-tag-closable-demo',standalone:true,imports:[Card,Tag],changeDetection:ChangeDetectionStrategy.OnPush,templateUrl:'./closable-demo.component.html' })
export class TagClosableDemoComponent { protected readonly items=signal(['React','Vue','Solid']);protected remove(item:string){this.items.update(current=>current.filter(value=>value!==item))} }
