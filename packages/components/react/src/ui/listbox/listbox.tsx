import {
  listboxGroupClassName,
  listboxGroupLabelClassName,
  listboxItemClassName,
  listboxItemContentClassName,
  listboxItemDescriptionClassName,
  listboxItemIndicatorClassName,
  listboxItemTitleClassName,
  listboxRootClassName,
  type ListboxItemStyleProps,
  type ListboxRootStyleProps,
} from '@fex/components-styles/listbox'
import { cn } from '@fex/utils'
import type { ComponentProps, ReactNode } from 'react'
import { CheckIcon } from '../../icon/check'
import {
  ListboxGroup as PrimitiveListboxGroup,
  ListboxGroupLabel as PrimitiveListboxGroupLabel,
  ListboxItem as PrimitiveListboxItem,
  ListboxItemIndicator as PrimitiveListboxItemIndicator,
  ListboxRoot as PrimitiveListboxRoot,
  type ListboxRootProps as PrimitiveListboxRootProps,
} from '../../primitive/listbox/listbox'

export type ListboxRootProps<TItem = unknown> = Omit<PrimitiveListboxRootProps<TItem>, 'className'> &
  ListboxRootStyleProps & {
    className?: string
  }

export function ListboxRoot<TItem = unknown>({ className, variant, ...props }: ListboxRootProps<TItem>) {
  return <PrimitiveListboxRoot {...props} className={cn(listboxRootClassName({ variant }), className)} />
}

export function ListboxGroup({ className, ...props }: ComponentProps<typeof PrimitiveListboxGroup>) {
  return <PrimitiveListboxGroup {...props} className={cn(listboxGroupClassName, className)} />
}

export function ListboxGroupLabel({ className, ...props }: ComponentProps<typeof PrimitiveListboxGroupLabel>) {
  return <PrimitiveListboxGroupLabel {...props} className={cn(listboxGroupLabelClassName, className)} />
}

export interface ListboxItemProps
  extends Omit<ComponentProps<typeof PrimitiveListboxItem>, 'className' | 'children' | 'title'>,
    ListboxItemStyleProps {
  title?: ReactNode
  description?: ReactNode
  className?: string
  children?: ReactNode
}

export function ListboxItem({ title, description, size, className, children, ...props }: ListboxItemProps) {
  return (
    <PrimitiveListboxItem {...props} className={cn(listboxItemClassName({ size }), className)}>
      {children ?? (
        <>
          <span className={listboxItemContentClassName}>
            <span className={listboxItemTitleClassName}>{title}</span>
            {description ? <span className={listboxItemDescriptionClassName}>{description}</span> : null}
          </span>
          <PrimitiveListboxItemIndicator className={listboxItemIndicatorClassName}>
            <CheckIcon />
          </PrimitiveListboxItemIndicator>
        </>
      )}
    </PrimitiveListboxItem>
  )
}

export function ListboxItemIndicator(props: ComponentProps<typeof PrimitiveListboxItemIndicator>) {
  return (
    <PrimitiveListboxItemIndicator {...props} className={cn(listboxItemIndicatorClassName, props.className)}>
      {props.children ?? <CheckIcon />}
    </PrimitiveListboxItemIndicator>
  )
}

export {
  ListboxRoot as Listbox,
  PrimitiveListboxGroup,
  PrimitiveListboxGroupLabel,
  PrimitiveListboxItem,
  PrimitiveListboxItemIndicator,
}
