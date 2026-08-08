import type { QrCodeModel } from '@fex-design/core/qrcode'
import { getContext } from 'svelte'

export const qrcodeContextKey = Symbol('QrCode')

export interface QrCodeContext {
  getModel: () => QrCodeModel
}

export function useQrCode(component: string) {
  const context = getContext<QrCodeContext>(qrcodeContextKey)
  if (!context) {
    throw new Error(component + ' must be used inside QrCodeRoot.')
  }
  return context
}
