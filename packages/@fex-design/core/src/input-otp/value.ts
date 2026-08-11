import type { InputOTPValue } from './types'

export function normalizeInputOTPValue(value: InputOTPValue | undefined, count: number): string[] {
  return Array.from({ length: count }, (_, index) => value?.[index] ?? '')
}

export function joinInputOTPValue(value: InputOTPValue): string {
  return value.join('')
}

export function inputOTPValuesEqual(left: InputOTPValue, right: InputOTPValue): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index])
}
