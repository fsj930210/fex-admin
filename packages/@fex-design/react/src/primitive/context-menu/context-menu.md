# ContextMenu

ContextMenu 是无额外包裹 DOM 的右键菜单 primitive。Trigger 使用 render prop，将事件、ARIA 和 ref 绑定到调用方已有元素；右键位置使用虚拟 reference，payload 用于 Tree 节点、表格行或表头等场景。

```tsx
<ContextMenuRoot>
  <ContextMenuTrigger payload="node-1">
    {(props) => <div {...props}>Right click</div>}
  </ContextMenuTrigger>
  <ContextMenuPortal>
    <ContextMenuContent>
      <ContextMenuItem onClick={rename}>Rename</ContextMenuItem>
    </ContextMenuContent>
  </ContextMenuPortal>
</ContextMenuRoot>
```

`open` / `defaultOpen` 遵循受控与非受控约定，`onOpenChange` 的 info 包含 payload、target、坐标和关闭原因。复杂自定义 DOM 可直接使用 `useContextMenuTrigger` 与 `useContextMenuContent`。
