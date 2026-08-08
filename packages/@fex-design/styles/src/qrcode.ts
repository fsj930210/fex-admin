export const qrcodeRootClassName = [
  'relative inline-grid shrink-0 place-items-center overflow-hidden',
  'rounded-md bg-background text-foreground',
].join(' ')

export const qrcodeSurfaceClassName = 'block size-full shrink-0'

export const qrcodeBackgroundClassName = 'fill-[var(--qrcode-bg-color,#fff)]'

export const qrcodeModulesClassName = 'fill-[var(--qrcode-color,#000)]'

export const qrcodeCenterClassName = 'pointer-events-auto block overflow-visible'

export const qrcodeOverlayClassName = [
  'absolute inset-0 z-20 grid place-items-center bg-background/80 text-center backdrop-blur-[1px]',
  'text-sm text-foreground',
].join(' ')
