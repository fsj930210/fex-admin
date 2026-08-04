import type { RectLike, SortableId, SortableMotionOptions, SortableMotionStyle } from './types'

export interface SortableMotionTarget {
  getRect: () => RectLike | null
}

export class SortableMotionRegistry {
  private targets = new Map<SortableId, Set<SortableMotionTarget>>()
  private firstRects = new Map<SortableId, RectLike>()
  private styles = new Map<SortableId, SortableMotionStyle>()

  register(id: SortableId, target: SortableMotionTarget) {
    const targets = this.targets.get(id) ?? new Set<SortableMotionTarget>()
    targets.add(target)
    this.targets.set(id, targets)

    return () => {
      targets.delete(target)
      if (targets.size === 0) {
        this.targets.delete(id)
      }
    }
  }

  measureFirst() {
    this.firstRects.clear()
    for (const [id, targets] of this.targets) {
      const firstTarget = targets.values().next().value as SortableMotionTarget | undefined
      const rect = firstTarget?.getRect()
      if (rect) {
        this.firstRects.set(id, rect)
      }
    }
  }

  measureLast(options: SortableMotionOptions = {}, notify?: () => void) {
    const duration = options.duration ?? 180
    const easing = options.easing ?? 'cubic-bezier(.2, 0, 0, 1)'
    const nextStyles = new Map<SortableId, SortableMotionStyle>()
    const movingIds: SortableId[] = []

    for (const [id, targets] of this.targets) {
      const firstTarget = targets.values().next().value as SortableMotionTarget | undefined
      const first = this.firstRects.get(id)
      const last = firstTarget?.getRect()
      if (!first || !last) {
        continue
      }

      const dx = first.left - last.left
      const dy = first.top - last.top
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
        continue
      }

      nextStyles.set(id, {
        transform: `translate3d(${dx}px, ${dy}px, 0)`,
        transition: 'none',
      })
      movingIds.push(id)
    }

    this.styles = nextStyles
    notify?.()

    if (movingIds.length === 0) {
      return
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        for (const id of movingIds) {
          this.styles.set(id, {
            transform: 'translate3d(0, 0, 0)',
            transition: `transform ${duration}ms ${easing}`,
          })
        }
        notify?.()
      })
    })
  }

  getStyle(id: SortableId): SortableMotionStyle {
    return this.styles.get(id) ?? {}
  }

  clear() {
    this.firstRects.clear()
    this.styles.clear()
  }
}
