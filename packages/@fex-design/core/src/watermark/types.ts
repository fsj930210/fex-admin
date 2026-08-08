export type WatermarkContent = string | string[]

export interface WatermarkFont {
  color?: string
  fontFamily?: string
  fontSize?: number
  fontWeight?: string | number
  fontStyle?: string
}

export interface WatermarkOptions {
  content?: WatermarkContent
  width?: number
  height?: number
  rotate?: number
  gap?: [number, number]
  offset?: [number, number]
  zIndex?: number
  opacity?: number
  font?: WatermarkFont
}

export interface ResolvedWatermarkOptions {
  content: string[] | undefined
  width: number
  height: number
  rotate: number
  gap: [number, number]
  offset: [number, number]
  zIndex: number
  opacity: number
  font: Required<WatermarkFont>
}

export interface WatermarkController {
  connect(target: HTMLElement): () => void
  update(options: WatermarkOptions): void
  destroy(): void
}
