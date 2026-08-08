export type QrCodeErrorLevel = 'L' | 'M' | 'Q' | 'H'

export interface QrCodeModelOptions {
  value: string
  errorLevel?: QrCodeErrorLevel | undefined
  margin?: number | undefined
  size?: number | undefined
  color?: string | undefined
  bgColor?: string | undefined
}

export interface QrCodeModel {
  value: string
  errorLevel: QrCodeErrorLevel
  margin: number
  size: number
  color: string
  bgColor: string
  matrix: boolean[][]
  moduleCount: number
  viewBoxSize: number
  version: number
}

export interface QrCodeModuleCell {
  x: number
  y: number
}

export interface QrCodeModuleExcludeRect {
  x: number
  y: number
  width: number
  height: number
}
