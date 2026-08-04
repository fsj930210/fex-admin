export const timePickerRootClassName = 'flex w-full min-w-0'

export const timePickerColumnClassName = [
  'relative h-56 min-w-0 flex-1',
  'border-r border-border last:border-r-0',
  'data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50',
].join(' ')

export const timePickerColumnViewportClassName = 'h-full overscroll-contain outline-none'

export const timePickerColumnItemClassName = [
  'flex h-8 w-full cursor-pointer select-none items-center justify-center px-3 text-sm text-foreground outline-none transition-colors',
  'hover:bg-muted-background focus-visible:bg-muted-background',
  'data-[selected=true]:bg-primary/10 data-[selected=true]:font-medium data-[selected=true]:text-primary',
  'data-[active=true]:bg-muted-background',
  'data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-40',
].join(' ')

export const timePickerColumnSpacerClassName = 'pointer-events-none h-48'
