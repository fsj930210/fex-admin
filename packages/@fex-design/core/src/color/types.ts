export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'hsb' | 'oklch'

export interface RgbColor { r: number; g: number; b: number; alpha: number }
export interface HslColor { h: number; s: number; l: number; alpha: number }
export interface HsbColor { h: number; s: number; b: number; alpha: number }
export interface OklchColor { l: number; c: number; h: number; alpha: number }

export interface ColorValue {
  readonly alpha: number
  toHex: () => string
  toRgb: () => RgbColor
  toHsl: () => HslColor
  toHsb: () => HsbColor
  toOklch: () => OklchColor
  toString: (format?: ColorFormat) => string
  equals: (other: ColorInput) => boolean
}

export type ColorInput = string | ColorValue | RgbColor | HslColor | HsbColor | OklchColor
