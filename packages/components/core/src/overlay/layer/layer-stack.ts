export interface LayerRecord {
  id: number
  element: HTMLElement | null
  modal: boolean
}

let nextLayerId = 1
// 全局 layer 栈记录当前页面中已挂载的浮层顺序。
// 这里只存 core 最小信息，不做焦点陷阱或 aria-hidden；这些更具体的能力后续应独立模块化。
const layers: LayerRecord[] = []

export function createLayerRecord(modal = false): LayerRecord {
  // id 只用于稳定识别层记录，不依赖 DOM 顺序。
  // element 初始为空，等 adapter 挂载 content 后再注册实际边界。
  const layer = { id: nextLayerId++, element: null, modal }
  return layer
}

export function addLayerRecord(layer: LayerRecord) {
  // 同一个 layer 可能因为框架 ref 回调重复触发而多次注册。
  // includes 去重可以避免同一浮层在栈里出现多份，导致 isTopLayer 判断错误。
  if (!layers.includes(layer)) {
    layers.push(layer)
  }
}

export function removeLayerRecord(layer: LayerRecord) {
  // 卸载时必须移除 layer，否则后续 outside pointer 会被旧 DOM 记录干扰。
  const index = layers.indexOf(layer)
  if (index >= 0) {
    layers.splice(index, 1)
  }
}

export function getTopLayer() {
  // 数组尾部就是最后挂载的浮层，也就是当前应优先响应 ESC/外部点击的层。
  return layers.at(-1)
}

export function isTopLayer(layer: LayerRecord) {
  return getTopLayer() === layer
}

export function isTargetInsideLayer(layer: LayerRecord, target: EventTarget | null | undefined) {
  // target 可能来自非 DOM 事件或已经被销毁；不是 Node 时无法调用 contains，直接按外部处理。
  if (!target || !layer.element || !(target instanceof Node)) {
    return false
  }

  return layer.element.contains(target)
}
