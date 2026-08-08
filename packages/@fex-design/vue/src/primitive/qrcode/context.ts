import type { QrCodeModel } from '@fex-design/core/qrcode'
import { inject, type ComputedRef, type InjectionKey } from 'vue'

export interface QrCodeContextValue {
  model: ComputedRef<QrCodeModel>
}

export const qrcodeContextKey: InjectionKey<QrCodeContextValue> = Symbol('qrcode')

export function useQrCode(component: string) {
  const context = inject(qrcodeContextKey, null)
  if (!context) {
    throw new Error(component + ' must be used inside QrCodeRoot.')
  }
  return context
}
