export const transferRootClassName = [
  'space-y-space-xs',
  'data-[invalid=true]:[&_[data-slot=transfer-panel]]:border-danger',
  'data-[invalid=true]:[&_[data-slot=transfer-panel]]:ring-3',
  'data-[invalid=true]:[&_[data-slot=transfer-panel]]:ring-danger/20',
].join(' ')

export const transferLayoutClassName = [
  'grid min-h-80 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-stretch',
].join(' ')

export const transferPanelClassName = 'flex min-h-0 min-w-0 flex-col overflow-hidden rounded-md border border-border bg-background'
export const transferSourcePanelClassName = transferPanelClassName
export const transferTargetPanelClassName = transferPanelClassName
export const transferPanelHeaderClassName = 'flex min-h-11 shrink-0 items-center gap-2 border-b border-border bg-muted-background px-3 text-sm'
export const transferPanelBodyClassName = 'min-h-0 flex-1 overflow-auto p-2'
export const transferPanelFooterClassName = 'shrink-0 border-t border-border bg-muted-background px-3 py-2 text-sm'
export const transferActionsClassName = 'flex flex-col items-center justify-center gap-2 px-3'
export const transferMessageClassName = 'text-sm text-danger'
export const transferWarningMessageClassName = 'text-sm text-warning'
