export type BuiltinToastVariant = 'default' | 'success' | 'info' | 'warning' | 'error' | 'loading'
export type ToastPlacement = 'top-left' | 'top' | 'top-right' | 'bottom-left' | 'bottom' | 'bottom-right'

export type ToastInput<TContent = unknown> = TContent | ToastOptions<TContent>

export interface ToastOptions<TContent = unknown> {
  id?: string
  variant?: BuiltinToastVariant | string
  title?: TContent | undefined
  description?: TContent | undefined
  icon?: TContent | null | undefined
  action?: TContent | undefined
  placement?: ToastPlacement
  duration?: number
  closable?: boolean
}

export interface ToastItem<TContent = unknown> {
  id: string
  variant: BuiltinToastVariant | string
  title?: TContent | undefined
  description?: TContent | undefined
  icon?: TContent | null | undefined
  action?: TContent | undefined
  placement: ToastPlacement
  duration: number
  closable: boolean
  createdAt: number
  remaining: number
  startedAt: number
  paused: boolean
}

export interface ToastConfig {
  max: number
  duration: number
  placement: ToastPlacement
}

export interface ToastSnapshot<TContent = unknown> {
  items: ToastItem<TContent>[]
  config: ToastConfig
}

export interface ToastManager<TContent = unknown> {
  getSnapshot: () => ToastSnapshot<TContent>
  subscribe: (listener: () => void) => () => void
  show: (input: ToastInput<TContent>) => string
  success: (input: ToastInput<TContent>) => string
  info: (input: ToastInput<TContent>) => string
  warning: (input: ToastInput<TContent>) => string
  error: (input: ToastInput<TContent>) => string
  loading: (input: ToastInput<TContent>) => string
  update: (id: string, options: Partial<ToastOptions<TContent>>) => void
  dismiss: (id?: string) => void
  destroy: (id?: string) => void
  remove: (id?: string) => void
  clear: () => void
  pause: (id: string) => void
  resume: (id: string) => void
  configure: (config: Partial<ToastConfig>) => void
}
