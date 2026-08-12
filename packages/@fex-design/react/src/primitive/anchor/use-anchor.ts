import {
  getAnchorScrollTop,
  getAnchorTargetTop,
  getAnchorViewportHeight,
  isAnchorScrolledToEnd,
  resolveAnchorTarget,
} from '@fex-design/core/anchor/dom'
import { createAnchorController } from '@fex-design/core/anchor/model'
import { flattenAnchorItems, getAnchorActiveKeys } from '@fex-design/core/anchor/model'
import type {
  AnchorActiveMode,
  AnchorItem,
  AnchorOrientation,
} from '@fex-design/core/anchor/types'
import { useEffect, useMemo, useRef } from 'react'
import { useMemoizedFn } from '../../hooks/use-memoized-fn'
import { useCoreStore } from '../../hooks/use-core-store'
import { useLazyRef } from '../../hooks/use-lazy-ref'

export interface UseAnchorOptions<TTitle> {
  items: readonly AnchorItem<TTitle>[]
  activeKeys?: readonly string[]
  defaultActiveKeys?: readonly string[]
  activeMode?: AnchorActiveMode
  orientation?: AnchorOrientation
  container?: Window | HTMLElement | (() => Window | HTMLElement)
  offset?: number
  activeOffset?: number
  behavior?: ScrollBehavior
  onChange?: (activeKeys: readonly string[], items: readonly AnchorItem<TTitle>[]) => void
}

export function useAnchor<TTitle>({
  items,
  activeKeys: controlledKeys,
  defaultActiveKeys = [],
  activeMode = 'current',
  orientation = 'vertical',
  container,
  offset = 0,
  activeOffset = 0,
  behavior = 'smooth',
  onChange,
}: UseAnchorOptions<TTitle>) {
  const rootRef = useRef<HTMLElement | null>(null)
  const linkRefs = useRef(new Map<string, HTMLButtonElement>())
  const controller = useLazyRef(() => createAnchorController<TTitle>({ activeKeys: controlledKeys, defaultActiveKeys, onChange })).current
  controller.updateOptions({ activeKeys: controlledKeys, defaultActiveKeys, onChange })
  const { activeKeys } = useCoreStore(controller)
  const flatItems = useMemo(() => flattenAnchorItems(items), [items])
  const visibleItems = orientation === 'horizontal' ? flatItems.filter((item) => item.level === 0) : flatItems

  const resolveContainer = useMemoizedFn(() =>
    typeof container === 'function' ? container() : (container ?? window),
  )

  const change = useMemoizedFn((nextKeys: readonly string[]) => {
    const activeSet = new Set(nextKeys)
    controller.change(nextKeys, flatItems.filter(({ item }) => activeSet.has(item.key)).map(({ item }) => item))
  })

  const update = useMemoizedFn(() => {
    const scrollContainer = resolveContainer()
    const positions = visibleItems.flatMap(({ item }) => {
      const target = resolveAnchorTarget(item.target)
      return target ? [{ item, top: getAnchorTargetTop(target, scrollContainer) }] : []
    })
    change(getAnchorActiveKeys({
      positions,
      scrollTop: getAnchorScrollTop(scrollContainer),
      viewportHeight: getAnchorViewportHeight(scrollContainer),
      offset,
      activeOffset,
      mode: activeMode,
      scrolledToEnd: isAnchorScrolledToEnd(scrollContainer),
    }))
  })

  useEffect(() => {
    const scrollContainer = resolveContainer()
    let frame = 0
    const handleUpdate = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    handleUpdate()
    scrollContainer.addEventListener('scroll', handleUpdate, { passive: true })
    window.addEventListener('resize', handleUpdate)
    return () => {
      cancelAnimationFrame(frame)
      scrollContainer.removeEventListener('scroll', handleUpdate)
      window.removeEventListener('resize', handleUpdate)
    }
  }, [resolveContainer, update])

  const activate = useMemoizedFn((item: AnchorItem<TTitle>) => {
    const target = resolveAnchorTarget(item.target)
    if (!target) return
    const scrollContainer = resolveContainer()
    const top = Math.max(getAnchorTargetTop(target, scrollContainer) - offset, 0)
    change(activeMode === 'progress'
      ? visibleItems.slice(0, visibleItems.findIndex(({ item: entry }) => entry.key === item.key) + 1).map(({ item: entry }) => entry.key)
      : [item.key])
    scrollContainer.scrollTo({ top, behavior })
  })

  return { activeKeys, activate, flatItems, linkRefs, rootRef, visibleItems }
}
