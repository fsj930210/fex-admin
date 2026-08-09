<script lang="ts">
  import { createCascaderController } from '@fex-design/core/cascader/create-cascader-controller'
  import type { CascaderChangeMeta, CascaderFieldNames, CascaderFilterOption, CascaderOption, CascaderValue } from '@fex-design/core/cascader/types'
  import { setContext, type Snippet } from 'svelte'
  import { readableCoreStore } from '../../stores/core-store'
  import Popover from '../popover/popover.svelte'
  import { cascaderContextKey, type CascaderContext } from './context'
  interface Props { children?: Snippet; options?: readonly CascaderOption[]; fieldNames?: CascaderFieldNames; value?: CascaderValue; defaultValue?: CascaderValue; onChange?: (value:CascaderValue,meta:CascaderChangeMeta)=>void; multiple?:boolean; checkStrictly?:boolean; changeOnSelect?:boolean; open?:boolean; defaultOpen?:boolean; onOpenChange?:(open:boolean)=>void; expandTrigger?:'click'|'hover'; showSearch?:boolean; filterOption?:boolean|CascaderFilterOption; onSearch?:(keyword:string)=>void; loadData?:(path:readonly CascaderOption[])=>Promise<void>; clearable?:boolean; loading?:boolean; disabled?:boolean; placeholder?:string; status?:'error'|'warning'; displayRender?:(labels:readonly string[],path:readonly CascaderOption[])=>unknown }
  let { children,options=[],fieldNames,value,defaultValue,onChange,multiple=false,checkStrictly=false,changeOnSelect=false,open,defaultOpen,onOpenChange,expandTrigger='click',showSearch=false,filterOption,onSearch,loadData,clearable=false,loading=false,disabled=false,placeholder,status,displayRender }:Props=$props()
  const controller=createCascaderController({get options(){return options},get fieldNames(){return fieldNames},get value(){return value},get defaultValue(){return defaultValue},get multiple(){return multiple},get checkStrictly(){return checkStrictly},get changeOnSelect(){return changeOnSelect},get open(){return open},get defaultOpen(){return defaultOpen},get expandTrigger(){return expandTrigger},get filterOption(){return filterOption},get loadData(){return loadData},onChange:(next,meta)=>onChange?.(next,meta),onOpenChange:next=>onOpenChange?.(next),onSearch:keyword=>onSearch?.(keyword)})
  const snapshot=readableCoreStore(controller)
  const context:CascaderContext={controller,snapshot,selectedPaths:()=>{controller.getSnapshot();return controller.getSelectedPaths()},multiple:()=>multiple,expandTrigger:()=>expandTrigger,showSearch:()=>showSearch,clearable:()=>clearable,disabled:()=>disabled,loading:()=>loading,status:()=>status,placeholder:()=>placeholder,displayRender};setContext(cascaderContextKey,context)
</script>
<Popover align="start" open={$snapshot.open} {defaultOpen} {disabled} onOpenChange={next=>next?controller.open():controller.close()}>{@render children?.()}</Popover>
