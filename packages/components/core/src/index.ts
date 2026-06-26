export interface Subscribable<T> {
  getState(): T
  subscribe(listener: () => void): () => void
}
