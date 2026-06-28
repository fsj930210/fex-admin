# Solid Primitive Button

## Import

```tsx
import { Button } from '@fex/components-solid/primitive/button'
```

## Basic

```tsx
export function Example() {
  return <Button>Save</Button>
}
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `class` | `string` | `undefined` | No | Extra classes merged with the primitive defaults. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | No | Native button type. |
| native button props | `JSX.ButtonHTMLAttributes<HTMLButtonElement>` | `undefined` | No | Native button attributes are passed through. The primitive includes the default button foundation classes but does not expose variant, size, loading, icon, or effect props. |
