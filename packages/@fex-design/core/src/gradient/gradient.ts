import { createColorValue } from '../color/color'
import type { ColorInput, OklchColor, RgbColor } from '../color/types'
import type { GradientInputStop, GradientInterpolation, GradientStop, LinearGradientInput, LinearGradientValue } from './types'

const clamp=(v:number)=>Math.min(1,Math.max(0,v))
export function normalizeGradient(input:LinearGradientInput):LinearGradientValue{
  const source=input.stops.length>=2?input.stops:[{color:'#1677FF',position:0},{color:'#69B1FF',position:1}]
  return {type:'linear-gradient',angle:((input.angle??90)%360+360)%360,interpolation:input.interpolation??'oklch',stops:source.map((s,index)=>({id:s.id??`gradient-stop-${index}`,color:createColorValue(s.color)!,position:clamp(s.position)})).sort((a,b)=>a.position-b.position)}
}
function mixHue(a:number,b:number,t:number){let d=((b-a+540)%360)-180;return(a+d*t+360)%360}
export function interpolateGradient(stops:GradientStop[],position:number,space:GradientInterpolation){const sorted=[...stops].sort((a,b)=>a.position-b.position);const right=sorted.find((s)=>s.position>=position)??sorted.at(-1)!;const index=sorted.indexOf(right);const left=sorted[Math.max(0,index-1)]!;if(left===right)return left.color;const t=(position-left.position)/(right.position-left.position);if(space==='oklch'){const a=left.color.toOklch(),b=right.color.toOklch();const c:OklchColor={l:a.l+(b.l-a.l)*t,c:a.c+(b.c-a.c)*t,h:mixHue(a.h,b.h,t),alpha:a.alpha+(b.alpha-a.alpha)*t};return createColorValue(c)!}const a=left.color.toRgb(),b=right.color.toRgb();const c:RgbColor={r:a.r+(b.r-a.r)*t,g:a.g+(b.g-a.g)*t,b:a.b+(b.b-a.b)*t,alpha:a.alpha+(b.alpha-a.alpha)*t};return createColorValue(c)!}
export function formatLinearGradient(value:LinearGradientValue){const prefix=`linear-gradient(${value.angle}deg${value.interpolation==='oklch'?' in oklch':''}`;return `${prefix}, ${value.stops.map((s)=>`${s.color.toString(value.interpolation==='oklch'?'oklch':'rgb')} ${Number((s.position*100).toFixed(2))}%`).join(', ')})`}
export function createGradientStop(color:ColorInput,position:number,id?:string):GradientInputStop{return id===undefined?{color,position}:{id,color,position}}
