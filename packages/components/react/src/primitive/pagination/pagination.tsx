import {
  paginationClassName,
  paginationContentClassName,
  paginationEllipsisClassName,
  paginationLinkClassName,
  paginationSrOnlyClassName,
  paginationTextClassName,
  paginationTextLinkClassName,
} from '@fex/components-styles/pagination'
import { cn } from '@fex/utils'
import type { ComponentProps } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '../../icon/chevron'
import { EllipsisIcon } from '../../icon/more'

export function Pagination({ className, ...props }: ComponentProps<'nav'>) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn(paginationClassName, className)}
      {...props}
    />
  )
}

export function PaginationContent({ className, ...props }: ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn(paginationContentClassName, className)}
      {...props}
    />
  )
}

export function PaginationItem({ ...props }: ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
  size?: 'default' | 'icon'
} & ComponentProps<'a'>

export function PaginationLink({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? 'page' : undefined}
      data-slot="pagination-link"
      data-active={isActive ? 'true' : undefined}
      className={cn(
        paginationLinkClassName,
        size === 'default' ? paginationTextLinkClassName : '',
        className,
      )}
      {...props}
    />
  )
}

export function PaginationPrevious({
  className,
  text = 'Previous',
  ...props
}: ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={className}
      {...props}
    >
      <ChevronLeftIcon />
      <span className={paginationTextClassName}>{text}</span>
    </PaginationLink>
  )
}

export function PaginationNext({
  className,
  text = 'Next',
  ...props
}: ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink aria-label="Go to next page" size="default" className={className} {...props}>
      <span className={paginationTextClassName}>{text}</span>
      <ChevronRightIcon />
    </PaginationLink>
  )
}

export function PaginationEllipsis({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(paginationEllipsisClassName, className)}
      {...props}
    >
      <EllipsisIcon />
      <span className={paginationSrOnlyClassName}>More pages</span>
    </span>
  )
}
