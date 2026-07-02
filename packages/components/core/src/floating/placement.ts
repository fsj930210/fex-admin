import type { Placement } from '@floating-ui/dom'

export type FloatingSide = 'top' | 'right' | 'bottom' | 'left'
export type FloatingAlign = 'start' | 'center' | 'end'

export type FloatingPlacement =
  | FloatingSide
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'leftTop'
  | 'leftBottom'
  | 'rightTop'
  | 'rightBottom'

export function getPlacement({
  placement,
  side,
  align,
}: {
  placement?: FloatingPlacement | undefined
  side?: FloatingSide | undefined
  align?: FloatingAlign | undefined
}): Placement {
  // placement 是面向组件使用者的快捷写法，side/align 是更结构化的覆盖入口。
  // 这里允许 side/align 覆盖 placement 的拆解结果，方便组件暴露更细粒度 API。
  const resolved = placementToParts(placement)
  const resolvedSide = side ?? resolved.side
  const resolvedAlign = align ?? resolved.align
  return resolvedAlign === 'center' ? resolvedSide : `${resolvedSide}-${resolvedAlign}`
}

export function placementToParts(placement: FloatingPlacement = 'bottom'): {
  side: FloatingSide
  align: FloatingAlign
} {
  // 兼容 Antd 风格的 topLeft/bottomRight 命名：
  // 后缀描述 trigger 与 floating 对齐的边，例如 bottomLeft 表示浮层的左上角贴 trigger 的左下角。
  // 在 Floating UI 中等价于 bottom-start。这里集中转换，避免各框架 adapter 自己维护一份映射。
  const map = {
    top: { side: 'top', align: 'center' },
    right: { side: 'right', align: 'center' },
    bottom: { side: 'bottom', align: 'center' },
    left: { side: 'left', align: 'center' },
    topLeft: { side: 'top', align: 'start' },
    topRight: { side: 'top', align: 'end' },
    bottomLeft: { side: 'bottom', align: 'start' },
    bottomRight: { side: 'bottom', align: 'end' },
    leftTop: { side: 'left', align: 'start' },
    leftBottom: { side: 'left', align: 'end' },
    rightTop: { side: 'right', align: 'start' },
    rightBottom: { side: 'right', align: 'end' },
  } satisfies Record<FloatingPlacement, { side: FloatingSide; align: FloatingAlign }>
  return map[placement]
}

export function partsFromPlacement(placement: Placement): { side: FloatingSide; align: FloatingAlign } {
  // Floating UI 会返回最终 placement，例如 flip 后从 bottom-start 变成 top-start。
  // adapter 必须消费这里拆出来的最终 side/align，而不是原始 props，否则箭头和动画原点会错。
  const [side, align = 'center'] = placement.split('-')
  return { side: side as FloatingSide, align: align as FloatingAlign }
}
