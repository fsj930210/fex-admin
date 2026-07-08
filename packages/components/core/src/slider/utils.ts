export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function getDecimalCount(value: number) {
  if (!Number.isFinite(value)) return 0

  const str = value.toString()
  if (str.includes('e')) {
    const [coefficient, exponent] = str.split('e')
    const decimalPart = coefficient?.split('.')[1] ?? ''
    return Math.max(0, decimalPart.length - Number(exponent))
  }

  return str.split('.')[1]?.length ?? 0
}

export function roundValue(value: number, decimalCount: number) {
  const rounder = 10 ** decimalCount
  return Math.round(value * rounder) / rounder
}

export function snapValueToStep(value: number, min: number, max: number, step: number) {
  const decimalCount = getDecimalCount(step)
  return clamp(roundValue(Math.round((value - min) / step) * step + min, decimalCount), min, max)
}

export function convertValueToPercentage(value: number, min: number, max: number) {
  if (max === min) return 0
  return clamp(((value - min) / (max - min)) * 100, 0, 100)
}

export function getSliderValueFromPointer(clientX: number, clientY: number, rect: DOMRect, min: number, max: number, orientation: 'horizontal' | 'vertical') {
  const percent = orientation === 'vertical' ? (rect.bottom - clientY) / rect.height : (clientX - rect.left) / rect.width
  return min + percent * (max - min)
}

export function getNextSortedValues(prevValues: readonly number[], nextValue: number, atIndex: number) {
  const nextValues = [...prevValues]
  nextValues[atIndex] = nextValue
  return nextValues.sort((a, b) => a - b)
}

export function getClosestValueIndex(values: readonly number[], nextValue: number) {
  if (values.length <= 1) return 0
  const distances = values.map((value) => Math.abs(value - nextValue))
  return distances.indexOf(Math.min(...distances))
}

export function hasMinStepsBetweenValues(values: readonly number[], minStepsBetweenValues: number) {
  if (minStepsBetweenValues <= 0 || values.length <= 1) return true
  const stepsBetweenValues = values.slice(0, -1).map((value, index) => values[index + 1]! - value)
  return Math.min(...stepsBetweenValues) >= minStepsBetweenValues
}
