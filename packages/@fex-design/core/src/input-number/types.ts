export interface InputNumberFormatInfo {
  userTyping: boolean
  input: string
}

export type InputNumberParser = (text: string) => number | undefined
export type InputNumberFormatter = (
  value: number | undefined,
  info: InputNumberFormatInfo,
) => string

export interface InputNumberConstraints {
  min?: number | undefined
  max?: number | undefined
  step?: number | undefined
  precision?: number | undefined
}
