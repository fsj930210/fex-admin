import type { ColorInput, ColorValue } from '../color/types'

export type GradientInterpolation = 'srgb' | 'oklch'
export interface GradientStop { id: string; color: ColorValue; position: number }
export interface LinearGradientValue { type: 'linear-gradient'; angle: number; interpolation: GradientInterpolation; stops: GradientStop[] }
export interface GradientInputStop { id?: string; color: ColorInput; position: number }
export interface LinearGradientInput { type: 'linear-gradient'; angle?: number; interpolation?: GradientInterpolation; stops: GradientInputStop[] }
export type GradientChangeSource = 'angle' | 'interpolation' | 'stop-add' | 'stop-remove' | 'stop-move' | 'stop-color'
export interface GradientChangeDetail { source: GradientChangeSource; formattedValue: string }
export interface GradientSnapshot { value: LinearGradientValue; selectedStopId: string; disabled: boolean; interaction: GradientChangeSource | null }
export interface GradientOptions { value?: LinearGradientInput; defaultValue?: LinearGradientInput; disabled?: boolean; onChange?: (value: LinearGradientValue,detail:GradientChangeDetail)=>void; onChangeComplete?: (value:LinearGradientValue,detail:GradientChangeDetail)=>void }
export interface GradientController { getSnapshot:()=>GradientSnapshot;subscribe:(listener:()=>void)=>()=>void;setOptions:(options:GradientOptions)=>void;syncSnapshot:()=>void;selectStop:(id:string)=>void;addStop:(position:number,color?:ColorInput)=>string|undefined;removeStop:(id:string)=>void;moveStop:(id:string,position:number,complete?:boolean)=>void;setStopColor:(id:string,color:ColorInput,complete?:boolean)=>void;setAngle:(angle:number,complete?:boolean)=>void;setInterpolation:(value:GradientInterpolation)=>void;beginInteraction:(source:GradientChangeSource)=>void;completeInteraction:()=>void }
