export const positionToValue = (position:number,min:number,max:number,inverted=false) => min+(inverted?1-position:position)*(max-min)
export const valueToPosition = (value:number,min:number,max:number,inverted=false) => { const p=(value-min)/(max-min); return inverted?1-p:p }
