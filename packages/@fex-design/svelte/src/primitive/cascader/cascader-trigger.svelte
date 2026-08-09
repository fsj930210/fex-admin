<script lang="ts">
  import { cascaderClearClassName,cascaderIndicatorClassName,cascaderInputClassName,cascaderSuffixClassName,cascaderTriggerClassName,cascaderValueContainerClassName } from '@fex-design/styles/cascader'
  import { cn } from '@fex/utils'
  import { getContext } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import ChevronRight from '../../icon/chevron-right.svelte'
  import CloseIcon from '../../icon/close.svelte'
  import LoadingIcon from '../../icon/loading.svelte'
  import Button from '../button/button.svelte'
  import PopoverTrigger from '../popover/popover-trigger.svelte'
  import CascaderValue from './cascader-value.svelte'
  import { cascaderContextKey,type CascaderContext } from './context'
  interface Props extends HTMLAttributes<HTMLDivElement>{class?:string;placeholder?:string}
  let{class:className,placeholder,...rest}:Props=$props()
  const cascader=getContext<CascaderContext>(cascaderContextKey),snapshot=cascader.snapshot
  const selected=()=>{void $snapshot.selectedPathKeys;return cascader.selectedPaths()}
  function keydown(event:KeyboardEvent){if(event.key==='ArrowDown'||event.key==='ArrowUp')cascader.controller.moveActive(event.key==='ArrowDown'?1:-1);else if(event.key==='ArrowRight')cascader.controller.moveToChild();else if(event.key==='ArrowLeft')cascader.controller.moveToParent();else if(event.key==='Home'||event.key==='End')cascader.controller.moveToBoundary(event.key==='Home'?'first':'last');else if(event.key==='Enter'||event.key===' ')cascader.controller.selectActive();else if(event.key==='Escape')cascader.controller.close();else return;event.preventDefault();cascader.controller.open()}
  function bridge<T extends Event>(handler:((event:T)=>void)|null|undefined,event:T){handler?.(event)}
</script>
<PopoverTrigger>{#snippet children(slot)}<div {...rest} use:slot.action data-disabled={cascader.disabled()||undefined} data-status={cascader.status()} aria-invalid={cascader.status()==='error'||undefined} aria-expanded={$snapshot.open} class={cn(cascaderTriggerClassName(),className)} onclick={event=>bridge(slot.props.onclick,event as never)} onpointerenter={event=>bridge(slot.props.onpointerenter,event as never)} onpointerleave={event=>bridge(slot.props.onpointerleave,event as never)} onfocus={event=>bridge(slot.props.onfocus,event as never)} onblur={event=>bridge(slot.props.onblur,event as never)} onkeydown={keydown}><div class={cascaderValueContainerClassName}><CascaderValue/><input role="combobox" aria-expanded={$snapshot.open} disabled={cascader.disabled()} readonly={!cascader.showSearch()} value={$snapshot.searchValue} placeholder={cascader.showSearch()&&!selected().length?(placeholder??cascader.placeholder()):undefined} class={cascaderInputClassName} onfocus={()=>{if(!cascader.showSearch())cascader.controller.open()}} onclick={event=>event.stopPropagation()} oninput={event=>{const keyword=event.currentTarget.value;cascader.controller.setSearchValue(keyword);keyword.trim()?cascader.controller.open():cascader.controller.close()}}/></div><span class={cascaderSuffixClassName}>{#if cascader.loading()}<LoadingIcon class="animate-spin"/>{:else if cascader.clearable()&&selected().length}<Button class={cascaderClearClassName} onclick={event=>{event.stopPropagation();cascader.controller.clear()}}><CloseIcon/></Button>{:else}<span data-state={$snapshot.open?'open':'closed'} class={cascaderIndicatorClassName}><ChevronRight class="rotate-90"/></span>{/if}</span></div>{/snippet}</PopoverTrigger>
