import { ChangeDetectionStrategy, Component } from '@angular/core'
import Card from '@fex-design/angular/ui/card'
import { Button } from '@fex-design/angular/ui/button'
import { RadioGroup, Radio } from '@fex-design/angular/primitive/radio'
import { Drawer, DrawerBody, DrawerClose, DrawerContent, DrawerHeader, DrawerMask, DrawerPortal, DrawerResizeHandle, DrawerTrigger } from '@fex-design/angular/primitive/drawer'
import { HeaderFooterDemoComponent } from './header-footer-demo.component'
import { PresetDemoComponent } from './preset-demo.component'
@Component({ selector:'fex-drawer-page', imports:[Card,Button,RadioGroup,Radio,Drawer,DrawerTrigger,DrawerPortal,DrawerMask,DrawerContent,DrawerResizeHandle,DrawerHeader,DrawerBody,DrawerClose,HeaderFooterDemoComponent,PresetDemoComponent], templateUrl:'./index.component.html', changeDetection:ChangeDetectionStrategy.OnPush, host:{class:'block'} })
export class DrawerComponent { protected readonly placements=['top','right','bottom','left'] as const; protected placement:'top'|'right'|'bottom'|'left'='right'; protected resizePlacement:'top'|'right'|'bottom'|'left'='right'; protected size=400; protected setPlacement(value:string | number){this.placement=value as typeof this.placement} protected setResizePlacement(value:string | number){this.resizePlacement=value as typeof this.resizePlacement} protected onSizeChange(value:number){this.size=value} }
