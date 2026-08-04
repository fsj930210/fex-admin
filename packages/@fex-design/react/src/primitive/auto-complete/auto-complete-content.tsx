import {
  autoCompleteContentClassName,
  autoCompleteStateClassName,
} from '@fex-design/styles/auto-complete'
import { cn } from '@fex/utils'
import { type ComponentProps, type ReactNode } from 'react'
import { Empty, EmptyDescription } from '../empty/empty'
import { PopoverContent, PopoverPortal } from '../popover/popover'
import { Spinner } from '../../ui/spinner/spinner'
import { AutoCompleteList } from './auto-complete-list'
import { useAutoComplete } from './use-auto-complete'

export interface AutoCompleteContentProps extends ComponentProps<'div'> {
  emptyContent?: ReactNode
  loadingContent?: ReactNode
}

export function AutoCompleteContent({
  children,
  className,
  emptyContent,
  loadingContent,
  style,
  ...props
}: AutoCompleteContentProps) {
  const autoComplete = useAutoComplete()
  let content = children
  if (content === undefined && autoComplete.loading)
    content = loadingContent ?? (
      <div className={autoCompleteStateClassName}>
        <Spinner />
      </div>
    )
  else if (content === undefined && !autoComplete.items.length)
    content = emptyContent ?? (
      <Empty>
        <EmptyDescription>No suggestions</EmptyDescription>
      </Empty>
    )
  else if (content === undefined) content = <AutoCompleteList />
  return (
    <PopoverPortal>
      <PopoverContent
        {...props}
        className={cn(autoCompleteContentClassName, className)}
        style={{
          width: 'var(--auto-complete-content-width,var(--floating-reference-width))',
          maxWidth: 'var(--auto-complete-content-width,var(--floating-reference-width))',
          ...style,
        }}
      >
        {content}
      </PopoverContent>
    </PopoverPortal>
  )
}
