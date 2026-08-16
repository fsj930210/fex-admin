# React Primitive Button

`ButtonGroup` is exported from the same entry. It groups related actions, supports horizontal or vertical orientation, and uses `spacing={0}` for connected controls without owning a selection value.

## Import

```tsx
import { Button } from '@fex-design/react/primitive/button'
```

## Basic

```tsx
export function Example() {
  return <Button>Save</Button>
}
```

## Props

| Name                | Type                                      | Default     | Required | Description                                                                                                                                                                  |
| ------------------- | ----------------------------------------- | ----------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `className`         | `string`                                  | `undefined` | No       | Extra classes merged with the primitive defaults.                                                                                                                            |
| `type`              | `'button' \| 'submit' \| 'reset'`         | `'button'`  | No       | Native button type.                                                                                                                                                          |
| native button props | `ButtonHTMLAttributes<HTMLButtonElement>` | `undefined` | No       | Native button attributes are passed through. The primitive includes the default button foundation classes but does not expose variant, size, loading, icon, or effect props. |
