import { converter, formatHex, formatHex8, parse, type Color } from 'culori'
import type {
  ColorFormat, ColorInput, ColorValue, HsbColor, HslColor, OklchColor, RgbColor,
} from './types'

const toRgb = converter('rgb')
const toHsl = converter('hsl')
const toHsv = converter('hsv')
const toOklch = converter('oklch')
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const hue = (value = 0) => ((value % 360) + 360) % 360
const round = (value: number, digits: number) => Number(value.toFixed(digits))

function parseHsb(value: string): Color | undefined {
  const match = /^hs(?:b|v)\(\s*([-+\d.]+)(?:deg)?[\s,]+([-+\d.]+)%[\s,]+([-+\d.]+)%(?:\s*[/,]\s*([-+\d.]+)%?)?\s*\)$/i.exec(value)
  if (!match) return undefined
  const rawAlpha = match[4] === undefined ? 1 : Number(match[4])
  return {
    mode: 'hsv', h: hue(Number(match[1])), s: clamp(Number(match[2]) / 100, 0, 1),
    v: clamp(Number(match[3]) / 100, 0, 1), alpha: clamp(rawAlpha > 1 ? rawAlpha / 100 : rawAlpha, 0, 1),
  }
}

function inputToColor(input: ColorInput): Color | undefined {
  if (typeof input === 'string') return parseHsb(input.trim()) ?? parse(input.trim())
  if ('toRgb' in input) {
    const value = input.toRgb()
    return { mode: 'rgb', r: value.r / 255, g: value.g / 255, b: value.b / 255, alpha: value.alpha }
  }
  if ('r' in input) return { mode: 'rgb', r: input.r / 255, g: input.g / 255, b: input.b / 255, alpha: input.alpha }
  if ('b' in input && 's' in input) return { mode: 'hsv', h: input.h, s: input.s / 100, v: input.b / 100, alpha: input.alpha }
  if ('s' in input) return { mode: 'hsl', h: input.h, s: input.s / 100, l: input.l / 100, alpha: input.alpha }
  return { mode: 'oklch', l: input.l, c: input.c, h: input.h, alpha: input.alpha }
}

function alphaOf(color: Color) { return clamp(color.alpha ?? 1, 0, 1) }
function alphaSuffix(alpha: number) { return alpha < 1 ? ` / ${round(alpha * 100, 1)}%` : '' }

export function formatColor(value: ColorValue, format: ColorFormat) {
  const alpha = value.alpha
  if (format === 'hex') return (alpha < 1 ? formatHex8 : formatHex)(inputToColor(value)!).toUpperCase()
  if (format === 'rgb') {
    const color = value.toRgb()
    return `rgb(${color.r} ${color.g} ${color.b}${alphaSuffix(alpha)})`
  }
  if (format === 'hsl') {
    const color = value.toHsl()
    return `hsl(${color.h} ${color.s}% ${color.l}%${alphaSuffix(alpha)})`
  }
  if (format === 'hsb') {
    const color = value.toHsb()
    return `hsb(${color.h} ${color.s}% ${color.b}%${alphaSuffix(alpha)})`
  }
  const color = value.toOklch()
  return `oklch(${color.l} ${color.c} ${color.h}${alphaSuffix(alpha)})`
}

export function createColorValue(input: ColorInput): ColorValue | null {
  const source = inputToColor(input)
  const rgb = source && toRgb(source)
  if (!rgb || !Number.isFinite(rgb.r) || !Number.isFinite(rgb.g) || !Number.isFinite(rgb.b)) return null
  const normalized: Color = { mode: 'rgb', r: clamp(rgb.r, 0, 1), g: clamp(rgb.g, 0, 1), b: clamp(rgb.b, 0, 1), alpha: alphaOf(rgb) }
  const value: ColorValue = {
    get alpha() { return alphaOf(normalized) },
    toHex: () => formatColor(value, 'hex'),
    toRgb: () => { const c = toRgb(normalized)!; return { r: Math.round(c.r * 255), g: Math.round(c.g * 255), b: Math.round(c.b * 255), alpha: alphaOf(c) } },
    toHsl: () => { const c = toHsl(normalized)!; return { h: round(hue(c.h), 1), s: round((c.s ?? 0) * 100, 1), l: round((c.l ?? 0) * 100, 1), alpha: alphaOf(c) } },
    toHsb: () => { const c = toHsv(normalized)!; return { h: round(hue(c.h), 1), s: round((c.s ?? 0) * 100, 1), b: round((c.v ?? 0) * 100, 1), alpha: alphaOf(c) } },
    toOklch: () => { const c = toOklch(normalized)!; return { l: round(c.l ?? 0, 4), c: round(c.c ?? 0, 4), h: round(hue(c.h), 1), alpha: alphaOf(c) } },
    toString: (format = 'oklch') => formatColor(value, format),
    equals: (other) => { const candidate = createColorValue(other); if (!candidate) return false; const a = value.toRgb(); const b = candidate.toRgb(); return a.r === b.r && a.g === b.g && a.b === b.b && Math.abs(a.alpha - b.alpha) < 0.001 },
  }
  return value
}

export function parseColor(input: string) { return createColorValue(input) }
export function convertColor(input: ColorInput, format: ColorFormat) { return createColorValue(input)?.toString(format) ?? null }
