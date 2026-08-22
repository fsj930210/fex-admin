import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from '@fex-design/react/primitive/breadcrumb'

export function CapsuleBreadcrumb() {
  return (
    <Breadcrumb className="p-1">
      <BreadcrumbList className="w-max items-center gap-0 rounded-full text-muted-foreground overflow-hidden">
        <BreadcrumbItem className="group z-[3] -mr-4.5">
          <BreadcrumbLink
            className="inline-flex items-center gap-0.5 px-4 border border-border rounded-full bg-muted-background hover:bg-hover-background group-not-first:pl-6"
            href="/"
          >
            Workspace
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem className="group z-[2] -mr-4.5">
          <BreadcrumbLink
            className="inline-flex items-center gap-0.5 px-4 pl-6 border border-border rounded-full bg-muted-background hover:bg-hover-background"
            href="/projects"
          >
            Projects
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem className="group z-[1]">
          <BreadcrumbPage className="inline-flex items-center gap-0.5 px-4 pl-6 border border-border rounded-full bg-muted-background hover:bg-hover-background">
            Quarterly plan
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
