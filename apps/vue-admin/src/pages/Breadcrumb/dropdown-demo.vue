<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@fex-design/vue/primitive/breadcrumb'
import {
  DropdownContent,
  DropdownRoot,
  DropdownTrigger,
} from '@fex-design/vue/primitive/dropdown'
import { PopoverPortal } from '@fex-design/vue/primitive/popover'
</script>

<template>
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="/">Workspace</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <DropdownRoot>
          <DropdownTrigger v-slot="slot">
            <button
              v-bind="slot.props"
              :ref="slot.ref"
              class="inline-flex size-7 items-center justify-center rounded-md hover:bg-muted-background"
              type="button"
              aria-label="Show hidden path"
            >
              <BreadcrumbEllipsis />
            </button>
          </DropdownTrigger>
          <PopoverPortal>
            <DropdownContent>
              <div class="min-w-40 space-y-1 p-1" role="menu">
                <button
                  class="block w-full rounded px-2 py-1 text-left hover:bg-muted-background"
                  role="menuitem"
                  type="button"
                >
                  Planning
                </button>
                <button
                  class="block w-full rounded px-2 py-1 text-left hover:bg-muted-background"
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
        <BreadcrumbPage>Quarterly plan</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
</template>
