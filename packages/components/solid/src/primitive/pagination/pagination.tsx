import { paginationClassName, paginationContentClassName, paginationEllipsisClassName, paginationLinkClassName, paginationSrOnlyClassName, paginationTextClassName, paginationTextLinkClassName } from '@fex/components-styles/pagination'
import { cn } from '@fex/utils'
import type { ComponentProps, JSX, ParentProps } from 'solid-js'
import { splitProps } from 'solid-js'
import { ChevronLeftIcon, ChevronRightIcon } from '../../icon/chevron'
import { EllipsisIcon } from '../../icon/more'

export function Pagination(props: ParentProps<JSX.HTMLAttributes<HTMLElement>>) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return <nav {...rest} role="navigation" aria-label="pagination" data-slot="pagination" class={cn(paginationClassName, local.class)}>{local.children}</nav>
}

export function PaginationContent(props: ParentProps<JSX.HTMLAttributes<HTMLUListElement>>) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return <ul {...rest} data-slot="pagination-content" class={cn(paginationContentClassName, local.class)}>{local.children}</ul>
}

export function PaginationItem(props: ParentProps<JSX.LiHTMLAttributes<HTMLLIElement>>) {
  return <li {...props} data-slot="pagination-item" />
}

type PaginationLinkProps = ParentProps<JSX.AnchorHTMLAttributes<HTMLAnchorElement>> & {
  isActive?: boolean
  size?: 'default' | 'icon'
}

export function PaginationLink(props: PaginationLinkProps) {
  const [local, rest] = splitProps(props, ['class', 'children', 'isActive', 'size'])
  return (
    <a {...rest} aria-current={local.isActive ? 'page' : undefined} data-slot="pagination-link" data-active={local.isActive ? 'true' : undefined} class={cn(paginationLinkClassName, (local.size ?? 'icon') === 'default' ? paginationTextLinkClassName : '', local.class)}>
      {local.children}
    </a>
  )
}

export function PaginationPrevious(props: ComponentProps<typeof PaginationLink> & { text?: string }) {
  const [local, rest] = splitProps(props, ['children', 'text'])
  return <PaginationLink {...rest} aria-label="Go to previous page" size="default"><ChevronLeftIcon /><span class={paginationTextClassName}>{local.text ?? 'Previous'}</span></PaginationLink>
}

export function PaginationNext(props: ComponentProps<typeof PaginationLink> & { text?: string }) {
  const [local, rest] = splitProps(props, ['children', 'text'])
  return <PaginationLink {...rest} aria-label="Go to next page" size="default"><span class={paginationTextClassName}>{local.text ?? 'Next'}</span><ChevronRightIcon /></PaginationLink>
}

export function PaginationEllipsis(props: JSX.HTMLAttributes<HTMLSpanElement>) {
  const [local, rest] = splitProps(props, ['class'])
  return <span {...rest} aria-hidden data-slot="pagination-ellipsis" class={cn(paginationEllipsisClassName, local.class)}><EllipsisIcon /><span class={paginationSrOnlyClassName}>More pages</span></span>
}
