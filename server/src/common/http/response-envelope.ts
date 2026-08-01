export interface ResponseEnvelope<T> {
  code: number
  message: string
  data: T
}
