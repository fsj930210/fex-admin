import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage as CurrentPage,
  BreadcrumbSeparator,
} from '@fex-design/react/primitive/breadcrumb'
import {
  DropdownRoot,
  DropdownTrigger,
  DropdownContent,
} from '@fex-design/react/primitive/dropdown'
import { PopoverPortal } from '@fex-design/react/primitive/popover'

export function DropdownBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Workspace</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownRoot>
            <DropdownTrigger>
              {(props) => (
                <button
                  {...props}
                  className="inline-flex size-7 items-center justify-center rounded-md hover:bg-muted-background"
                  type="button"
                  aria-label="Show hidden path"
                >
                  <BreadcrumbEllipsis />
                </button>
              )}
            </DropdownTrigger>
            <PopoverPortal>
              <DropdownContent>
                <div className="min-w-40 space-y-1 p-1" role="menu">
                  <button
                    className="block w-full rounded px-2 py-1 text-left hover:bg-muted-background"
                    role="menuitem"
                    type="button"
                  >
                    Planning
                  </button>
                  <button
                    className="block w-full rounded px-2 py-1 text-left hover:bg-muted-background"
                    role="menuitem"
                    type="button"
                  >
                    Archive
                  </button>
                </div>
              </DropdownContent>
            </PopoverPortal>
          </DropdownRoot>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <CurrentPage>Quarterly plan</CurrentPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
