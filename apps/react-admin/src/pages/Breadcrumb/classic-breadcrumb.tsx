import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@fex-design/react/primitive/breadcrumb'

export function ClassicBreadcrumb({ separator = '/' }: { separator?: string }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Workspace</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Quarterly plan</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
