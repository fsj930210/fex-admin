import { cva } from 'class-variance-authority'

export const uploadRootClassName = cva(['flex flex-col gap-space-sm'])
export const uploadTriggerClassName = cva(['inline-flex min-h-9 items-center justify-center rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors hover:bg-muted-background focus-visible:ring-2 focus-visible:ring-ring aria-invalid:border-danger aria-invalid:text-danger aria-invalid:ring-2 aria-invalid:ring-danger/20 disabled:pointer-events-none disabled:opacity-50'])
export const uploadDropzoneClassName = cva(['flex min-h-32 flex-col items-center justify-center gap-space-sm rounded-md border border-dashed border-border bg-background p-space-lg text-center text-sm text-muted-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring data-[dragging]:border-primary data-[dragging]:bg-muted-background data-[invalid=true]:border-danger data-[invalid=true]:text-danger data-[invalid=true]:ring-2 data-[invalid=true]:ring-danger/20 data-[disabled]:pointer-events-none data-[disabled]:opacity-50'])
export const uploadListClassName = cva(['flex flex-col gap-space-sm'])
export const uploadItemClassName = cva(['flex items-center gap-space-sm rounded-md border border-border bg-background p-space-sm text-sm data-[status=error]:border-danger data-[status=error]:ring-2 data-[status=error]:ring-danger/20'])
export const uploadPreviewClassName = cva(['flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted-background'])
export const uploadProgressClassName = cva(['h-1.5 w-full overflow-hidden rounded-full bg-muted'])
export const uploadProgressIndicatorClassName = cva(['h-full bg-primary transition-[width] duration-200'])
