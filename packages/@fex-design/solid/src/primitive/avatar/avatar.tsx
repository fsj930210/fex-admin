import {
  avatarBadgeClassName,
  avatarClassName,
  avatarFallbackClassName,
  avatarImageClassName,
  avatarGroupClassName,
  avatarGroupOverflowClassName,
  type AvatarStyleProps,
} from '@fex-design/styles/avatar'
import { splitOverflowItems } from '@fex-design/core/collection/split-overflow-items'
import { cn } from '@fex/utils'
import {
  createContext,
  children,
  createMemo,
  For,
  createSignal,
  Show,
  splitProps,
  useContext,
  type JSX,
  type ParentProps,
} from 'solid-js'
const Context = createContext<{ loaded: () => boolean; setLoaded: (value: boolean) => void }>()
export function Avatar(props: ParentProps<JSX.HTMLAttributes<HTMLSpanElement>> & AvatarStyleProps) {
  const [local, rest] = splitProps(props, ['class', 'children', 'size', 'shape'])
  const [loaded, setLoaded] = createSignal(false)
  return (
    <Context.Provider value={{ loaded, setLoaded }}>
      <span
        {...rest}
        data-slot="avatar"
        data-size={local.size ?? 'md'}
        data-shape={local.shape ?? 'circle'}
        class={cn(avatarClassName({ size: local.size, shape: local.shape }), local.class)}
      >
        {local.children}
      </span>
    </Context.Provider>
  )
}

export interface AvatarGroupProps extends ParentProps<JSX.HTMLAttributes<HTMLDivElement>> {
  maxCount?: number
  overflow?: (count: number, items: readonly JSX.Element[]) => JSX.Element
}
export function AvatarGroup(props: AvatarGroupProps) {
  const [local, rest] = splitProps(props, ['class', 'children', 'maxCount', 'overflow'])
  const resolved = children(() => local.children)
  const split = createMemo(() => splitOverflowItems(resolved.toArray(), local.maxCount))
  return <div {...rest} role="group" data-slot="avatar-group" class={cn(avatarGroupClassName, local.class)}>
    <For each={split().visibleItems}>{(item) => item}</For>
    <Show when={split().overflowCount > 0}>{local.overflow?.(split().overflowCount, split().overflowItems) ?? <AvatarGroupOverflow>+{split().overflowCount}</AvatarGroupOverflow>}</Show>
  </div>
}
export function AvatarGroupOverflow(props: ParentProps<JSX.HTMLAttributes<HTMLSpanElement>>) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return <span {...rest} data-slot="avatar-group-overflow" class={cn(avatarClassName({ size: 'md', shape: 'circle' }), avatarGroupOverflowClassName, local.class)}>{local.children}</span>
}
export function AvatarImage(props: JSX.ImgHTMLAttributes<HTMLImageElement>) {
  const [local, rest] = splitProps(props, ['class', 'onLoad', 'onError'])
  const context = useContext(Context)
  return (
    <img
      {...rest}
      data-slot="avatar-image"
      hidden={!context?.loaded()}
      class={cn(avatarImageClassName, local.class)}
      onLoad={(event) => {
        context?.setLoaded(true)
        typeof local.onLoad === 'function' && local.onLoad(event)
      }}
      onError={(event) => {
        context?.setLoaded(false)
        typeof local.onError === 'function' && local.onError(event)
      }}
    />
  )
}
export function AvatarFallback(props: ParentProps<JSX.HTMLAttributes<HTMLSpanElement>>) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  const context = useContext(Context)
  return (
    <Show when={!context?.loaded()}>
      <span {...rest} data-slot="avatar-fallback" class={cn(avatarFallbackClassName, local.class)}>
        {local.children}
      </span>
    </Show>
  )
}
export function AvatarBadge(props: ParentProps<JSX.HTMLAttributes<HTMLSpanElement>>) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return (
    <span {...rest} data-slot="avatar-badge" class={cn(avatarBadgeClassName, local.class)}>
      {local.children}
    </span>
  )
}
