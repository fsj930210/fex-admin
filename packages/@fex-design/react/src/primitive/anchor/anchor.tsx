import type { AnchorItem as CoreAnchorItem } from '@fex-design/core/anchor/types'
import { ensureAnchorLinkVisible, getAnchorIndicatorStyles } from '@fex-design/core/anchor/dom'
import { getAnchorHighlightedKeys } from '@fex-design/core/anchor/model'
import {
  anchorIndicatorClassName,
  anchorLinkClassName,
  anchorListClassName,
  anchorRailClassName,
  anchorRootClassName,
} from '@fex-design/styles/anchor'
import { cn } from '@fex/utils'
import { useLayoutEffect, useState, type ComponentProps, type CSSProperties, type ReactNode } from 'react'
import { useAnchor, type UseAnchorOptions } from './use-anchor'

type InkStyle = CSSProperties

export interface AnchorProps
  extends Omit<ComponentProps<'nav'>, 'children' | 'onChange'>,
    UseAnchorOptions<ReactNode> {}

export type AnchorItem = CoreAnchorItem<ReactNode>

export function Anchor({ className, style, ref, ...options }: AnchorProps) {
  const orientation = options.orientation ?? 'vertical'
  const anchor = useAnchor(options)
  const [inkStyles, setInkStyles] = useState<InkStyle[]>([])
  const highlightedKeys = getAnchorHighlightedKeys(anchor.activeKeys, anchor.flatItems)

  useLayoutEffect(() => {
    const root = anchor.rootRef.current
    if (!root) return
    let frame = 0
    const updateInk = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        ensureAnchorLinkVisible(root, anchor.activeKeys, orientation)
        setInkStyles(getAnchorIndicatorStyles(root, anchor.activeKeys, orientation))
      })
    }
    const list = root.querySelector<HTMLElement>('[data-slot="anchor-list"][data-level="0"]')
    const observer = new ResizeObserver(updateInk)
    observer.observe(root)
    if (list) list.addEventListener('scroll', updateInk, { passive: true })
    updateInk()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      if (list) list.removeEventListener('scroll', updateInk)
    }
  }, [anchor.activeKeys, orientation])

  const setRoot = (node: HTMLElement | null) => {
    anchor.rootRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

  const renderItems = (items: readonly AnchorItem[], level = 0): ReactNode => (
    <ul data-level={level} data-slot="anchor-list" className={anchorListClassName({ orientation, nested: level > 0 })}>
      {items.map((item) => {
        const active = anchor.activeKeys.includes(item.key)
        const highlighted = highlightedKeys.has(item.key)
        return (
          <li key={item.key} data-active={active || undefined} data-parent-active={!active && highlighted || undefined} data-slot="anchor-item">
            <button
              type="button"
              data-slot="anchor-link"
              data-anchor-key={item.key}
              data-state={active ? 'active' : 'inactive'}
              ref={(node) => node ? anchor.linkRefs.current.set(item.key, node) : anchor.linkRefs.current.delete(item.key)}
              className={anchorLinkClassName({ orientation, active: highlighted })}
              onClick={() => anchor.activate(item)}
            >
              {item.title}
            </button>
            {orientation === 'vertical' && item.children?.length ? renderItems(item.children, level + 1) : null}
          </li>
        )
      })}
    </ul>
  )

  return (
    <nav
      ref={setRoot}
      data-orientation={orientation}
      data-slot="anchor"
      className={cn(anchorRootClassName({ orientation }), className)}
      style={style}
    >
      <div aria-hidden="true" data-slot="anchor-rail" className={anchorRailClassName({ orientation })}>
        {inkStyles.map((inkStyle, index) => (
          <span data-slot="anchor-indicator" key={`${String(inkStyle.top ?? inkStyle.left)}-${index}`} className={anchorIndicatorClassName({ orientation })} style={inkStyle} />
        ))}
      </div>
      {renderItems(options.items)}
    </nav>
  )
}

export type { AnchorActiveMode, AnchorOrientation, AnchorTarget } from '@fex-design/core/anchor/types'
export { useAnchor }
export { createAnchorController } from '@fex-design/core/anchor/model'
