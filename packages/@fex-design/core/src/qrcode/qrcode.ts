import { encode } from 'uqr'
import type {
  QrCodeErrorLevel,
  QrCodeModel,
  QrCodeModelOptions,
  QrCodeModuleCell,
  QrCodeModuleExcludeRect,
} from './types'

const defaultSize = 160
const defaultMargin = 4
const defaultColor = '#000000'
const defaultBgColor = '#ffffff'
const defaultErrorLevel: QrCodeErrorLevel = 'M'

function normalizeNumber(value: number | undefined, fallback: number, min: number) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return fallback
  }
  return Math.max(min, value)
}

function isCellExcluded(cell: QrCodeModuleCell, exclude?: QrCodeModuleExcludeRect) {
  return Boolean(
    exclude &&
      cell.x >= exclude.x &&
      cell.x < exclude.x + exclude.width &&
      cell.y >= exclude.y &&
      cell.y < exclude.y + exclude.height,
  )
}

export function createQrCodeModel(options: QrCodeModelOptions): QrCodeModel {
  const value = options.value
  const errorLevel = options.errorLevel ?? defaultErrorLevel
  const margin = Math.round(normalizeNumber(options.margin, defaultMargin, 0))
  const size = normalizeNumber(options.size, defaultSize, 1)
  const color = options.color ?? defaultColor
  const bgColor = options.bgColor ?? defaultBgColor
  const code = encode(value, { ecc: errorLevel, border: 0 })
  const matrix = code.data.map((row) => [...row])
  const moduleCount = code.size

  return {
    value,
    errorLevel,
    margin,
    size,
    color,
    bgColor,
    matrix,
    moduleCount,
    viewBoxSize: moduleCount + margin * 2,
    version: code.version,
  }
}

export function getQrCodeModuleCells(
  model: QrCodeModel,
  exclude?: QrCodeModuleExcludeRect,
): QrCodeModuleCell[] {
  const cells: QrCodeModuleCell[] = []

  model.matrix.forEach((row, y) => {
    row.forEach((dark, x) => {
      const cell = { x: x + model.margin, y: y + model.margin }
      if (dark && !isCellExcluded(cell, exclude)) {
        cells.push(cell)
      }
    })
  })

  return cells
}

export function getQrCodeSvgPath(model: QrCodeModel, exclude?: QrCodeModuleExcludeRect) {
  return getQrCodeModuleCells(model, exclude)
    .map((cell) => 'M' + cell.x + ',' + cell.y + 'h1v1h-1z')
    .join('')
}

export function getQrCodeCenterRect(model: QrCodeModel, centerSize: number) {
  const width = (normalizeNumber(centerSize, 0, 0) / model.size) * model.viewBoxSize
  const start = (model.viewBoxSize - width) / 2

  return {
    x: start,
    y: start,
    width,
    height: width,
  } satisfies QrCodeModuleExcludeRect
}

export function getQrCodeCenterExcludeRect(model: QrCodeModel, centerSize: number) {
  const modules = Math.ceil(getQrCodeCenterRect(model, centerSize).width)
  const width = modules % 2 === model.viewBoxSize % 2 ? modules : modules + 1
  const start = (model.viewBoxSize - width) / 2

  return {
    x: start,
    y: start,
    width,
    height: width,
  } satisfies QrCodeModuleExcludeRect
}

export type {
  QrCodeErrorLevel,
  QrCodeModel,
  QrCodeModelOptions,
  QrCodeModuleCell,
  QrCodeModuleExcludeRect,
}
