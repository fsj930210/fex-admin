import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  numberAttribute,
} from '@angular/core'
import {
  createQrCodeModel,
  getQrCodeCenterExcludeRect,
  getQrCodeCenterRect,
  getQrCodeModuleCells,
  getQrCodeSvgPath,
  type QrCodeErrorLevel,
  type QrCodeModel,
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
import { createHostClassName } from '../../signals/host-class'

function optionalNumberAttribute(value: unknown) {
  return value === undefined || value === null || value === '' ? undefined : numberAttribute(value)
}

@Component({
  selector: 'fex-qrcode-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClassName()',
    '[style.width.px]': 'model().size',
    '[style.height.px]': 'model().size',
    '[style.--qrcode-size]': "model().size + 'px'",
    '[style.--qrcode-color]': 'model().color',
    '[style.--qrcode-bg-color]': 'model().bgColor',
    'data-slot': 'qrcode',
  },
  template: '<ng-content />',
})
export class QrCodeRoot {
  value = input.required<string>()
  errorLevel = input<QrCodeErrorLevel>('M')
  margin = input(4, { transform: numberAttribute })
  size = input(160, { transform: numberAttribute })
  color = input('#000000')
  bgColor = input('#ffffff')
  readonly model = computed(() =>
    createQrCodeModel({
      value: this.value(),
      errorLevel: this.errorLevel(),
      margin: this.margin(),
      size: this.size(),
      color: this.color(),
      bgColor: this.bgColor(),
    }),
  )
  protected readonly hostClassName = createHostClassName(qrcodeRootClassName)
}

@Component({
  selector: 'svg[fexQrCodeSvg]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClassName()',
    '[attr.role]': 'role()',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.viewBox]': 'viewBox()',
    '[attr.width]': 'root.model().size',
    '[attr.height]': 'root.model().size',
    'shape-rendering': 'crispEdges',
    'xmlns': 'http://www.w3.org/2000/svg',
    'data-slot': 'qrcode-svg',
  },
  template: '<ng-content />',
})
export class QrCodeSvg {
  protected readonly root = inject(QrCodeRoot)
  role = input('img')
  ariaLabel = input('QR code', { alias: 'aria-label' })
  protected readonly hostClassName = createHostClassName(qrcodeSurfaceClassName)
  protected readonly viewBox = computed(
    () => '0 0 ' + this.root.model().viewBoxSize + ' ' + this.root.model().viewBoxSize,
  )
}

@Component({
  selector: 'rect[fexQrCodeBackground]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClassName()',
    '[attr.width]': 'root.model().viewBoxSize',
    '[attr.height]': 'root.model().viewBoxSize',
    'data-slot': 'qrcode-background',
  },
  template: '',
})
export class QrCodeBackground {
  protected readonly root = inject(QrCodeRoot)
  protected readonly hostClassName = createHostClassName(qrcodeBackgroundClassName)
}

@Component({
  selector: 'path[fexQrCodeModules]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClassName()',
    '[attr.d]': 'path()',
    'data-slot': 'qrcode-modules',
  },
  template: '',
})
export class QrCodeModules {
  protected readonly root = inject(QrCodeRoot)
  centerSize = input<number | undefined, unknown>(undefined, { transform: optionalNumberAttribute })
  exclude = input<QrCodeModuleExcludeRect | undefined>()
  protected readonly hostClassName = createHostClassName(qrcodeModulesClassName)
  protected readonly path = computed(() => {
    const model = this.root.model()
    const centerExclude = this.centerSize()
      ? getQrCodeCenterExcludeRect(model, this.centerSize()!)
      : undefined
    return getQrCodeSvgPath(model, this.exclude() ?? centerExclude)
  })
}

@Component({
  selector: 'canvas[fexQrCodeCanvas]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClassName()',
    '[style.width.px]': 'root.model().size',
    '[style.height.px]': 'root.model().size',
    'data-slot': 'qrcode-canvas',
  },
  template: '',
})
export class QrCodeCanvas {
  protected readonly root = inject(QrCodeRoot)
  private readonly element = inject<ElementRef<HTMLCanvasElement>>(ElementRef).nativeElement
  centerSize = input<number | undefined, unknown>(undefined, { transform: optionalNumberAttribute })
  exclude = input<QrCodeModuleExcludeRect | undefined>()
  protected readonly hostClassName = createHostClassName(qrcodeSurfaceClassName)

  constructor() {
    effect(() => this.render(this.root.model()))
  }

  private render(model: QrCodeModel) {
    const context = this.element.getContext('2d')
    if (!context) return

    const ratio = window.devicePixelRatio || 1
    const centerExclude = this.centerSize()
      ? getQrCodeCenterExcludeRect(model, this.centerSize()!)
      : undefined
    const cells = getQrCodeModuleCells(model, this.exclude() ?? centerExclude)
    const moduleSize = model.size / model.viewBoxSize

    this.element.width = model.size * ratio
    this.element.height = model.size * ratio
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    context.fillStyle = model.bgColor
    context.fillRect(0, 0, model.size, model.size)
    context.fillStyle = model.color
    for (const cell of cells) {
      context.fillRect(cell.x * moduleSize, cell.y * moduleSize, moduleSize, moduleSize)
    }
  }
}

@Component({
  selector: 'svg[fexQrCodeCenter]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClassName()',
    '[attr.x]': 'rect().x',
    '[attr.y]': 'rect().y',
    '[attr.width]': 'rect().width',
    '[attr.height]': 'rect().height',
    viewBox: '0 0 100 100',
    overflow: 'visible',
    'data-slot': 'qrcode-center',
  },
  template: '<ng-content />',
})
export class QrCodeCenter {
  protected readonly root = inject(QrCodeRoot)
  size = input(40, { transform: numberAttribute })
  protected readonly rect = computed(() => getQrCodeCenterRect(this.root.model(), this.size()))
  protected readonly hostClassName = createHostClassName(qrcodeCenterClassName)
}

@Component({
  selector: 'fex-qrcode-overlay',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClassName()',
    'data-slot': 'qrcode-overlay',
  },
  template: '<ng-content />',
})
export class QrCodeOverlay {
  active = input(true, { transform: booleanAttribute })
  protected readonly hostClassName = createHostClassName(qrcodeOverlayClassName)
}

export type { QrCodeErrorLevel, QrCodeModel, QrCodeModuleExcludeRect }
