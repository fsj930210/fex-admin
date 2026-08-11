import type { InputOTPSegmentSnapshot, InputOTPValue } from './types'

export function isInputOTPComplete(
  value: InputOTPValue,
  segments: readonly InputOTPSegmentSnapshot[],
): boolean {
  return (
    segments.length > 0 &&
    segments.every(
      (segment) =>
        segment.maxLength !== undefined &&
        segment.maxLength > 0 &&
        (value[segment.index]?.length ?? 0) === segment.maxLength,
    )
  )
}
