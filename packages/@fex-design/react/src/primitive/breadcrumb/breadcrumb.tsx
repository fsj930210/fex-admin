import {
  breadcrumbClassName,
  breadcrumbEllipsisClassName,
  breadcrumbItemClassName,
  breadcrumbLinkClassName,
  breadcrumbListClassName,
  breadcrumbPageClassName,
  breadcrumbSeparatorClassName,
} from '@fex-design/styles/breadcrumb'
import { cn } from '@fex/utils'
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode, Ref } from 'react'

export function Breadcrumb({ className, children, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <nav
      {...props}
      aria-label={props['aria-label'] ?? 'Breadcrumb'}
      className={cn(breadcrumbClassName({}), className)}
      data-slot="breadcrumb"
    >
      {children}
    </nav>
  )
}
export function BreadcrumbList({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLOListElement>) {
  return (
    <ol {...props} className={cn(breadcrumbListClassName, className)} data-slot="breadcrumb-list">
      {children}
    </ol>
  )
}
export function BreadcrumbItem({ className, children, ...props }: HTMLAttributes<HTMLLIElement>) {
  return (
    <li {...props} className={cn(breadcrumbItemClassName, className)} data-slot="breadcrumb-item">
      {children}
    </li>
  )
}

export type BreadcrumbLinkRenderProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'children'
> & { 'data-slot': string; ref?: Ref<HTMLAnchorElement> }
export interface BreadcrumbLinkProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'children'
> {
  children?: ReactNode | ((props: BreadcrumbLinkRenderProps) => ReactNode)
}
export function BreadcrumbLink({
  children,
  className,
  ref,
  ...props
}: BreadcrumbLinkProps & { ref?: Ref<HTMLAnchorElement> }) {
  const linkProps: BreadcrumbLinkRenderProps = {
    ...props,
    className: cn(breadcrumbLinkClassName, className),
    'data-slot': 'breadcrumb-link',
    ref,
  }
  return typeof children === 'function' ? children(linkProps) : <a {...linkProps}>{children}</a>
}
export function BreadcrumbPage({ className, children, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      {...props}
      aria-current={props['aria-current'] ?? 'page'}
      className={cn(breadcrumbPageClassName, className)}
      data-slot="breadcrumb-page"
    >
      {children}
    </span>
  )
}
export function BreadcrumbSeparator({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLLIElement>) {
  return (
    <li
      {...props}
      aria-hidden="true"
      className={cn(breadcrumbSeparatorClassName, className)}
      data-slot="breadcrumb-separator"
    >
      {children ?? '/'}
    </li>
  )
}
export function BreadcrumbEllipsis({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      {...props}
      aria-hidden="true"
      className={cn(breadcrumbEllipsisClassName, className)}
      data-slot="breadcrumb-ellipsis"
    >
      {children ?? '...'}
    </span>
  )
}
