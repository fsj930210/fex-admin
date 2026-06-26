export const identity = <T>(value: T): T => value
export const isBrowser = (): boolean => typeof window !== 'undefined'

export const isDev = (): boolean => {
  type GlobalWithProcess = typeof globalThis & {
    process?: { env?: { NODE_ENV?: string } }
  }

  return (globalThis as GlobalWithProcess).process?.env?.NODE_ENV !== 'production'
}

export function isFunction<T extends (...args: never[]) => unknown = (...args: never[]) => unknown>(
  value: unknown,
): value is T {
  return typeof value === 'function'
}

export function isThenable<T = unknown>(value: unknown): value is PromiseLike<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'then' in value &&
    isFunction((value as { then?: unknown }).then)
  )
}
