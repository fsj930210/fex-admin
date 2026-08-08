# QRCode Primitive

## Usage

QRCode provides composable primitives for rendering QR code modules. The root owns the encoded model, while renderer and slot parts decide how the model is presented.

## Import

Use the framework package primitive entry:

```ts
import {
  QrCodeRoot,
  QrCodeSvg,
  QrCodeBackground,
  QrCodeModules,
  QrCodeCenter,
  QrCodeOverlay,
  QrCodeCanvas,
} from '@fex-design/<framework>/primitive/qrcode'
```

Svelte also exposes file-level entries such as `primitive/qrcode-root`, `primitive/qrcode-svg`, and `primitive/qrcode-modules`.

## Basic Example

```tsx
<QrCodeRoot value="https://fex.design" size={176}>
  <QrCodeSvg>
    <QrCodeBackground />
    <QrCodeModules />
  </QrCodeSvg>
</QrCodeRoot>
```

## Composition

```tsx
<QrCodeRoot value="https://fex.design" size={176} errorLevel="H">
  <QrCodeSvg>
    <QrCodeBackground />
    <QrCodeModules centerSize={40} />
    <QrCodeCenter size={40}>
      <rect width="100" height="100" rx="20" className="fill-background" />
      <text x="50" y="52" textAnchor="middle" dominantBaseline="middle">FX</text>
    </QrCodeCenter>
  </QrCodeSvg>
</QrCodeRoot>
```

## Parts

| Part | Purpose |
| --- | --- |
| `QrCodeRoot` | Creates and provides the QR code model. |
| `QrCodeSvg` | Renders an SVG surface. |
| `QrCodeBackground` | Renders the SVG background rect. |
| `QrCodeModules` | Renders dark QR modules as an SVG path. |
| `QrCodeCanvas` | Renders the QR model to a canvas. |
| `QrCodeCenter` | Embeds centered custom content inside the SVG surface. |
| `QrCodeOverlay` | Provides an overlay slot for loading, expired, or custom states. |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | required | Encoded QR content. |
| `size` | `number` | `160` | Rendered square size in pixels. |
| `margin` | `number` | `4` | Quiet-zone module count. |
| `errorLevel` | `'L' \| 'M' \| 'Q' \| 'H'` | `'M'` | QR error correction level. |
| `color` | `string` | `'#000000'` | Dark module color. |
| `bgColor` | `string` | `'#ffffff'` | Background color. |
| `centerSize` | `number` | `undefined` | Clears the matching center area when rendering modules. |
| `exclude` | `QrCodeModuleExcludeRect` | `undefined` | Explicit module-space rectangle to skip. |

## Events

The primitive has no business events. Put refresh, retry, status, and analytics behavior in caller code or a future UI wrapper.

## Controlled State

QRCode has no internal interactive state. Updating `value` or rendering options regenerates the model.

## Notes

`QrCodeCenter` must be placed inside `QrCodeSvg`; it is rendered in the same SVG coordinate system as the modules. `QrCodeOverlay` remains a root-level slot for loading, expired, or custom states.
