import {
  createQrCodeModel,
  getQrCodeCenterExcludeRect,
  getQrCodeCenterRect,
  getQrCodeModuleCells,
  getQrCodeSvgPath,
  type QrCodeErrorLevel,
  type QrCodeModel,
  type QrCodeModelOptions,
  type QrCodeModuleExcludeRect,
} from '@fex-design/core/qrcode'
import {
  qrcodeBackgroundClassName,
  qrcodeCenterClassName,
  qrcodeModulesClassName,
  qrcodeOverlayClassName,
  qrcodeRootClassName,
  qrcodeSurfaceClassName,
} from '@fex-design/styles/qrcode'
import { cn } from '@fex/utils'
import {
  createContext,
  use,
  useEffect,
  useMemo,
  useRef,
  type CanvasHTMLAttributes,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
  type Ref,
  type SVGAttributes,
} from 'react'

export interface QrCodeContextValue {
  model: QrCodeModel
}

const QrCodeContext = createContext<QrCodeContextValue | null>(null)

export function useQrCode(component = 'useQrCode') {
  const context = use(QrCodeContext)
  if (!context) {
    throw new Error(component + ' must be used inside QrCodeRoot.')
  }
  return context
}

export interface QrCodeRootProps
  extends Omit<ComponentProps<'div'>, 'children' | 'color' | 'defaultValue'>,
    QrCodeModelOptions {
  children?: ReactNode
  ref?: Ref<HTMLDivElement>
}

export function QrCodeRoot({
  value,
  errorLevel,
  margin,
  size,
  color,
  bgColor,
  className,
  style,
  children,
  ref,
  ...props
}: QrCodeRootProps) {
  // Encoding builds the complete module matrix, so memoization keeps repeated parent renders cheap.
  const model = useMemo(
    () => createQrCodeModel({ value, errorLevel, margin, size, color, bgColor }),
    [value, errorLevel, margin, size, color, bgColor],
  )
  const cssVars = {
    '--qrcode-size': model.size + 'px',
    '--qrcode-color': model.color,
    '--qrcode-bg-color': model.bgColor,
    ...style,
  } as CSSProperties

  return (
    <QrCodeContext value={{ model }}>
      <div
        {...props}
        ref={ref}
        data-slot="qrcode"
        className={cn(qrcodeRootClassName, className)}
        style={{ width: model.size, height: model.size, ...cssVars }}
      >
        {children}
      </div>
    </QrCodeContext>
  )
}

export interface QrCodeSvgProps extends SVGAttributes<SVGSVGElement> {
  ref?: Ref<SVGSVGElement>
}

export function QrCodeSvg({ className, children, ref, ...props }: QrCodeSvgProps) {
  const { model } = useQrCode('QrCodeSvg')

  return (
    <svg
      {...props}
      ref={ref}
      role={props.role ?? 'img'}
      aria-label={props['aria-label'] ?? 'QR code'}
      data-slot="qrcode-svg"
      className={cn(qrcodeSurfaceClassName, className)}
      viewBox={'0 0 ' + model.viewBoxSize + ' ' + model.viewBoxSize}
      width={model.size}
      height={model.size}
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  )
}

export interface QrCodeBackgroundProps extends SVGAttributes<SVGRectElement> {
  ref?: Ref<SVGRectElement>
}

export function QrCodeBackground({ className, ref, ...props }: QrCodeBackgroundProps) {
  const { model } = useQrCode('QrCodeBackground')

  return (
    <rect
      {...props}
      ref={ref}
      data-slot="qrcode-background"
      className={cn(qrcodeBackgroundClassName, className)}
      width={model.viewBoxSize}
      height={model.viewBoxSize}
    />
  )
}

export interface QrCodeModulesProps extends SVGAttributes<SVGPathElement> {
  centerSize?: number
  exclude?: QrCodeModuleExcludeRect
  ref?: Ref<SVGPathElement>
}

export function QrCodeModules({
  centerSize,
  exclude,
  className,
  ref,
  ...props
}: QrCodeModulesProps) {
  const { model } = useQrCode('QrCodeModules')
  const centerExclude = centerSize ? getQrCodeCenterExcludeRect(model, centerSize) : undefined
  const path = getQrCodeSvgPath(model, exclude ?? centerExclude)

  return (
    <path
      {...props}
      ref={ref}
      data-slot="qrcode-modules"
      className={cn(qrcodeModulesClassName, className)}
      d={path}
    />
  )
}

export interface QrCodeCanvasProps extends CanvasHTMLAttributes<HTMLCanvasElement> {
  centerSize?: number
  exclude?: QrCodeModuleExcludeRect
  ref?: Ref<HTMLCanvasElement>
}

export function QrCodeCanvas({
  centerSize,
  exclude,
  className,
  ref,
  ...props
}: QrCodeCanvasProps) {
  const { model } = useQrCode('QrCodeCanvas')
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Canvas is an imperative browser API, so this effect only synchronizes the external drawing surface.
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const ratio = window.devicePixelRatio || 1
    const centerExclude = centerSize ? getQrCodeCenterExcludeRect(model, centerSize) : undefined
    const cells = getQrCodeModuleCells(model, exclude ?? centerExclude)
    const moduleSize = model.size / model.viewBoxSize

    canvas.width = model.size * ratio
    canvas.height = model.size * ratio
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    context.fillStyle = model.bgColor
    context.fillRect(0, 0, model.size, model.size)
    context.fillStyle = model.color
    for (const cell of cells) {
      context.fillRect(cell.x * moduleSize, cell.y * moduleSize, moduleSize, moduleSize)
    }
  }, [model, centerSize, exclude])

  return (
    <canvas
      {...props}
      ref={(node) => {
        canvasRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as { current: HTMLCanvasElement | null }).current = node
      }}
      data-slot="qrcode-canvas"
      className={cn(qrcodeSurfaceClassName, className)}
      style={{ width: model.size, height: model.size, ...props.style }}
    />
  )
}

export interface QrCodeCenterProps extends SVGAttributes<SVGSVGElement> {
  size?: number
  ref?: Ref<SVGSVGElement>
}

export function QrCodeCenter({
  size = 40,
  className,
  style,
  children,
  ref,
  ...props
}: QrCodeCenterProps) {
  const { model } = useQrCode('QrCodeCenter')
  const rect = getQrCodeCenterRect(model, size)

  return (
    <svg
      {...props}
      ref={ref}
      data-slot="qrcode-center"
      className={cn(qrcodeCenterClassName, className)}
      style={style}
      x={rect.x}
      y={rect.y}
      width={rect.width}
      height={rect.height}
      viewBox="0 0 100 100"
      overflow="visible"
    >
      {children}
    </svg>
  )
}

export interface QrCodeOverlayProps extends ComponentProps<'div'> {
  ref?: Ref<HTMLDivElement>
}

export function QrCodeOverlay({ className, ref, ...props }: QrCodeOverlayProps) {
  return (
    <div
      {...props}
      ref={ref}
      data-slot="qrcode-overlay"
      className={cn(qrcodeOverlayClassName, className)}
    />
  )
}

export const QrCode = {
  Root: QrCodeRoot,
  Svg: QrCodeSvg,
  Canvas: QrCodeCanvas,
  Background: QrCodeBackground,
  Modules: QrCodeModules,
  Center: QrCodeCenter,
  Overlay: QrCodeOverlay,
}

export type { QrCodeErrorLevel, QrCodeModel, QrCodeModuleExcludeRect }
