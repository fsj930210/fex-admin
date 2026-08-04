import type { UploadFeatureRegistration } from '../feature-types'

export interface DropFeatureApi {
  getDragging(): boolean
  subscribe(listener: () => void): () => void
  dragEnter(): void
  dragLeave(): void
  drop(files: readonly File[]): Promise<void>
  reset(): void
}
export function dropFeature<TResponse = unknown>(): UploadFeatureRegistration<TResponse> {
  return {
    options: {},
    feature: {
      id: 'drop',
      setup(context) {
        let dragging = false
        let depth = 0
        const listeners = new Set<() => void>()
        const notify = () => {
          for (const listener of listeners) listener()
        }
        return {
          getDragging: () => dragging,
          subscribe(listener) {
            listeners.add(listener)
            return () => listeners.delete(listener)
          },
          dragEnter() {
            depth++
            if (!dragging) {
              dragging = true
              notify()
            }
          },
          dragLeave() {
            depth = Math.max(0, depth - 1)
            if (!depth && dragging) {
              dragging = false
              notify()
            }
          },
          async drop(files) {
            depth = 0
            dragging = false
            notify()
            await context.addFiles(files)
          },
          reset() {
            depth = 0
            dragging = false
            notify()
          },
        } satisfies DropFeatureApi
      },
    },
  }
}
