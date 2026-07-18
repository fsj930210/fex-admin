import type { ScrollbarAxis, ScrollbarController, ScrollbarOptions } from './types'

export type { ScrollbarAxis, ScrollbarAutoHide, ScrollbarClickScroll, ScrollbarController, ScrollbarOptions, ScrollbarScrollDetail, ScrollbarVisibility } from './types'

type BarElements = { bar: HTMLElement; track: HTMLElement; thumb: HTMLElement }
type ScrollbarResolvedOptions = {
  visibility: NonNullable<ScrollbarOptions['visibility']>
  autoHide: NonNullable<ScrollbarOptions['autoHide']>
  autoHideDelay: number
  dragScroll: boolean
  clickScroll: NonNullable<ScrollbarOptions['clickScroll']>
  minThumbSize: number
  disabled: boolean
}

const defaults: ScrollbarResolvedOptions = {
  visibility: 'auto',
  autoHide: 'scroll',
  autoHideDelay: 900,
  dragScroll: true,
  clickScroll: false,
  minThumbSize: 24,
  disabled: false,
}

/**
 * The controller intentionally treats a bar's rendered size as its track geometry.
 * It never knows about headers or tables: higher-level layouts can simply place a
 * bar below a header and ResizeObserver makes the thumb follow that real geometry.
 */
