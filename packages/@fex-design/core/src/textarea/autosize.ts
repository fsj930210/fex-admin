export interface TextareaAutoSizeOptions {
  minRows?: number | undefined
  maxRows?: number | undefined
}

export type TextareaAutoSize = boolean | TextareaAutoSizeOptions

export interface TextareaAutoSizeResult {
  height: number
  overflowY: 'auto' | 'hidden'
}

export function normalizeTextareaAutoSize(autoSize: TextareaAutoSize | undefined) {
  if (!autoSize) return null
  if (autoSize === true) return { minRows: 1, maxRows: undefined }
  return {
    minRows: autoSize.minRows ?? 1,
    maxRows: autoSize.maxRows,
  }
}

export function syncTextareaAutoSize(
  element: HTMLTextAreaElement,
  autoSize: TextareaAutoSize | undefined,
) {
  const options = normalizeTextareaAutoSize(autoSize)
  if (!options) return null

  const computedStyle = window.getComputedStyle(element)
  const lineHeight = readPixelValue(computedStyle.lineHeight) || measureLineHeight(element)
  const padding =
    readPixelValue(computedStyle.paddingTop) + readPixelValue(computedStyle.paddingBottom)
  const border =
    readPixelValue(computedStyle.borderTopWidth) + readPixelValue(computedStyle.borderBottomWidth)
  const minRows = Math.max(1, options.minRows)
  const maxRows =
    options.maxRows === undefined ? Number.POSITIVE_INFINITY : Math.max(minRows, options.maxRows)
  const minHeight = lineHeight * minRows + padding + border
  const maxHeight = Number.isFinite(maxRows)
    ? lineHeight * maxRows + padding + border
    : Number.POSITIVE_INFINITY

  element.style.height = 'auto'
  const contentHeight = element.scrollHeight + border
  const height = Math.min(Math.max(contentHeight, minHeight), maxHeight)
  const overflowY = contentHeight > maxHeight ? 'auto' : 'hidden'
  element.style.height = `${height}px`
  element.style.overflowY = overflowY

  return { height, overflowY } satisfies TextareaAutoSizeResult
}

function readPixelValue(value: string) {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function measureLineHeight(element: HTMLTextAreaElement) {
  const document = element.ownerDocument
  const probe = document.createElement('span')
  probe.textContent = 'x'
  probe.style.visibility = 'hidden'
  probe.style.position = 'absolute'
  probe.style.font = window.getComputedStyle(element).font
  const container = document.body ?? element.parentElement
  if (!container) return 16
  container.append(probe)
  const height = probe.getBoundingClientRect().height
  probe.remove()
  return height || 16
}
