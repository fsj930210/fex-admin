# Watermark

Watermark renders repeated text over a content area. It is a primitive component: one component owns one behavior and can wrap any page, card, table, image, or panel content.

## Import

```ts
import { Watermark } from '@fex-design/vue/primitive/watermark'
```

## Basic Usage

```vue
<Watermark content="FEX Admin">
  <div>Private content</div>
</Watermark>
```

## Image Content

```vue
<Watermark content="Internal">
  <img src="/preview.png" alt="Preview" />
</Watermark>
```

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| content | string or string[] | undefined | Text rendered in the watermark tile. |
| width | number | 120 | Tile drawing width. |
| height | number | 64 | Tile drawing height. |
| rotate | number | -22 | Tile rotation in degrees. |
| gap | [number, number] | [100, 100] | Horizontal and vertical gap between tiles. |
| offset | [number, number] | [0, 0] | Background position offset. |
| zIndex | number | 9 | Watermark layer z-index. |
| opacity | number | 1 | Canvas drawing opacity. |
| font | WatermarkFont | default font | Text font options. |
| className / class | string | undefined | Extra class for the root element. |

## Behavior

The component draws text into a canvas data URL, then applies it as the background of an internal watermark layer. The canvas tile includes the configured gap, so the background is repeated without stretching the mark. The layer is pointer-events none, so wrapped content remains interactive.

If the generated layer is removed from the root element, a MutationObserver appends it back. This follows the same lightweight recovery strategy as Ant Design. It is not a security boundary: users with developer tools can still alter client-side DOM, CSS, or JavaScript.

## Notes

Images are supported as wrapped content. Use the component around an image or image preview area to add a text watermark over it.

