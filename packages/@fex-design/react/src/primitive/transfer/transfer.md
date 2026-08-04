# Transfer primitive

The Transfer primitive connects the framework-neutral controller to two built-in panels. Each panel always owns a header, body and optional footer region; source and target content can differ.

## Import

```tsx
import {
  TransferActions,
  TransferRoot,
  useTransfer,
  useTransferPanel,
} from '@fex-design/react/primitive/transfer'
```

## Composition

```tsx
<TransferRoot
  items={items}
  source={{
    header: 'Available',
    body: (panel) => (
      <CustomList
        items={panel.items}
        checkedKeys={panel.checkedKeys}
        onCheckedKeysChange={panel.setCheckedKeys}
      />
    ),
  }}
  target={{
    header: 'Assigned',
    body: (panel) => (
      <CustomTable
        items={panel.items}
        checkedKeys={panel.checkedKeys}
        onCheckedKeysChange={panel.setCheckedKeys}
      />
    ),
  }}
  actions={
    <TransferActions>
      {(actions) => <button onClick={actions.moveToTarget}>Assign</button>}
    </TransferActions>
  }
/>
```

## Root props

| Name                 | Type                           | Default          | Required | Description                                              |
| -------------------- | ------------------------------ | ---------------- | -------- | -------------------------------------------------------- |
| `items`              | `readonly TItem[]`             | —                | yes      | Stable source data.                                      |
| `fieldNames`         | `TransferFieldNames`           | standard fields  | no       | Maps key, label and disabled fields.                     |
| `source`             | `TransferPanelConfig<TItem>`   | —                | yes      | Source header, body and optional footer.                 |
| `target`             | `TransferPanelConfig<TItem>`   | —                | yes      | Target header, body and optional footer.                 |
| `actions`            | `ReactNode`                    | —                | yes      | Content between the two panels.                          |
| `controller`         | `TransferController<TItem>`    | owned controller | no       | Supplies an external core controller.                    |
| `targetKeys`         | `readonly TransferKey[]`       | —                | no       | Controlled target order.                                 |
| `defaultTargetKeys`  | `readonly TransferKey[]`       | `[]`             | no       | Initial target order.                                    |
| `checkedKeys`        | `Partial<TransferCheckedKeys>` | —                | no       | Controlled panel checks.                                 |
| `defaultCheckedKeys` | `Partial<TransferCheckedKeys>` | `{}`             | no       | Initial panel checks.                                    |
| `onChange`           | `(keys, meta) => void`         | —                | no       | Reports formal value changes with complete items.        |
| `onCheckedChange`    | `(keys, meta) => void`         | —                | no       | Reports panel check changes with complete items.         |
| `invalid`            | `boolean`                      | `false`          | no       | Adds `aria-invalid`; validation policy remains external. |
| `message`            | `ReactNode`                    | —                | no       | Optional status content.                                 |

## Panel render API

`side`, `items`, `checkedKeys`, `setCheckedKeys` and `isChecked` are available to every region render function. A custom body must only connect its own selection UI; it must not update target keys.

## Actions

`TransferActions` exposes `moveToTarget`, `moveToSource`, `moveAllToTarget`, `moveAllToSource` and a matching `canMove...` boolean for each operation. Disabled records are filtered by core for every action.
