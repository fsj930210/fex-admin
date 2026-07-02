<script setup lang="ts">
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverPortal,
  PopoverTitle,
  PopoverTrigger,
} from '@fex/components-vue/primitive/popover'
import Card from '@fex/components-vue/ui/card'
import { ref } from 'vue'

const open = ref(false)
const container = ref<HTMLDivElement>()
const outlineButtonClass =
  'inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted-background disabled:pointer-events-none disabled:opacity-50'
const secondaryButtonClass =
  'inline-flex h-9 items-center justify-center rounded-md border border-transparent bg-secondary-background px-4 text-sm font-medium text-secondary-foreground shadow-sm transition-colors hover:bg-muted-background disabled:pointer-events-none disabled:opacity-50'

function getPopupContainer() {
  return container.value ?? globalThis.document.body
}

const placementGroups = [
  [
    { label: 'TL', placement: 'topLeft' },
    { label: 'Top', placement: 'top' },
    { label: 'TR', placement: 'topRight' },
  ],
  [
    { label: 'LT', placement: 'leftTop' },
    { label: 'RT', placement: 'rightTop' },
  ],
  [
    { label: 'Left', placement: 'left' },
    { label: 'Right', placement: 'right' },
  ],
  [
    { label: 'LB', placement: 'leftBottom' },
    { label: 'RB', placement: 'rightBottom' },
  ],
  [
    { label: 'BL', placement: 'bottomLeft' },
    { label: 'Bottom', placement: 'bottom' },
    { label: 'BR', placement: 'bottomRight' },
  ],
] as const
</script>

