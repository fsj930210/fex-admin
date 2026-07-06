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
import type { JSX, ParentProps } from 'solid-js'
import { splitProps } from 'solid-js'
import { CheckIcon } from '../../icon/check'
import {
  ListboxGroup as PrimitiveListboxGroup,
  ListboxGroupLabel as PrimitiveListboxGroupLabel,
  ListboxItem as PrimitiveListboxItem,
  ListboxItemIndicator as PrimitiveListboxItemIndicator,
  ListboxRoot as PrimitiveListboxRoot,
  type ListboxRootProps as PrimitiveListboxRootProps,
} from '../../primitive/listbox/listbox'

export type ListboxRootProps<TItem = unknown> = PrimitiveListboxRootProps<TItem> &
  ListboxRootStyleProps & {
    class?: string
  }

export function ListboxRoot<TItem = unknown>(props: ListboxRootProps<TItem>) {
  const [local, rest] = splitProps(props, ['class', 'variant'])
  return <PrimitiveListboxRoot {...rest} class={cn(listboxRootClassName({ variant: local.variant }), local.class)} />
}

export function ListboxGroup(props: ParentProps<JSX.HTMLAttributes<HTMLDivElement>>) {
  const [local, rest] = splitProps(props, ['class'])
  return <PrimitiveListboxGroup {...rest} class={cn(listboxGroupClassName, local.class)} />
}

export function ListboxGroupLabel(props: ParentProps<JSX.HTMLAttributes<HTMLDivElement>>) {
  const [local, rest] = splitProps(props, ['class'])
  return <PrimitiveListboxGroupLabel {...rest} class={cn(listboxGroupLabelClassName, local.class)} />
}

export interface ListboxItemProps
  extends ParentProps<Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onSelect' | 'title'>>,
    ListboxItemStyleProps {
  value: string | number
  disabled?: boolean
  title?: JSX.Element
  description?: JSX.Element
  onSelect?: (value: string | number) => void
}

export function ListboxItem(props: ListboxItemProps) {
  const [local, rest] = splitProps(props, ['class', 'size', 'title', 'description', 'children'])
  return (
    <PrimitiveListboxItem {...rest} class={cn(listboxItemClassName({ size: local.size }), local.class)}>
      {local.children ?? (
        <>
          <span class={listboxItemContentClassName}>
            <span class={listboxItemTitleClassName}>{local.title}</span>
            {local.description ? <span class={listboxItemDescriptionClassName}>{local.description}</span> : null}
          </span>
          <PrimitiveListboxItemIndicator class={listboxItemIndicatorClassName}>
            <CheckIcon />
          </PrimitiveListboxItemIndicator>
        </>
      )}
    </PrimitiveListboxItem>
  )
}

export function ListboxItemIndicator(props: ParentProps<JSX.HTMLAttributes<HTMLSpanElement>>) {
  const [local, rest] = splitProps(props, ['class'])
  return (
    <PrimitiveListboxItemIndicator {...rest} class={cn(listboxItemIndicatorClassName, local.class)}>
      {props.children ?? <CheckIcon />}
    </PrimitiveListboxItemIndicator>
  )
}

export { ListboxRoot as Listbox }
