function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function getDecimalCount(value: number) {
  if (!Number.isFinite(value)) return 0
  const valueString = value.toString().toLowerCase()
  if (!valueString.includes('e')) return valueString.split('.')[1]?.length ?? 0

  const [coefficient = '', exponent = '0'] = valueString.split('e')
  return Math.max(0, (coefficient.split('.')[1]?.length ?? 0) - Number(exponent))
}

export function normalizeRateCount(count: number | undefined) {
  return Number.isFinite(count) && count! > 0 ? Math.floor(count!) : 5
}

export function normalizeRateStep(step: number | undefined) {
  return Number.isFinite(step) && step! > 0 ? step! : 1
}

/**
 * Display values preserve server-provided fractions. Interaction snapping is a
 * separate operation so a read-only value such as 4.37 is not reduced by step.
 */
export function normalizeRateValue(value: number | undefined, count: number) {
  return Number.isFinite(value) ? clamp(value!, 0, count) : 0
}

/**
 * Pointer regions use upper-bound buckets: with step 0.1, positions in
 * (0, 0.1] select 0.1. Integer scaling avoids observable floating-point tails.
 */
export function snapRateValue(value: number, step: number, count: number) {
  const decimalCount = Math.max(getDecimalCount(step), getDecimalCount(count))
  const scale = 10 ** decimalCount
  const scaledStep = Math.max(1, Math.round(step * scale))
  const scaledValue = normalizeRateValue(value, count) * scale
  // Arithmetic such as 4.2 + 0.1 can land just above an exact bucket boundary.
  // A tiny epsilon in scaled units keeps that value in the intended bucket.
  const snapped = Math.ceil((scaledValue - 1e-10) / scaledStep) * scaledStep
  return normalizeRateValue(snapped / scale, count)
}

export function getRateItemFill(value: number, index: number) {
  return clamp(value - index, 0, 1)
}

export function getRateValueFromPointer(index: number, ratio: number, step: number, count: number) {
  return snapRateValue(index + clamp(ratio, 0, 1), step, count)
}