<template>
  <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
    <div class="mx-auto w-full max-w-5xl space-y-space-xl">
      <header class="space-y-space-xl">
        <RouterLink class="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</RouterLink>
        <div>
          <h1 class="text-2xl font-semibold text-foreground">Popover</h1>
          <p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
            Vue adapter for the shared core floating overlay, covering triggers, placement, controlled state and custom popup containers.
          </p>
        </div>
      </header>

      <div class="space-y-space-xl">
        <Card title="Primitive" description="Low-level composition API. Trigger exposes slot props.">
          <div class="flex min-w-0 flex-wrap items-center gap-space-md">
            <Popover side="bottom" align="start" :side-offset="8" arrow>
              <PopoverTrigger v-slot="{ props, ref }">
                <button v-bind="props" :ref="ref" class="text-sm text-foreground hover:text-primary">Primitive trigger</button>
              </PopoverTrigger>
              <PopoverPortal>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverHeader class="w-64">
                    <PopoverTitle>Primitive content</PopoverTitle>
                    <PopoverDescription>Content uses shared floating variables and data attributes.</PopoverDescription>
                  </PopoverHeader>
                </PopoverContent>
              </PopoverPortal>
            </Popover>
          </div>
        </Card>

        <Card title="Ui" description="Business UI can compose Button without an extra wrapper protocol.">
          <div class="flex min-w-0 flex-wrap items-center gap-space-md">
            <Popover placement="bottomLeft" :side-offset="8" arrow>
              <PopoverTrigger v-slot="{ props, ref }">
                <button v-bind="props" :ref="ref" :class="outlineButtonClass">Click</button>
              </PopoverTrigger>
              <PopoverPortal>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverHeader class="w-64">
                    <PopoverTitle>Click trigger</PopoverTitle>
                    <PopoverDescription>The popover opens immediately while positioning stays in CSS variables.</PopoverDescription>
                  </PopoverHeader>
                </PopoverContent>
              </PopoverPortal>
            </Popover>
          </div>
        </Card>

        <Card title="Triggers" description="Supports click, hover, focus and context-menu.">
          <div class="flex min-w-0 flex-wrap items-center gap-space-md">
            <Popover :trigger="['hover', 'focus']" :hover-close-delay="120" arrow>
              <PopoverTrigger v-slot="{ props, ref }">
                <button v-bind="props" :ref="ref" :class="secondaryButtonClass">Hover or focus</button>
              </PopoverTrigger>
              <PopoverPortal>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverHeader class="w-64">
                    <PopoverTitle>Combined trigger</PopoverTitle>
                    <PopoverDescription>Hover and focus share one trigger source model, so they do not close each other incorrectly.</PopoverDescription>
                  </PopoverHeader>
                </PopoverContent>
              </PopoverPortal>
            </Popover>

            <Popover :trigger="['context-menu']" placement="rightTop" :side-offset="8">
              <PopoverTrigger v-slot="{ props, ref }">
                <button v-bind="props" :ref="ref" :class="outlineButtonClass">Right click</button>
              </PopoverTrigger>
              <PopoverPortal>
                <PopoverContent>
                  <PopoverHeader class="w-64">
                    <PopoverTitle>Context menu trigger</PopoverTitle>
                    <PopoverDescription>This is still Popover content; future ContextMenu will reuse the same trigger and floating core with Menu.</PopoverDescription>
                  </PopoverHeader>
                </PopoverContent>
              </PopoverPortal>
            </Popover>
          </div>
        </Card>

        <Card title="Placement" description="Supports antd placement and Radix side/align options.">
          <div class="flex w-full flex-col items-center gap-space-md py-space-lg">
            <div
              v-for="(group, rowIndex) in placementGroups"
              :key="rowIndex"
              class="grid w-full max-w-xl grid-cols-[repeat(3,minmax(80px,1fr))] items-center gap-x-space-lg gap-y-space-md"
            >
              <template v-if="rowIndex > 0 && rowIndex < 4">
                <div class="justify-self-start">
                  <Popover :placement="group[0].placement" :side-offset="10" arrow>
                    <PopoverTrigger v-slot="{ props, ref }">
                      <button v-bind="props" :ref="ref" :class="[outlineButtonClass, 'w-24']">{{ group[0].label }}</button>
                    </PopoverTrigger>
                    <PopoverPortal>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverHeader class="w-44">
                          <PopoverTitle>{{ group[0].placement }}</PopoverTitle>
                          <PopoverDescription>Edge placements flip instead of shifting across the trigger.</PopoverDescription>
                        </PopoverHeader>
                      </PopoverContent>
                    </PopoverPortal>
                  </Popover>
                </div>
                <div />
                <div class="justify-self-end">
                  <Popover :placement="group[1].placement" :side-offset="10" arrow>
                    <PopoverTrigger v-slot="{ props, ref }">
                      <button v-bind="props" :ref="ref" :class="[outlineButtonClass, 'w-24']">{{ group[1].label }}</button>
                    </PopoverTrigger>
                    <PopoverPortal>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverHeader class="w-44">
                          <PopoverTitle>{{ group[1].placement }}</PopoverTitle>
                          <PopoverDescription>Edge placements flip instead of shifting across the trigger.</PopoverDescription>
                        </PopoverHeader>
                      </PopoverContent>
                    </PopoverPortal>
                  </Popover>
                </div>
              </template>
              <template v-else>
                <div v-for="item in group" :key="item.placement" class="justify-self-center">
                  <Popover :placement="item.placement" :side-offset="10" arrow>
                    <PopoverTrigger v-slot="{ props, ref }">
                      <button v-bind="props" :ref="ref" :class="[outlineButtonClass, 'w-24']">{{ item.label }}</button>
                    </PopoverTrigger>
                    <PopoverPortal>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverHeader class="w-44">
                          <PopoverTitle>{{ item.placement }}</PopoverTitle>
                          <PopoverDescription>Single-axis placements shift; edge placements only flip.</PopoverDescription>
                        </PopoverHeader>
                      </PopoverContent>
                    </PopoverPortal>
                  </Popover>
                </div>
              </template>
            </div>
          </div>
        </Card>

        <Card title="Offsets" description="Tune main-axis sideOffset and cross-axis alignOffset.">
          <div class="flex min-w-0 flex-wrap items-center gap-space-md">
            <Popover placement="bottomLeft" :side-offset="18" arrow>
              <PopoverTrigger v-slot="{ props, ref }">
                <button v-bind="props" :ref="ref" :class="outlineButtonClass">sideOffset 18</button>
              </PopoverTrigger>
              <PopoverPortal>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverHeader class="w-64">
                    <PopoverTitle>Main-axis offset</PopoverTitle>
                    <PopoverDescription>sideOffset increases the distance between trigger and content.</PopoverDescription>
                  </PopoverHeader>
                </PopoverContent>
              </PopoverPortal>
            </Popover>

            <Popover placement="bottomLeft" :side-offset="8" :align-offset="28" arrow>
              <PopoverTrigger v-slot="{ props, ref }">
                <button v-bind="props" :ref="ref" :class="outlineButtonClass">alignOffset 28</button>
              </PopoverTrigger>
              <PopoverPortal>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverHeader class="w-64">
                    <PopoverTitle>Cross-axis offset</PopoverTitle>
                    <PopoverDescription>alignOffset moves the aligned edge along the cross axis.</PopoverDescription>
                  </PopoverHeader>
                </PopoverContent>
              </PopoverPortal>
            </Popover>
          </div>
        </Card>

        <Card title="Controlled" description="Controlled mode only requests outside updates.">
          <div class="flex min-w-0 flex-wrap items-center gap-space-md">
            <Popover :open="open" @open-change="open = $event" placement="bottomLeft" arrow>
              <PopoverTrigger v-slot="{ props, ref }">
                <button v-bind="props" :ref="ref" :class="open ? secondaryButtonClass : outlineButtonClass">
                  {{ open ? 'Controlled open' : 'Controlled closed' }}
                </button>
              </PopoverTrigger>
              <PopoverPortal>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverHeader class="w-64">
                    <PopoverTitle>Controlled popover</PopoverTitle>
                    <PopoverDescription>Click outside or press Escape to request closing through onOpenChange.</PopoverDescription>
                  </PopoverHeader>
                </PopoverContent>
              </PopoverPortal>
            </Popover>
          </div>
        </Card>

        <Card title="getPopupContainer" description="Portal can mount into a custom container.">
          <div ref="container" class="relative min-h-40 rounded-md border border-dashed p-space-lg">
            <Popover :get-popup-container="getPopupContainer" placement="bottomLeft">
              <PopoverTrigger v-slot="{ props, ref }">
                <button v-bind="props" :ref="ref" :class="outlineButtonClass">Mount inside dashed box</button>
              </PopoverTrigger>
              <PopoverPortal>
                <PopoverContent>
                  <PopoverHeader class="w-64">
                    <PopoverTitle>Custom container</PopoverTitle>
                    <PopoverDescription>The portal node is rendered inside the dashed container.</PopoverDescription>
                  </PopoverHeader>
                </PopoverContent>
              </PopoverPortal>
            </Popover>
          </div>
        </Card>
      </div>
    </div>
  </main>
</template>
