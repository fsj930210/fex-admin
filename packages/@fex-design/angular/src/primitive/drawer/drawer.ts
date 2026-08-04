import { createDrawerController } from '@fex-design/core/drawer/create-drawer-controller'
import type { DrawerOptions, DrawerPlacement, DrawerSize } from '@fex-design/core/drawer/create-drawer-controller'
import { drawerBodyClassName, drawerCloseClassName, drawerContentClassName, drawerFooterClassName, drawerHeaderClassName, drawerMaskClassName, drawerResizeHandleClassName } from '@fex-design/styles/drawer'
import { ChangeDetectionStrategy, Component, Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output, inject, signal } from '@angular/core'
import type { AfterViewInit, OnChanges, OnDestroy } from '@angular/core'
import { createCoreStoreSignal } from '../../signals/core-store-signal'
import { createHostClassName } from '../../signals/host-class'
import { CloseIcon } from '../../icon/close'
import { FexResizeDirective } from '../../directives/resize'

@Component({ selector:'fex-drawer', standalone:true, changeDetection:ChangeDetectionStrategy.OnPush, template:'<ng-content />' })
export class Drawer implements OnChanges, OnDestroy {
 private readonly parentDrawer=inject(Drawer,{skipSelf:true,optional:true})
 readonly depth:number=(this.parentDrawer?.depth??-1)+1
 @Input() open?: boolean; @Input() defaultOpen=false; @Input() placement: DrawerPlacement='right'; @Input() size: DrawerSize='md'; @Input() mask=true; @Input() modal=true; @Input() forceMount=false; @Input() closeDelay=300; @Input() closeOnMaskPointer=true; @Input() dismiss?: DrawerOptions['dismiss']; @Input() resizable=false; @Input() minSize=240; @Input() maxSize?: number; @Output() openChange=new EventEmitter<boolean>(); @Output() sizeChange=new EventEmitter<number>(); localOpen=this.defaultOpen; triggerElement: HTMLButtonElement|null=null; readonly placementState=signal<DrawerPlacement>('right'); readonly drawer=createDrawerController(this.createOptions()); readonly snapshot=createCoreStoreSignal(this.drawer); createOptions(): DrawerOptions { return { open:this.open, defaultOpen:this.localOpen, placement:this.placement, mask:this.mask, modal:this.modal, forceMount:this.forceMount, closeDelay:this.closeDelay, closeOnMaskPointer:this.closeOnMaskPointer, dismiss:this.dismiss, onOpenChange:(next,info)=>{ if(this.open===undefined)this.localOpen=next; this.openChange.emit(next) } } } syncOptions(){this.placementState.set(this.placement);this.drawer.setOptions(this.createOptions())} ngOnChanges(){this.syncOptions()} ngOnDestroy(){this.drawer.destroy()} }
