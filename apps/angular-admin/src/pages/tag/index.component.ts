import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { TagBasicDemoComponent } from './basic-demo.component'
import { TagClosableDemoComponent } from './closable-demo.component'
import { TagColorDemoComponent } from './color-demo.component'

@Component({ selector:'fex-tag-page',standalone:true,imports:[RouterLink,TagBasicDemoComponent,TagColorDemoComponent,TagClosableDemoComponent],host:{class:'block'},changeDetection:ChangeDetectionStrategy.OnPush,templateUrl:'./index.component.html' })
export class TagComponent {}
