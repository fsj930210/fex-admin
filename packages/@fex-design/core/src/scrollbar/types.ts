export type ScrollbarAxis = 'x' | 'y'
export type ScrollbarVisibility = 'auto' | 'always' | 'hidden'
export type ScrollbarAutoHide = 'never' | 'scroll' | 'move' | 'leave'
export type ScrollbarClickScroll = false | 'page' | 'jump'

export interface ScrollbarOptions {
  visibility?: ScrollbarVisibility | undefined
  autoHide?: ScrollbarAutoHide | undefined
  autoHideDelay?: number | undefined
  dragScroll?: boolean | undefined
  clickScroll?: ScrollbarClickScroll | undefined
  minThumbSize?: number | undefined
  disabled?: boolean | undefined
  onScroll?: ((detail: ScrollbarScrollDetail) => void) | undefined
}

export interface ScrollbarScrollDetail {
  scrollLeft: number
  scrollTop: number
}

export interface ScrollbarController {
  connect(root: HTMLElement): () => void
  update(): void
  scrollTo(options: ScrollToOptions): void
  scrollBy(options: ScrollToOptions): void
  destroy(): void
}