@Directive({ selector:'button[fexDrawerTrigger]', standalone:true, host:{type:'button','[attr.aria-haspopup]':"'dialog'",'[attr.aria-expanded]':'drawerRoot.snapshot().open','[attr.data-state]':"drawerRoot.snapshot().open ? 'open' : 'closed'"} }) export class DrawerTrigger implements AfterViewInit { protected readonly drawerRoot=inject(Drawer); private readonly elementRef=inject<ElementRef<HTMLButtonElement>>(ElementRef); ngAfterViewInit(){this.drawerRoot.triggerElement=this.elementRef.nativeElement} @HostListener('click',['$event']) click(event:MouseEvent){this.drawerRoot.syncOptions();this.drawerRoot.drawer.toggle({source:'trigger',event})} }
@Component({selector:'fex-drawer-portal',standalone:true,changeDetection:ChangeDetectionStrategy.OnPush,host:{'data-slot':'drawer-portal',style:'display: contents'},template:'<ng-content />'})
export class DrawerPortal implements AfterViewInit,OnDestroy {
 @Input() container?:HTMLElement|null
 private readonly elementRef=inject<ElementRef<HTMLElement>>(ElementRef)
 private originalParent:Node|null=null
 ngAfterViewInit(){const element=this.elementRef.nativeElement;this.originalParent=element.parentNode;(this.container??document.body).appendChild(element)}
 ngOnDestroy(){const element=this.elementRef.nativeElement;if(this.originalParent&&element.parentNode!==this.originalParent)this.originalParent.appendChild(element)}
}
@Component({selector:'fex-drawer-mask',standalone:true,changeDetection:ChangeDetectionStrategy.OnPush,host:{'data-slot':'drawer-mask','[class]':'hostClassName()','[style.--drawer-z-index]':'50 + drawerRoot.depth * 2','[style.display]':"drawerRoot.mask && drawerRoot.snapshot().mounted ? null : 'none'",'[attr.data-state]':"drawerRoot.snapshot().open ? 'open' : 'closed'",'[attr.data-phase]':'drawerRoot.snapshot().phase'},template:''}) export class DrawerMask implements AfterViewInit,OnDestroy { protected readonly drawerRoot=inject(Drawer); private readonly elementRef=inject<ElementRef<HTMLDivElement>>(ElementRef); protected readonly hostClassName=createHostClassName(drawerMaskClassName); ngAfterViewInit(){this.drawerRoot.drawer.setOverlayElement(this.elementRef.nativeElement)} ngOnDestroy(){this.drawerRoot.drawer.setOverlayElement(null)} @HostListener('click',['$event']) click(event:MouseEvent){if(this.drawerRoot.closeOnMaskPointer&&event.target===event.currentTarget)this.drawerRoot.drawer.close({source:'mask',event})} }
@Component({selector:'fex-drawer-content',standalone:true,changeDetection:ChangeDetectionStrategy.OnPush,hostDirectives:[FexResizeDirective],host:{role:'dialog',tabindex:'-1','data-slot':'drawer-content','[attr.data-placement]':'drawerRoot.placementState()','[attr.aria-modal]':"drawerRoot.modal ? 'true' : null",'[class]':'hostClassName()','[style.display]':"drawerRoot.snapshot().mounted ? null : 'none'",'[style.--drawer-size]':'sizeValue','[style.--drawer-z-index]':'50 + drawerRoot.depth * 2','[attr.data-state]':"drawerRoot.snapshot().open ? 'open' : 'closed'",'[attr.data-phase]':'drawerRoot.snapshot().phase'},template:'<ng-content />'})
export class DrawerContent implements AfterViewInit,OnDestroy {
 @Input() size?:DrawerSize
 protected readonly drawerRoot=inject(Drawer)
 private readonly elementRef=inject<ElementRef<HTMLDivElement>>(ElementRef)
 private readonly resizeDirective=inject(FexResizeDirective,{self:true})
 private readonly resizeSubscription=this.resizeDirective.resize.subscribe((rect)=>this.drawerRoot.sizeChange.emit(this.isHorizontal ? rect.width : rect.height))
 constructor(){
  this.resizeDirective.applyStyle=false
 }
 protected readonly hostClassName=createHostClassName(()=>drawerContentClassName({placement:this.drawerRoot.placementState()}))
 private get isHorizontal(){return this.drawerRoot.placement==='left'||this.drawerRoot.placement==='right'}
 private get resizeEdge(){return ({left:'right',right:'left',top:'bottom',bottom:'top'} as const)[this.drawerRoot.placement]}
 private get numericSize(){const value=this.size ?? this.drawerRoot.size; const presets:Record<string,number>={sm:320,md:400,lg:560,xl:720,full:100}; return typeof value==='number'?value:((presets[value]??Number.parseInt(value,10))||400)}
 get sizeValue(){const value=this.size ?? this.drawerRoot.size; const presets:Record<string,string>={sm:'320px',md:'400px',lg:'560px',xl:'720px',full:'100%'}; return typeof value==='number'?`${value}px`:presets[value]??value}
 private configureResize(){
  this.resizeDirective.disabled=!this.drawerRoot.resizable
  this.resizeDirective.edge=this.resizeEdge
  this.resizeDirective.edges=[this.resizeEdge]
  this.resizeDirective.rect={x:0,y:0,width:this.isHorizontal?this.numericSize:0,height:this.isHorizontal?0:this.numericSize}
  if(this.isHorizontal){
   this.resizeDirective.minWidth=this.drawerRoot.minSize
   if(this.drawerRoot.maxSize!==undefined)this.resizeDirective.maxWidth=this.drawerRoot.maxSize
  }else{
   this.resizeDirective.minHeight=this.drawerRoot.minSize
   if(this.drawerRoot.maxSize!==undefined)this.resizeDirective.maxHeight=this.drawerRoot.maxSize
  }
 }
 startResize(event:PointerEvent,edge:'top'|'right'|'bottom'|'left'){this.configureResize();this.resizeDirective.start(event,edge)}
 ngAfterViewInit(){this.configureResize();this.drawerRoot.drawer.setLayerElement(this.elementRef.nativeElement)}
 ngOnDestroy(){this.resizeSubscription.unsubscribe();this.drawerRoot.drawer.setLayerElement(null)}
 @HostListener('keydown',['$event']) keydown(event:KeyboardEvent){if(event.key==='Escape')this.drawerRoot.drawer.dismiss.escapeKey({target:event.target,currentTarget:event.currentTarget,event})}
}
@Component({selector:'fex-drawer-header',standalone:true,changeDetection:ChangeDetectionStrategy.OnPush,host:{'[class]':'hostClassName()','data-slot':'drawer-header'},template:'<ng-content />'}) export class DrawerHeader { protected readonly hostClassName=createHostClassName(drawerHeaderClassName) }
@Component({selector:'fex-drawer-body',standalone:true,changeDetection:ChangeDetectionStrategy.OnPush,host:{'[class]':'hostClassName()','data-slot':'drawer-body'},template:'<ng-content />'}) export class DrawerBody { protected readonly hostClassName=createHostClassName(drawerBodyClassName) }
@Component({selector:'fex-drawer-footer',standalone:true,changeDetection:ChangeDetectionStrategy.OnPush,host:{'[class]':'hostClassName()','data-slot':'drawer-footer'},template:'<ng-content />'}) export class DrawerFooter { protected readonly hostClassName=createHostClassName(drawerFooterClassName) }
@Component({selector:'button[fexDrawerClose]',standalone:true,imports:[CloseIcon],host:{type:'button','aria-label':'Close','data-slot':'drawer-close','[class]':'hostClassName()'},templateUrl:'./drawer-close.html'}) export class DrawerClose { @Input() showIcon=true; protected readonly drawerRoot=inject(Drawer); protected readonly hostClassName=createHostClassName(drawerCloseClassName); @HostListener('click',['$event']) click(event:MouseEvent){this.drawerRoot.drawer.close({source:'close-button',event})} }
@Directive({selector:'[fexDrawerResizeHandle]',standalone:true,host:{'[class]':'hostClassName()','[attr.data-slot]':"'drawer-resize-handle'",'[attr.data-edge]':'resizeEdge','[attr.data-resize-edge]':'resizeEdge'}}) export class DrawerResizeHandle { @Input({alias:'fexDrawerResizeHandle'}) edge?: 'top'|'right'|'bottom'|'left'; private readonly drawerRoot=inject(Drawer); private readonly drawerContent=inject(DrawerContent); protected readonly hostClassName=createHostClassName(drawerResizeHandleClassName); protected get resizeEdge(){return this.edge??({left:'right',right:'left',top:'bottom',bottom:'top'} as const)[this.drawerRoot.placementState()]} @HostListener('pointerdown',['$event']) pointerdown(event:PointerEvent){event.stopPropagation();this.drawerContent.startResize(event,this.resizeEdge)} }
