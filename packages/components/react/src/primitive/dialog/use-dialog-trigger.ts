import type { MouseEvent } from 'react'
import { useMemoizedFn } from '../../hooks/use-memoized-fn'
import type { DialogTriggerProps } from './dialog'
import { useDialog } from './use-dialog'

export function useDialogTrigger({ ref, onClick, ...props }: Omit<DialogTriggerProps, 'children'>) {
  const { contentId, dialog, snapshot, triggerRef } = useDialog('useDialogTrigger')
  const setTrigger = useMemoizedFn((element: HTMLButtonElement | null) => {
    triggerRef.current = element
    if (typeof ref === 'function') ref(element)
    else if (ref && 'current' in ref) ref.current = element
  })

  return {
    snapshot,
    props: {
      ...props,
      ref: setTrigger,
      type: props.type ?? 'button',
      'aria-haspopup': 'dialog' as const,
      'aria-expanded': snapshot.open,
      'aria-controls': snapshot.open ? contentId : undefined,
      'data-state': snapshot.open ? 'open' as const : 'closed' as const,
      onClick: (event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (!event.defaultPrevented) dialog.toggle({ reason: 'trigger-click', event: event.nativeEvent })
      },
    },
  }
}
