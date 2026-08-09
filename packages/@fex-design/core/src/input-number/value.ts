import type { InputNumberConstraints, InputNumberFormatter, InputNumberParser } from './types'

export const defaultInputNumberParser: InputNumberParser = (text) => {
  const normalized = text.trim()
  if (normalized === '') return undefined
  const value = Number(normalized)
  return Number.isFinite(value) ? value : undefined
}

export const defaultInputNumberFormatter: InputNumberFormatter = (value) =>
  value === undefined ? '' : String(value)

function decimalPlaces(value: number) {
  const [, fraction = '', exponent = '0'] =
    String(value)
      .toLowerCase()
      .match(/^.*?(?:\.(\d+))?(?:e([+-]?\d+))?$/) ?? []
  return Math.max(0, fraction.length - Number(exponent))
}

export function resolveInputNumberPrecision(value: number, constraints: InputNumberConstraints) {
  return (
    constraints.precision ?? Math.max(decimalPlaces(value), decimalPlaces(constraints.step ?? 1))
  )
}

export function roundInputNumber(value: number, precision: number) {
  const factor = 10 ** precision
  return Math.round((value + Number.EPSILON) * factor) / factor
}

export function normalizeInputNumber(value: number, constraints: InputNumberConstraints) {
  let nextValue = value
  if (constraints.min !== undefined) nextValue = Math.max(constraints.min, nextValue)
  if (constraints.max !== undefined) nextValue = Math.min(constraints.max, nextValue)
  return roundInputNumber(nextValue, resolveInputNumberPrecision(nextValue, constraints))
}

export function stepInputNumber(
  value: number | undefined,
  direction: 'increment' | 'decrement',
  constraints: InputNumberConstraints,
) {
  const step = constraints.step && constraints.step > 0 ? constraints.step : 1
  const base = value ?? (direction === 'increment' ? constraints.min : constraints.max) ?? 0
  return normalizeInputNumber(base + (direction === 'increment' ? step : -step), constraints)
}

export function isInputNumberOutOfRange(
  value: number | undefined,
  constraints: InputNumberConstraints,
) {
  if (value === undefined) return false
  return (
    (constraints.min !== undefined && value < constraints.min) ||
    (constraints.max !== undefined && value > constraints.max)
  )
}
