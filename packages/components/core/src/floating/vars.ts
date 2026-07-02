import type { FloatingSide } from './placement'

export interface FloatingVars {
  x: number
  y: number
  strategy: 'absolute' | 'fixed'
  transformOrigin: string
  referenceX: number
  referenceY: number
  referenceWidth: number
  referenceHeight: number
  arrowX?: number
  arrowY?: number
  arrowSize?: number
  zIndex?: number
}

export function getTransformOrigin(side: FloatingSide, arrowX?: number, arrowY?: number) {
  // transform-origin 跟随最终 side 和箭头坐标，保证缩放/淡入动画从箭头附近开始。
  // 如果只按 side 写死 center，会在偏移或 shift 后出现动画起点和箭头不一致的问题。
  if (side === 'top') {
    return `${arrowX ?? 0}px bottom`
  }
  if (side === 'bottom') {
    return `${arrowX ?? 0}px top`
  }
  if (side === 'left') {
    return `right ${arrowY ?? 0}px`
  }
  return `left ${arrowY ?? 0}px`
}

export function patchFloatingVars(element: HTMLElement, vars: FloatingVars) {
  // CSS 变量是 core 和样式包之间的 DOM 协议。
  // core 负责写入最终定位结果，adapter 只需要绑定固定样式，样式包可以直接消费变量做尺寸和动画。
  element.style.setProperty('--floating-x', `${Math.round(vars.x)}px`)
  element.style.setProperty('--floating-y', `${Math.round(vars.y)}px`)
  element.style.setProperty('--floating-strategy', vars.strategy)
  element.style.setProperty('--floating-transform-origin', vars.transformOrigin)
  element.style.setProperty('--floating-reference-x', `${Math.round(vars.referenceX)}px`)
  element.style.setProperty('--floating-reference-y', `${Math.round(vars.referenceY)}px`)
  element.style.setProperty('--floating-reference-width', `${Math.round(vars.referenceWidth)}px`)
  element.style.setProperty('--floating-reference-height', `${Math.round(vars.referenceHeight)}px`)

  if (vars.arrowX !== undefined) {
    // arrowX/arrowY 可能只有一个方向存在，不能在缺失时写 0 覆盖旧值。
    // 对应方向由 data-side 和样式共同决定，避免左右/上下切换时产生错误 clamp。
    element.style.setProperty('--floating-arrow-x', `${Math.round(vars.arrowX)}px`)
  }
  if (vars.arrowY !== undefined) {
    element.style.setProperty('--floating-arrow-y', `${Math.round(vars.arrowY)}px`)
  }
  if (vars.arrowSize !== undefined) {
    element.style.setProperty('--floating-arrow-size', `${Math.round(vars.arrowSize)}px`)
  }
  if (vars.zIndex !== undefined) {
    element.style.setProperty('--floating-z-index', `${vars.zIndex}`)
  }
}
