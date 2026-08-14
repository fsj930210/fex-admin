import { createColorValue } from '../color/color'
import type { ColorValue } from '../color/types'
import type { ColorChannel } from './types'

export interface ColorChannelConfig { min: number; max: number; step: number; label: string; suffix?: string }
const configs: Record<ColorChannel, ColorChannelConfig> = {
  red:{min:0,max:255,step:1,label:'R'}, green:{min:0,max:255,step:1,label:'G'}, blue:{min:0,max:255,step:1,label:'B'},
  'hsl-hue':{min:0,max:360,step:1,label:'H'}, 'hsl-saturation':{min:0,max:100,step:1,label:'S',suffix:'%'}, 'hsl-lightness':{min:0,max:100,step:1,label:'L',suffix:'%'},
  'hsb-hue':{min:0,max:360,step:1,label:'H'}, 'hsb-saturation':{min:0,max:100,step:1,label:'S',suffix:'%'}, 'hsb-brightness':{min:0,max:100,step:1,label:'B',suffix:'%'},
  'oklch-lightness':{min:0,max:1,step:0.01,label:'L'}, 'oklch-chroma':{min:0,max:0.4,step:0.001,label:'C'}, 'oklch-hue':{min:0,max:360,step:1,label:'H'}, alpha:{min:0,max:1,step:0.01,label:'A',suffix:'%'},
}
export const getColorChannelConfig = (channel: ColorChannel) => configs[channel]
export function normalizeChannelValue(channel: ColorChannel, value: number) { const c=configs[channel]; return Math.min(c.max,Math.max(c.min,Math.round(value/c.step)*c.step)) }
export function getColorChannelValue(color: ColorValue, channel: ColorChannel) {
  if (channel === 'alpha') return color.alpha
  if (channel==='red'||channel==='green'||channel==='blue') return color.toRgb()[channel==='red'?'r':channel==='green'?'g':'b']
  if (channel.startsWith('hsl-')) { const c=color.toHsl(); return channel==='hsl-hue'?c.h:channel==='hsl-saturation'?c.s:c.l }
  if (channel.startsWith('hsb-')) { const c=color.toHsb(); return channel==='hsb-hue'?c.h:channel==='hsb-saturation'?c.s:c.b }
  const c=color.toOklch(); return channel==='oklch-lightness'?c.l:channel==='oklch-chroma'?c.c:c.h
}
export function setColorChannelValue(color: ColorValue, channel: ColorChannel, rawValue: number) {
  const value=normalizeChannelValue(channel,rawValue)
  if(channel==='alpha'){const c=color.toRgb();return createColorValue({...c,alpha:value})!}
  if(channel==='red'||channel==='green'||channel==='blue'){const c=color.toRgb();return createColorValue({...c,[channel==='red'?'r':channel==='green'?'g':'b']:value})!}
  if(channel.startsWith('hsl-')){const c=color.toHsl();return createColorValue({...c,[channel==='hsl-hue'?'h':channel==='hsl-saturation'?'s':'l']:value})!}
  if(channel.startsWith('hsb-')){const c=color.toHsb();return createColorValue({...c,[channel==='hsb-hue'?'h':channel==='hsb-saturation'?'s':'b']:value})!}
  const c=color.toOklch();return createColorValue({...c,[channel==='oklch-lightness'?'l':channel==='oklch-chroma'?'c':'h']:value})!
}
