import { splitOverflowItems } from '@fex-design/core/collection/split-overflow-items'
import { badgeClassName, badgeOverflowClassName, type BadgeStyleProps } from '@fex-design/styles/badge'
import { cn } from '@fex/utils'
import type { JSX, ParentProps } from 'solid-js'
import { children, createMemo, For, Show, splitProps } from 'solid-js'

export function Badge(props: ParentProps<JSX.HTMLAttributes<HTMLSpanElement>> & BadgeStyleProps) {
  const [local, rest] = splitProps(props, ['class', 'children', 'variant'])
  return (
    <span
      {...rest}
      data-slot="badge"
      data-variant={local.variant ?? 'default'}
      class={cn(badgeClassName({ variant: local.variant }), local.class)}
    >
      {local.children}
    </span>
  )
}

export interface BadgeOverflowProps extends ParentProps<JSX.HTMLAttributes<HTMLDivElement>> {
  maxCount?: number
  overflow?: (count: number, items: readonly JSX.Element[]) => JSX.Element
}
export function BadgeOverflow(props: BadgeOverflowProps) {
  const [local, rest] = splitProps(props, ['class', 'children', 'maxCount', 'overflow'])
  const resolved = children(() => local.children)
  const split = createMemo(() => splitOverflowItems(resolved.toArray(), local.maxCount))
  return <div {...rest} data-slot="badge-overflow" class={cn(badgeOverflowClassName, local.class)}>
    <For each={split().visibleItems}>{(item) => item}</For>
    <Show when={split().overflowCount > 0}>{local.overflow?.(split().overflowCount, split().overflowItems) ?? <Badge variant="secondary">+{split().overflowCount}</Badge>}</Show>
  </div>
}