export function createScrollbarController(input: ScrollbarOptions = {}): ScrollbarController {
  // Framework adapters forward optional props as `undefined`; spreading them over
  // defaults would produce NaN Thumb dimensions (for example minThumbSize).
  const options = {
    visibility: input.visibility ?? defaults.visibility,
    autoHide: input.autoHide ?? defaults.autoHide,
    autoHideDelay: input.autoHideDelay ?? defaults.autoHideDelay,
    dragScroll: input.dragScroll ?? defaults.dragScroll,
    clickScroll: input.clickScroll ?? defaults.clickScroll,
    minThumbSize: input.minThumbSize ?? defaults.minThumbSize,
    disabled: input.disabled ?? defaults.disabled,
    onScroll: input.onScroll,
  }
  let root: HTMLElement | undefined
  let viewport: HTMLElement | undefined
  let bars: Partial<Record<ScrollbarAxis, BarElements>> = {}
  let resizeObserver: ResizeObserver | undefined
  let frame = 0
  let hideTimer: ReturnType<typeof setTimeout> | undefined
  let cleanup: (() => void) | undefined
  let active = false
  let pointerInside = false

  const axisMetrics = (axis: ScrollbarAxis) => {
    if (!viewport) return undefined
    const isX = axis === 'x'
    const viewportSize = isX ? viewport.clientWidth : viewport.clientHeight
    const contentSize = isX ? viewport.scrollWidth : viewport.scrollHeight
    const offset = isX ? viewport.scrollLeft : viewport.scrollTop
    return { viewportSize, contentSize, offset, maxOffset: Math.max(contentSize - viewportSize, 0) }
  }

  const setBarVisible = (axis: ScrollbarAxis, visible: boolean) => {
    const bar = bars[axis]?.bar
    if (bar) bar.dataset.visible = visible ? 'true' : 'false'
  }

  const update = () => {
    frame = 0
    for (const axis of ['x', 'y'] as const) {
      const elements = bars[axis]
      const metrics = axisMetrics(axis)
      if (!elements || !metrics) continue
      const trackSize = axis === 'x' ? elements.track.clientWidth : elements.track.clientHeight
      const canScroll = metrics.maxOffset > 0 && trackSize > 0
      const visible = options.visibility === 'always' || (options.visibility === 'auto' && canScroll && (options.autoHide === 'never' || active))
      setBarVisible(axis, visible)
      if (!canScroll) continue
      const thumbSize = Math.min(trackSize, Math.max(options.minThumbSize, trackSize * metrics.viewportSize / metrics.contentSize))
      const thumbOffset = (trackSize - thumbSize) * metrics.offset / metrics.maxOffset
      if (axis === 'x') {
        elements.thumb.style.width = `${thumbSize}px`
        elements.thumb.style.transform = `translate3d(${thumbOffset}px, 0, 0)`
      } else {
        elements.thumb.style.height = `${thumbSize}px`
        elements.thumb.style.transform = `translate3d(0, ${thumbOffset}px, 0)`
      }
    }
  }

  const scheduleUpdate = () => {
    if (!frame) frame = requestAnimationFrame(update)
  }

  const show = (immediate = false) => {
    if (options.visibility === 'hidden') return
    active = true
    if (immediate) update()
    else scheduleUpdate()
    if (hideTimer) clearTimeout(hideTimer)
    if (options.autoHide !== 'never' && !pointerInside) {
      hideTimer = setTimeout(() => {
        active = false
        if (options.visibility !== 'always') update()
      }, options.autoHideDelay)
    }
  }

  const scrollFromPointer = (axis: ScrollbarAxis, event: PointerEvent, thumbPointerOffset?: number) => {
    const elements = bars[axis]
    const metrics = axisMetrics(axis)
    if (!elements || !metrics || !viewport || metrics.maxOffset <= 0) return
    const rect = elements.track.getBoundingClientRect()
    const trackSize = axis === 'x' ? rect.width : rect.height
    const pointerOffset = axis === 'x' ? event.clientX - rect.left : event.clientY - rect.top
    const thumbSize = axis === 'x' ? elements.thumb.offsetWidth : elements.thumb.offsetHeight
    // Track clicks centre the Thumb at the pointer. Dragging retains the exact
    // point where the user grabbed the Thumb, so its first move cannot jump.
    const grabOffset = thumbPointerOffset ?? thumbSize / 2
    const next = Math.max(0, Math.min(trackSize - thumbSize, pointerOffset - grabOffset))
    const offset = next / Math.max(trackSize - thumbSize, 1) * metrics.maxOffset
    if (axis === 'x') viewport.scrollLeft = offset
    else viewport.scrollTop = offset
  }

  const bindBar = (axis: ScrollbarAxis, elements: BarElements) => {
    const onPointerDown = (event: PointerEvent) => {
      if (options.disabled || event.button !== 0 || !viewport) return
      const isThumb = elements.thumb.contains(event.target as Node)
      if (isThumb && options.dragScroll) {
        event.preventDefault()
        elements.bar.setPointerCapture(event.pointerId)
        elements.thumb.dataset.dragging = 'true'
        const thumbRect = elements.thumb.getBoundingClientRect()
        const thumbPointerOffset = axis === 'x'
          ? event.clientX - thumbRect.left
          : event.clientY - thumbRect.top
        const onMove = (moveEvent: PointerEvent) => scrollFromPointer(axis, moveEvent, thumbPointerOffset)
        const onEnd = () => {
          elements.thumb.dataset.dragging = 'false'
          elements.bar.removeEventListener('pointermove', onMove)
          elements.bar.removeEventListener('pointerup', onEnd)
          elements.bar.removeEventListener('pointercancel', onEnd)
        }
        elements.bar.addEventListener('pointermove', onMove)
        elements.bar.addEventListener('pointerup', onEnd)
        elements.bar.addEventListener('pointercancel', onEnd)
        return
      }
      if (!isThumb && options.clickScroll) {
        const metrics = axisMetrics(axis)
        if (!metrics) return
        if (options.clickScroll === 'jump') scrollFromPointer(axis, event)
        else {
          const rect = elements.thumb.getBoundingClientRect()
          const pointer = axis === 'x' ? event.clientX : event.clientY
          const midpoint = axis === 'x' ? rect.left + rect.width / 2 : rect.top + rect.height / 2
          viewport.scrollBy(axis === 'x' ? { left: pointer < midpoint ? -metrics.viewportSize : metrics.viewportSize } : { top: pointer < midpoint ? -metrics.viewportSize : metrics.viewportSize })
        }
      }
    }
    const onWheel = (event: WheelEvent) => {
      if (!viewport) return
      event.preventDefault()
      viewport.scrollBy({ left: event.deltaX, top: event.deltaY, behavior: 'auto' })
    }
    elements.bar.addEventListener('pointerdown', onPointerDown)
    elements.bar.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      elements.bar.removeEventListener('pointerdown', onPointerDown)
      elements.bar.removeEventListener('wheel', onWheel)
    }
  }

  return {
    connect(nextRoot) {
      cleanup?.()
      root = nextRoot
      viewport = root.querySelector<HTMLElement>('[data-slot="scrollbar-viewport"]') ?? undefined
      bars = {}
      for (const bar of root.querySelectorAll<HTMLElement>('[data-slot="scrollbar-bar"]')) {
        const axis = bar.dataset.axis as ScrollbarAxis | undefined
        const track = bar.querySelector<HTMLElement>('[data-slot="scrollbar-track"]')
        const thumb = bar.querySelector<HTMLElement>('[data-slot="scrollbar-thumb"]')
        if (axis && track && thumb) bars[axis] = { bar, track, thumb }
      }
      if (!viewport) return () => undefined
      const onScroll = () => {
        show()
        scheduleUpdate()
        options.onScroll?.({ scrollLeft: viewport!.scrollLeft, scrollTop: viewport!.scrollTop })
      }
      const onMove = () => {
        show()
      }
      const onEnter = () => {
        pointerInside = true
        // Discoverability is essential for horizontal-only overflow: users can't
        // be expected to guess Shift+wheel or a hidden drag target.
        show(true)
      }
      const onLeave = () => {
        pointerInside = false
        if (options.autoHide !== 'never') { active = false; update() }
      }
      const onViewportWheel = (event: WheelEvent) => {
        if (!viewport) return
        const x = axisMetrics('x')
        const y = axisMetrics('y')
        const canScrollX = Boolean(x && x.maxOffset > 0)
        const canScrollY = Boolean(y && y.maxOffset > 0)
        // A horizontal-only area should respond to the ordinary mouse wheel.
        // For two-axis content, preserve native vertical scrolling and use
        // Shift+wheel (or a trackpad's horizontal delta) for horizontal motion.
        if (canScrollX && (event.shiftKey || (!canScrollY && event.deltaY !== 0))) {
          event.preventDefault()
          viewport.scrollBy({ left: event.deltaX || event.deltaY, behavior: 'auto' })
        }
      }
      viewport.addEventListener('scroll', onScroll, { passive: true })
      viewport.addEventListener('wheel', onViewportWheel, { passive: false })
      root.addEventListener('pointermove', onMove, { passive: true })
      root.addEventListener('pointerenter', onEnter, { passive: true })
      root.addEventListener('pointerleave', onLeave)
      root.addEventListener('mousemove', onMove, { passive: true })
      root.addEventListener('mouseenter', onEnter, { passive: true })
      root.addEventListener('mouseleave', onLeave)
      const unbindBars = (Object.entries(bars) as Array<[ScrollbarAxis, BarElements]>).map(([axis, elements]) => bindBar(axis, elements))
      resizeObserver = new ResizeObserver(scheduleUpdate)
      resizeObserver.observe(root)
      resizeObserver.observe(viewport)
      for (const elements of Object.values(bars)) {
        if (elements) { resizeObserver.observe(elements.bar); resizeObserver.observe(elements.track) }
      }
      update()
      if (root.matches(':hover')) onEnter()
      cleanup = () => {
        if (frame) cancelAnimationFrame(frame)
        if (hideTimer) clearTimeout(hideTimer)
        viewport?.removeEventListener('scroll', onScroll)
        viewport?.removeEventListener('wheel', onViewportWheel)
        root?.removeEventListener('pointermove', onMove)
        root?.removeEventListener('pointerenter', onEnter)
        root?.removeEventListener('pointerleave', onLeave)
        root?.removeEventListener('mousemove', onMove)
        root?.removeEventListener('mouseenter', onEnter)
        root?.removeEventListener('mouseleave', onLeave)
        unbindBars.forEach((unbind) => unbind?.())
        resizeObserver?.disconnect()
        resizeObserver = undefined
      }
      return cleanup
    },
    update: scheduleUpdate,
    scrollTo(options) { viewport?.scrollTo(options) },
    scrollBy(options) { viewport?.scrollBy(options) },
    destroy() { cleanup?.(); cleanup = undefined; root = undefined; viewport = undefined; bars = {} },
  }
}
