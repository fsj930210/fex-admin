import { CommonModule } from '@angular/common'
import { createCascaderController } from '@fex-design/core/cascader/create-cascader-controller'
import type { CascaderChangeMeta, CascaderFieldNames, CascaderFilterOption, CascaderNode, CascaderOption, CascaderSnapshot, CascaderValue } from '@fex-design/core/cascader/types'
import { cascaderClearClassName, cascaderColumnClassName, cascaderColumnViewportClassName, cascaderContentClassName, cascaderEmptyClassName, cascaderIndicatorClassName, cascaderInputClassName, cascaderLoadingClassName, cascaderOptionClassName, cascaderOptionIconClassName, cascaderOptionLabelClassName, cascaderPanelClassName, cascaderPanelHeight, cascaderPlaceholderClassName, cascaderSuffixClassName, cascaderTagClassName, cascaderTagRemoveClassName, cascaderTriggerClassName, cascaderValueClassName, cascaderValueContainerClassName } from '@fex-design/styles/cascader'
import { checkboxClassName, checkboxIndicatorClassName } from '@fex-design/styles/checkbox'
import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Input, Output, forwardRef, inject, signal, type OnChanges, type Signal } from '@angular/core'
import { CheckIcon } from '../../icon/check'
import { ChevronDownIcon, ChevronRightIcon } from '../../icon/chevron'
import { CloseIcon } from '../../icon/close'
import { LoadingIcon } from '../../icon/loading'
import { MinusIcon } from '../../icon/minus'
import { createCoreStoreSignal } from '../../signals/core-store-signal'
import { Button } from '../button/button'
import { CheckboxIndicator, CheckboxRoot } from '../checkbox/checkbox'
import { Popover, PopoverContent, PopoverPortal, PopoverTrigger } from '../popover/popover'
import { ScrollbarBar, ScrollbarRoot, ScrollbarThumb, ScrollbarTrack, ScrollbarViewport } from '../scrollbar/scrollbar'

@Component({ selector:'fex-cascader', standalone:true, providers:[Popover], changeDetection:ChangeDetectionStrategy.OnPush, template:'<ng-content />' })
export class CascaderRoot implements OnChanges {
  private readonly popover=inject(Popover);private readonly destroyRef=inject(DestroyRef);private readonly optionsState=signal<readonly CascaderOption[]>([])
  @Input() set options(value:readonly CascaderOption[]){this.optionsState.set(value)} get options(){return this.optionsState()}
  @Input() fieldNames:CascaderFieldNames|undefined;@Input() value:CascaderValue;@Input() defaultValue:CascaderValue;@Input() multiple=false;@Input() checkStrictly=false;@Input() changeOnSelect=false;@Input() open:boolean|undefined;@Input() defaultOpen=false;@Input() expandTrigger:'click'|'hover'='click';@Input() showSearch=false;@Input() filterOption:boolean|CascaderFilterOption|undefined;@Input() loadData:((path:readonly CascaderOption[])=>Promise<void>)|undefined;@Input() clearable=false;@Input() loading=false;@Input() disabled=false;@Input() placeholder='';@Input() status:'error'|'warning'|undefined;@Input() displayRender:((labels:readonly string[],path:readonly CascaderOption[])=>string)|undefined
  @Output() readonly change=new EventEmitter<{value:CascaderValue;meta:CascaderChangeMeta}>();@Output() readonly openChange=new EventEmitter<boolean>();@Output() readonly search=new EventEmitter<string>()
  readonly controller:ReturnType<typeof createCascaderController>;readonly snapshot:Signal<CascaderSnapshot>
  constructor(){const root=this;this.controller=createCascaderController({get options(){return root.options},get fieldNames(){return root.fieldNames},get value(){return root.value},get defaultValue(){return root.defaultValue},get multiple(){return root.multiple},get checkStrictly(){return root.checkStrictly},get changeOnSelect(){return root.changeOnSelect},get open(){return root.open},get defaultOpen(){return root.defaultOpen},get expandTrigger(){return root.expandTrigger},get filterOption(){return root.filterOption},get loadData(){return root.loadData},onChange:(value,meta)=>root.change.emit({value,meta}),onOpenChange:open=>{root.popover.open=open;root.popover.syncOptions();root.openChange.emit(open)},onSearch:value=>root.search.emit(value)});this.snapshot=createCoreStoreSignal(this.controller);this.popover.align='start';this.popover.open=this.controller.getSnapshot().open;const subscription=this.popover.openChange.subscribe(next=>next?this.controller.open():this.controller.close());this.destroyRef.onDestroy(()=>subscription.unsubscribe())}
  ngOnChanges(){this.controller.refresh();this.popover.open=this.snapshot().open;this.popover.defaultOpen=this.defaultOpen;this.popover.syncOptions()}
  get selectedPaths(){this.snapshot();return this.controller.getSelectedPaths()}
  display(path:readonly CascaderNode[]){return this.displayRender?.(path.map(node=>node.label),path.map(node=>node.option))??path.map(node=>node.label).join(' / ')}
}

