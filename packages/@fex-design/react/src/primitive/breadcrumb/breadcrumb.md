# Breadcrumb

`Breadcrumb` provides semantic navigation structure without owning routing or dropdown state.

```tsx
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@fex-design/react/primitive/breadcrumb'

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>Settings</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

`BreadcrumbLink` renders an anchor by default. For SPA routers, use a function child and render the router link with the provided props. `BreadcrumbSeparator` accepts any children, while `BreadcrumbEllipsis` is presentational and can be composed with Dropdown or Popover.
