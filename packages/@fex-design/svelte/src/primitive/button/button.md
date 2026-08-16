# Svelte Primitive Button

`ButtonGroup` is exported from the same entry. It groups related actions, supports horizontal or vertical orientation, and uses `spacing={0}` for connected controls without owning a selection value.

## Import

```svelte
<script lang="ts">
  import Button from '@fex-design/svelte/primitive/button'
</script>
```

## Basic

```svelte
<Button>Save</Button>
```

## Props

| Name                | Type                              | Default     | Required | Description                                                                                                                                                                  |
| ------------------- | --------------------------------- | ----------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `class`             | `string`                          | `undefined` | No       | Extra classes merged with the primitive defaults.                                                                                                                            |
| `type`              | `'button' \| 'submit' \| 'reset'` | `'button'`  | No       | Native button type.                                                                                                                                                          |
| native button props | `HTMLButtonAttributes`            | `undefined` | No       | Native button attributes are passed through. The primitive includes the default button foundation classes but does not expose variant, size, loading, icon, or effect props. |
