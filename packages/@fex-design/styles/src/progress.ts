export const progressRootClassName =
  'group/progress relative inline-flex items-center justify-center text-sm'
export const progressLineClassName =
  'relative h-2 w-full min-w-20 overflow-hidden rounded-full bg-[var(--progress-remaining)]'
export const progressLineRangeClassName =
  'h-full origin-left rounded-[inherit] bg-primary transition-[width] duration-300 group-data-[state=indeterminate]/progress:animate-[progress-indeterminate_1.4s_ease-in-out_infinite] data-[status=info]:bg-info data-[status=warning]:bg-warning data-[status=success]:bg-success data-[status=error]:bg-danger motion-reduce:animate-none'
export const progressCircleClassName = 'block shrink-0'
export const progressCircleTrackClassName = 'text-[var(--progress-remaining)]'
export const progressCircleRangeClassName =
  'origin-center text-primary transition-[stroke-dasharray] duration-300 ease-out [transform-box:fill-box] data-[status=info]:text-info data-[status=warning]:text-warning data-[status=success]:text-success data-[status=error]:text-danger data-[state=indeterminate]:animate-[progress-circle-indeterminate_1.4s_linear_infinite] motion-reduce:animate-none'
export const progressValueClassName =
  'absolute inset-0 flex items-center justify-center font-medium'
