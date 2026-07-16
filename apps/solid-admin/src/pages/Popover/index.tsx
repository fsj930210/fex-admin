import { Card } from '@fex/components-solid/ui/card'
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverPortal,
  PopoverTitle,
  PopoverTrigger,
  type PopoverTriggerRenderProps,
} from '@fex/components-solid/primitive/popover'
import { For, createSignal, type JSX } from 'solid-js'
import { A } from '@solidjs/router'

function DemoSection(props: { title: string; description: string; children: JSX.Element }) {
  return (
    <Card title={props.title} description={props.description}>
      <div class="flex min-w-0 flex-wrap items-center gap-space-md">{props.children}</div>
    </Card>
  )
}

function PopoverPanel(props: { title: string; children: JSX.Element; compact?: boolean }) {
  return (
    <div class={props.compact ? 'w-44' : 'w-64'}>
      <PopoverHeader>
        <PopoverTitle>{props.title}</PopoverTitle>
        <PopoverDescription>{props.children}</PopoverDescription>
      </PopoverHeader>
    </div>
  )
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

const outlineButtonClass =
  'inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted-background disabled:pointer-events-none disabled:opacity-50'
const secondaryButtonClass =
  'inline-flex h-9 items-center justify-center rounded-md border border-transparent bg-secondary-background px-4 text-sm font-medium text-secondary-foreground shadow-sm transition-colors hover:bg-muted-background disabled:pointer-events-none disabled:opacity-50'

function TriggerButton(props: {
  slot: PopoverTriggerRenderProps
  class?: string
  children: JSX.Element
}) {
  const triggerProps = props.slot.props

  return (
    <button
      {...triggerProps}
      ref={(element) => props.slot.ref(element)}
      class={props.class ?? triggerProps.class}
    >
      {props.children}
    </button>
  )
}

export function PopoverPage(): JSX.Element {
  const [open, setOpen] = createSignal(false)
  let container: HTMLDivElement | undefined

  return (
    <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div class="mx-auto w-full max-w-5xl space-y-space-xl">
        <header class="space-y-space-xl">
          <A class="text-sm text-muted-foreground hover:text-foreground" href="/">
            Back home
          </A>
          <div>
            <h1 class="text-2xl font-semibold text-foreground">Popover</h1>
            <p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
              鍩轰簬 core floating overlay 鐨?Solid
              閫傞厤锛岃鐩栬Е鍙戞柟寮忋€佷綅缃€佸彈鎺х姸鎬佸拰鑷畾涔夋寕杞藉鍣ㄣ€?{' '}
            </p>
          </div>
        </header>

        <div class="space-y-space-xl">
          <DemoSection title="Primitive" description="Demo.">
            <Popover side="bottom" align="start" sideOffset={8} arrow>
              <PopoverTrigger>
                {(slot) => (
                  <TriggerButton slot={slot} class="text-sm text-foreground hover:text-primary">
                    Primitive trigger
                  </TriggerButton>
                )}
              </PopoverTrigger>
              <PopoverPortal>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverPanel title="Primitive content">
                    Content uses shared floating variables and data attributes.
                  </PopoverPanel>
                </PopoverContent>
              </PopoverPortal>
            </Popover>
          </DemoSection>

          <DemoSection title="Ui" description="Demo.">
            <Popover placement="bottomLeft" sideOffset={8} arrow>
              <PopoverTrigger>
                {(slot) => (
                  <TriggerButton slot={slot} class={outlineButtonClass}>
                    Click
                  </TriggerButton>
                )}
              </PopoverTrigger>
              <PopoverPortal>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverPanel title="Click trigger">
                    The popover opens immediately while positioning stays in CSS variables.
                  </PopoverPanel>
                </PopoverContent>
              </PopoverPortal>
            </Popover>
          </DemoSection>

          <DemoSection title="Triggers" description="Demo.">
            <Popover trigger={['hover', 'focus']} hoverCloseDelay={120} arrow>
              <PopoverTrigger>
                {(slot) => (
                  <TriggerButton slot={slot} class={secondaryButtonClass}>
                    Hover or focus
                  </TriggerButton>
                )}
              </PopoverTrigger>
              <PopoverPortal>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverPanel title="Combined trigger">
                    Hover and focus share one trigger source model, so they do not close each other
                    incorrectly.
                  </PopoverPanel>
                </PopoverContent>
              </PopoverPortal>
            </Popover>

            <Popover trigger={['context-menu']} placement="rightTop" sideOffset={8}>
              <PopoverTrigger>
                {(slot) => (
                  <TriggerButton slot={slot} class={outlineButtonClass}>
                    Right click
                  </TriggerButton>
                )}
              </PopoverTrigger>
              <PopoverPortal>
                <PopoverContent>
                  <PopoverPanel title="Context menu trigger">
                    This is still Popover content; future ContextMenu will reuse the same trigger
                    and floating core with Menu.
                  </PopoverPanel>
                </PopoverContent>
              </PopoverPortal>
            </Popover>
          </DemoSection>

          <DemoSection title="Placement" description="Demo.">
            <div class="flex w-full flex-col items-center gap-space-md py-space-lg">
              <For each={placementGroups}>
                {(group, rowIndex) => (
                  <div class="grid w-full max-w-xl grid-cols-[repeat(3,minmax(80px,1fr))] items-center gap-x-space-lg gap-y-space-md">
                    {rowIndex() > 0 && rowIndex() < 4 ? (
                      <>
                        <div class="justify-self-start">
                          <PlacementPopover item={group[0]} edge />
                        </div>
                        <div />
                        <div class="justify-self-end">
                          <PlacementPopover item={group[1]} edge />
                        </div>
                      </>
                    ) : (
                      <For each={group}>
                        {(item) => (
                          <div class="justify-self-center">
                            <PlacementPopover item={item} />
                          </div>
                        )}
                      </For>
                    )}
                  </div>
                )}
              </For>
            </div>
          </DemoSection>

          <DemoSection
            title="Offsets"
            description="Tune main-axis sideOffset and cross-axis alignOffset."
          >
            <Popover placement="bottomLeft" sideOffset={18} arrow>
              <PopoverTrigger>
                {(slot) => (
                  <TriggerButton slot={slot} class={outlineButtonClass}>
                    sideOffset 18
                  </TriggerButton>
                )}
              </PopoverTrigger>
              <PopoverPortal>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverPanel title="Main-axis offset">
                    sideOffset increases the distance between trigger and content.
                  </PopoverPanel>
                </PopoverContent>
              </PopoverPortal>
            </Popover>

            <Popover placement="bottomLeft" sideOffset={8} alignOffset={28} arrow>
              <PopoverTrigger>
                {(slot) => (
                  <TriggerButton slot={slot} class={outlineButtonClass}>
                    alignOffset 28
                  </TriggerButton>
                )}
              </PopoverTrigger>
              <PopoverPortal>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverPanel title="Cross-axis offset">
                    alignOffset moves the aligned edge along the cross axis.
                  </PopoverPanel>
                </PopoverContent>
              </PopoverPortal>
            </Popover>
          </DemoSection>

          <DemoSection title="Controlled" description="Demo.">
            <Popover open={open()} onOpenChange={setOpen} placement="bottomLeft" arrow>
              <PopoverTrigger>
                {(slot) => (
                  <TriggerButton
                    slot={slot}
                    class={open() ? secondaryButtonClass : outlineButtonClass}
                  >
                    {open() ? 'Controlled open' : 'Controlled closed'}
                  </TriggerButton>
                )}
              </PopoverTrigger>
              <PopoverPortal>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverPanel title="Controlled popover">
                    Click outside or press Escape to request closing through onOpenChange.
                  </PopoverPanel>
                </PopoverContent>
              </PopoverPortal>
            </Popover>
          </DemoSection>

          <Card title="getPopupContainer" description="Demo.">
            <div
              ref={(element) => {
                container = element
              }}
              class="relative min-h-40 rounded-md border border-dashed p-space-lg"
            >
              <Popover getPopupContainer={() => container ?? document.body} placement="bottomLeft">
                <PopoverTrigger>
                  {(slot) => (
                    <TriggerButton slot={slot} class={outlineButtonClass}>
                      Mount inside dashed box
                    </TriggerButton>
                  )}
                </PopoverTrigger>
                <PopoverPortal>
                  <PopoverContent>
                    <PopoverPanel title="Custom container">
                      The portal node is rendered inside the dashed container.
                    </PopoverPanel>
                  </PopoverContent>
                </PopoverPortal>
              </Popover>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}

function PlacementPopover(props: {
  item: (typeof placementGroups)[number][number]
  edge?: boolean
}) {
  return (
    <Popover placement={props.item.placement} sideOffset={10} arrow>
      <PopoverTrigger>
        {(slot) => (
          <TriggerButton slot={slot} class={`${outlineButtonClass} w-24`}>
            {props.item.label}
          </TriggerButton>
        )}
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverPanel compact title={props.item.placement}>
            {props.edge
              ? 'Edge placements flip instead of shifting across the trigger.'
              : 'Single-axis placements shift; edge placements only flip.'}
          </PopoverPanel>
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  )
}
