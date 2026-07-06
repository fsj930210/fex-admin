import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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

export function shallowEqualObject(left: object, right: object): boolean {
  if (Object.is(left, right)) {
    return true
  }

  const leftKeys = Object.keys(left)
  const rightKeys = Object.keys(right)
  if (leftKeys.length !== rightKeys.length) {
    return false
  }

  const leftRecord = left as Record<string, unknown>
  const rightRecord = right as Record<string, unknown>
  return leftKeys.every((key) => Object.is(leftRecord[key], rightRecord[key]))
}
