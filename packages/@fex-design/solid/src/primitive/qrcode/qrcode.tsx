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
  createEffect,
  createMemo,
  splitProps,
  useContext,
  type Accessor,
  type JSX,
  type ParentProps,
} from 'solid-js'

export interface QrCodeContextValue {
  model: Accessor<QrCodeModel>
}

const QrCodeContext = createContext<QrCodeContextValue>()

export function useQrCode(component = 'useQrCode') {
  const context = useContext(QrCodeContext)
  if (!context) {
    throw new Error(component + ' must be used inside QrCodeRoot.')
  }
  return context
}

export type QrCodeRootProps = ParentProps<
  Omit<JSX.HTMLAttributes<HTMLDivElement>, 'color'> & QrCodeModelOptions
>

export function QrCodeRoot(props: QrCodeRootProps) {
  const [local, rest] = splitProps(props, [
    'value',
    'errorLevel',
    'margin',
    'size',
    'color',
    'bgColor',
    'class',
    'style',
    'children',
  ])
  const model = createMemo(() =>
    createQrCodeModel({
      value: local.value,
      errorLevel: local.errorLevel,
      margin: local.margin,
      size: local.size,
      color: local.color,
      bgColor: local.bgColor,
    }),
  )

  return (
    <QrCodeContext.Provider value={{ model }}>
      <div
        {...rest}
        data-slot="qrcode"
        class={cn(qrcodeRootClassName, local.class)}
        style={{
          width: model().size + 'px',
          height: model().size + 'px',
          '--qrcode-size': model().size + 'px',
          '--qrcode-color': model().color,
          '--qrcode-bg-color': model().bgColor,
          ...(typeof local.style === 'object' ? local.style : {}),
        }}
      >
        {local.children}
      </div>
    </QrCodeContext.Provider>
  )
}

export type QrCodeSvgProps = ParentProps<JSX.SvgSVGAttributes<SVGSVGElement>>

export function QrCodeSvg(props: QrCodeSvgProps) {
  const [local, rest] = splitProps(props, ['class', 'children', 'role', 'aria-label'])
  const { model } = useQrCode('QrCodeSvg')

  return (
    <svg
      {...rest}
      role={local.role ?? 'img'}
      aria-label={local['aria-label'] ?? 'QR code'}
      data-slot="qrcode-svg"
      class={cn(qrcodeSurfaceClassName, local.class)}
      viewBox={'0 0 ' + model().viewBoxSize + ' ' + model().viewBoxSize}
      width={model().size}
      height={model().size}
      shape-rendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
    >
      {local.children}
    </svg>
  )
}

export type QrCodeBackgroundProps = JSX.SvgSVGAttributes<SVGRectElement>

export function QrCodeBackground(props: QrCodeBackgroundProps) {
  const [local, rest] = splitProps(props, ['class'])
  const { model } = useQrCode('QrCodeBackground')

  return (
    <rect
      {...rest}
      data-slot="qrcode-background"
      class={cn(qrcodeBackgroundClassName, local.class)}
      width={model().viewBoxSize}
      height={model().viewBoxSize}
    />
  )
}

export interface QrCodeModulesProps extends JSX.SvgSVGAttributes<SVGPathElement> {
  centerSize?: number
  exclude?: QrCodeModuleExcludeRect
}

export function QrCodeModules(props: QrCodeModulesProps) {
  const [local, rest] = splitProps(props, ['centerSize', 'exclude', 'class'])
  const { model } = useQrCode('QrCodeModules')
  const path = createMemo(() => {
    const centerExclude = local.centerSize
      ? getQrCodeCenterExcludeRect(model(), local.centerSize)
      : undefined
    return getQrCodeSvgPath(model(), local.exclude ?? centerExclude)
  })

  return (
    <path
      {...rest}
      data-slot="qrcode-modules"
      class={cn(qrcodeModulesClassName, local.class)}
      d={path()}
    />
  )
}

export interface QrCodeCanvasProps extends JSX.CanvasHTMLAttributes<HTMLCanvasElement> {
  centerSize?: number
  exclude?: QrCodeModuleExcludeRect
}

export function QrCodeCanvas(props: QrCodeCanvasProps) {
  const [local, rest] = splitProps(props, ['centerSize', 'exclude', 'class', 'style'])
  const { model } = useQrCode('QrCodeCanvas')
  let canvasRef: HTMLCanvasElement | undefined

  createEffect(() => {
    const canvas = canvasRef
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const current = model()
    const ratio = window.devicePixelRatio || 1
    const centerExclude = local.centerSize
      ? getQrCodeCenterExcludeRect(current, local.centerSize)
      : undefined
    const cells = getQrCodeModuleCells(current, local.exclude ?? centerExclude)
    const moduleSize = current.size / current.viewBoxSize

    canvas.width = current.size * ratio
    canvas.height = current.size * ratio
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    context.fillStyle = current.bgColor
    context.fillRect(0, 0, current.size, current.size)
    context.fillStyle = current.color
    for (const cell of cells) {
      context.fillRect(cell.x * moduleSize, cell.y * moduleSize, moduleSize, moduleSize)
    }
  })

  return (
    <canvas
      {...rest}
      ref={canvasRef}
      data-slot="qrcode-canvas"
      class={cn(qrcodeSurfaceClassName, local.class)}
      style={{
        width: model().size + 'px',
        height: model().size + 'px',
        ...(typeof local.style === 'object' ? local.style : {}),
      }}
    />
  )
}

export type QrCodeCenterProps = ParentProps<
  JSX.SvgSVGAttributes<SVGSVGElement> & { size?: number }
>

export function QrCodeCenter(props: QrCodeCenterProps) {
  const [local, rest] = splitProps(props, ['size', 'class', 'style', 'children'])
  const size = () => local.size ?? 40
  const { model } = useQrCode('QrCodeCenter')
  const rect = createMemo(() => getQrCodeCenterRect(model(), size()))

  return (
    <svg
      {...rest}
      data-slot="qrcode-center"
      class={cn(qrcodeCenterClassName, local.class)}
      style={local.style}
      x={rect().x}
      y={rect().y}
      width={rect().width}
      height={rect().height}
      viewBox="0 0 100 100"
      overflow="visible"
    >
      {local.children}
    </svg>
  )
}

export type QrCodeOverlayProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>

export function QrCodeOverlay(props: QrCodeOverlayProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])

  return (
    <div {...rest} data-slot="qrcode-overlay" class={cn(qrcodeOverlayClassName, local.class)}>
      {local.children}
    </div>
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
