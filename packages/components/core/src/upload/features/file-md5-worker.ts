/// <reference lib="webworker" />
import SparkMD5 from 'spark-md5'

interface CalculateMessage { id: string; file: File; chunkSize?: number }

self.addEventListener('message', async (event: MessageEvent<CalculateMessage>) => {
  const { id, file, chunkSize = 2 * 1024 * 1024 } = event.data
  const spark = new SparkMD5.ArrayBuffer()
  try {
    for (let start = 0; start < file.size; start += chunkSize) {
      spark.append(await file.slice(start, Math.min(start + chunkSize, file.size)).arrayBuffer())
      // oxlint-disable-next-line unicorn/require-post-message-target-origin -- Worker postMessage has no target origin.
      self.postMessage({ id, type: 'progress', loaded: Math.min(start + chunkSize, file.size), total: file.size })
    }
    // oxlint-disable-next-line unicorn/require-post-message-target-origin -- Worker postMessage has no target origin.
    self.postMessage({ id, type: 'success', value: spark.end() })
  } catch (error) {
    // oxlint-disable-next-line unicorn/require-post-message-target-origin -- Worker postMessage has no target origin.
    self.postMessage({ id, type: 'error', error: error instanceof Error ? error.message : String(error) })
  }
})