@Component({selector:'fex-cascader-trigger',standalone:true,imports:[CommonModule,PopoverTrigger,Button,ChevronDownIcon,CloseIcon,LoadingIcon],changeDetection:ChangeDetectionStrategy.OnPush,templateUrl:'./cascader-trigger.html'})
export class CascaderTrigger {
  readonly cascader=inject(CascaderRoot);readonly triggerClass=cascaderTriggerClassName();readonly valueContainerClass=cascaderValueContainerClassName;readonly valueClass=cascaderValueClassName;readonly placeholderClass=cascaderPlaceholderClassName;readonly tagClass=cascaderTagClassName;readonly tagRemoveClass=cascaderTagRemoveClassName;readonly inputClass=cascaderInputClassName;readonly suffixClass=cascaderSuffixClassName;readonly indicatorClass=cascaderIndicatorClassName;readonly clearClass=cascaderClearClassName
  focus(){if(!this.cascader.showSearch)this.cascader.controller.open()}
  input(event:Event){const keyword=(event.currentTarget as HTMLInputElement).value;this.cascader.controller.setSearchValue(keyword);keyword.trim()?this.cascader.controller.open():this.cascader.controller.close()}
  keydown(event:KeyboardEvent){const c=this.cascader.controller;if(event.key==='ArrowDown'||event.key==='ArrowUp')c.moveActive(event.key==='ArrowDown'?1:-1);else if(event.key==='ArrowRight')c.moveToChild();else if(event.key==='ArrowLeft')c.moveToParent();else if(event.key==='Home'||event.key==='End')c.moveToBoundary(event.key==='Home'?'first':'last');else if(event.key==='Enter'||event.key===' ')c.selectActive();else if(event.key==='Escape')c.close();else return;event.preventDefault();c.open()}
}

@Component({selector:'fex-cascader-content',standalone:true,imports:[PopoverPortal,PopoverContent,forwardRef(()=>CascaderPanel)],changeDetection:ChangeDetectionStrategy.OnPush,templateUrl:'./cascader-content.html'})
export class CascaderContent { readonly contentClass=cascaderContentClassName }

@Component({selector:'fex-cascader-panel',standalone:true,imports:[CommonModule,ScrollbarRoot,ScrollbarViewport,ScrollbarBar,ScrollbarTrack,ScrollbarThumb,CheckboxRoot,CheckboxIndicator,CheckIcon,MinusIcon,ChevronRightIcon,LoadingIcon],changeDetection:ChangeDetectionStrategy.OnPush,templateUrl:'./cascader-panel.html'})
export class CascaderPanel {
  readonly cascader=inject(CascaderRoot);readonly panelClass=cascaderPanelClassName;readonly columnClass=cascaderColumnClassName;readonly viewportClass=cascaderColumnViewportClassName;readonly optionClass=cascaderOptionClassName;readonly optionLabelClass=cascaderOptionLabelClassName;readonly optionIconClass=cascaderOptionIconClassName;readonly emptyClass=cascaderEmptyClassName;readonly loadingClass=cascaderLoadingClassName;readonly checkboxClass=checkboxClassName();readonly checkboxIndicatorClass=checkboxIndicatorClassName
  panelHeight(){const snapshot=this.cascader.snapshot();if(snapshot.searchValue&&this.cascader.showSearch)return cascaderPanelHeight(this.cascader.loading?0:this.cascader.controller.getSearchResults().length);return cascaderPanelHeight(Math.max(0,...this.cascader.controller.getColumns().map(column=>column.nodes.length)))}
  columnCount(){return this.cascader.snapshot().searchValue&&this.cascader.showSearch?1:Math.max(1,this.cascader.controller.getColumns().length)}
  state(node:CascaderNode){const value=this.cascader.snapshot();return{active:value.activePath.includes(node.key),selected:value.selectedPathKeys.includes(node.key),checked:value.checkedKeys.includes(node.key),indeterminate:value.indeterminateKeys.includes(node.key),loading:value.loadingKeys.includes(node.key)}}
  enter(node:CascaderNode){if(this.cascader.expandTrigger==='hover'&&!node.leaf)this.cascader.controller.expand(node.key)}
}
