import { createColorValue } from '../color/color'
import { createStore } from '../store/create-store'
import { setColorChannelValue } from './channels'
import type { ColorChangeSource, ColorPickerController, ColorPickerOptions, ColorPickerSnapshot } from './types'

const fallback = '#1677FF'
export function createColorPickerController(initialOptions: ColorPickerOptions = {}): ColorPickerController {
  let options=initialOptions; const controlled=()=>options.value!==undefined
  const initial=createColorValue(options.value ?? options.defaultValue ?? fallback)
  const store=createStore<ColorPickerSnapshot>({value:initial,format:options.format??options.defaultFormat??'hex',disabled:options.disabled===true,interaction:null})
  let derivedSnapshot=store.getSnapshot()
  let interactionChanged=false; let interactionSource:ColorChangeSource='channel'
  function snapshot(){const current=store.getSnapshot();const external=controlled()?(options.value===null?null:createColorValue(options.value!)):current.value;const next={...current,value:external,format:options.format??current.format,disabled:options.disabled===true};const sameValue=derivedSnapshot.value===null?next.value===null:next.value!==null&&derivedSnapshot.value.equals(next.value);if(sameValue&&derivedSnapshot.format===next.format&&derivedSnapshot.disabled===next.disabled&&derivedSnapshot.interaction===next.interaction)return derivedSnapshot;derivedSnapshot=next;return derivedSnapshot}
  function detail(value:ColorPickerSnapshot['value'],source:ColorChangeSource){const s=snapshot();return{format:s.format,formattedValue:value?.toString(s.format)??null,source}}
  function commit(value:ColorPickerSnapshot['value'],source:ColorChangeSource,complete=false){const current=snapshot();if((current.value===null&&value===null)||(current.value&&value&&current.value.equals(value)))return;if(!controlled())store.setSnapshot({...current,value});else store.setSnapshot({...current});interactionChanged=true;interactionSource=source;options.onChange?.(value,detail(value,source));if(complete){options.onChangeComplete?.(value,detail(value,source));interactionChanged=false}}
  const controller:ColorPickerController={
    getSnapshot:snapshot,subscribe:store.subscribe,syncSnapshot:()=>store.setSnapshot(snapshot()),setOptions:(next)=>{options=next;controller.syncSnapshot()},
    setValue:(value,source,complete=false)=>commit(value===null?null:createColorValue(value),source,complete),
    setFormat:(format)=>{const current=snapshot();if(current.format===format)return;store.setSnapshot({...current,format});options.onFormatChange?.(format)},
    setChannel:(channel,value,source='channel',complete=false)=>{const current=snapshot();if(!current.value||current.disabled)return;commit(setColorChannelValue(current.value,channel,value),source,complete)},
    setAreaChannels:(x,xv,y,yv)=>{const current=snapshot();if(!current.value||current.disabled)return;commit(setColorChannelValue(setColorChannelValue(current.value,x,xv),y,yv),'area')},
    beginInteraction:(interaction)=>{if(snapshot().disabled)return;store.setSnapshot({...snapshot(),interaction});interactionChanged=false;interactionSource=interaction.source},
    completeInteraction:()=>{const current=snapshot();store.setSnapshot({...current,interaction:null});if(interactionChanged)options.onChangeComplete?.(current.value,detail(current.value,interactionSource));interactionChanged=false},
    clear:()=>commit(null,'clear',true),
  };return controller
}
