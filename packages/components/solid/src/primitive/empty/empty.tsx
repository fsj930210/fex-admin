import { emptyClassName, emptyContentClassName, emptyDescriptionClassName, emptyHeaderClassName, emptyMediaClassName, emptyTitleClassName, type EmptyMediaStyleProps } from '@fex/components-styles/empty'
import { cn } from '@fex/utils'
import type { JSX, ParentProps } from 'solid-js'
import { splitProps } from 'solid-js'

type DivProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>

function createPart(slot: string, className: string) {
  return function Part(props: DivProps) {
    const [local, rest] = splitProps(props, ['class', 'children'])
    return <div {...rest} data-slot={slot} class={cn(className, local.class)}>{local.children}</div>
  }
}

export const Empty = createPart('empty', emptyClassName)
export const EmptyHeader = createPart('empty-header', emptyHeaderClassName)
export const EmptyTitle = createPart('empty-title', emptyTitleClassName)
export const EmptyContent = createPart('empty-content', emptyContentClassName)

export function EmptyDescription(props: ParentProps<JSX.HTMLAttributes<HTMLParagraphElement>>) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return <p {...rest} data-slot="empty-description" class={cn(emptyDescriptionClassName, local.class)}>{local.children}</p>
}

export function EmptyMedia(props: DivProps & EmptyMediaStyleProps) {
  const [local, rest] = splitProps(props, ['class', 'children', 'variant'])
  return <div {...rest} data-slot="empty-icon" data-variant={local.variant ?? 'default'} class={cn(emptyMediaClassName({ variant: local.variant }), local.class)}>{local.children}</div>
}
