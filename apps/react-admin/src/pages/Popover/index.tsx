import * as PrimitivePopover from '@fex/components-react/primitive/popover'
import { Button } from '@fex/components-react/ui/button'
import { Card } from '@fex/components-react/ui/card'
import { useState, type ReactNode } from 'react'
import { Link } from 'react-router'

function DemoSection(props: { title: string; description: string; children: ReactNode }) {
  return (
    <Card title={props.title} description={props.description}>
      <div className="flex min-w-0 flex-wrap items-center gap-space-md">{props.children}</div>
    </Card>
  )
}

function PopoverPanel(props: { title: string; children: ReactNode; compact?: boolean }) {
  return (
    <div className={props.compact ? 'w-44' : 'w-64'}>
      <PrimitivePopover.PopoverHeader>
        <PrimitivePopover.PopoverTitle>{props.title}</PrimitivePopover.PopoverTitle>
        <PrimitivePopover.PopoverDescription>{props.children}</PrimitivePopover.PopoverDescription>
      </PrimitivePopover.PopoverHeader>
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

export function PopoverPage() {
  const [open, setOpen] = useState(false)
  const [container, setContainer] = useState<HTMLDivElement | null>(null)

  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-xl">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">
            Back home
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Popover</h1>
            <p className="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
              React adapter for the shared core floating overlay, covering triggers, placement,
              controlled state and custom popup containers.
            </p>
          </div>
        </header>

        <div className="space-y-space-xl">
          <DemoSection title="Primitive" description="Low-level composition API. Trigger exposes render props.">
            <PrimitivePopover.PopoverRoot side="bottom" align="start" sideOffset={8} arrow>
              <PrimitivePopover.PopoverTrigger>
                {(triggerProps) => (
                  <button {...triggerProps} className="text-sm text-foreground hover:text-primary">
                    Primitive trigger
                  </button>
                )}
              </PrimitivePopover.PopoverTrigger>
              <PrimitivePopover.PopoverPortal>
                <PrimitivePopover.PopoverContent>
                  <PrimitivePopover.PopoverArrow />
                  <PopoverPanel title="Primitive content">
                    Content uses shared floating variables and data attributes.
                  </PopoverPanel>
                </PrimitivePopover.PopoverContent>
              </PrimitivePopover.PopoverPortal>
            </PrimitivePopover.PopoverRoot>
          </DemoSection>

          <DemoSection title="Ui" description="Business UI can compose Button without an extra wrapper protocol.">
            <PrimitivePopover.PopoverRoot placement="bottomLeft" sideOffset={8} arrow>
              <PrimitivePopover.PopoverTrigger>
                {(triggerProps) => (
                  <Button {...triggerProps} variant="outline">
                    Click
                  </Button>
                )}
              </PrimitivePopover.PopoverTrigger>
              <PrimitivePopover.PopoverPortal>
                <PrimitivePopover.PopoverContent>
                  <PrimitivePopover.PopoverArrow />
                  <PopoverPanel title="Click trigger">
                    The popover opens immediately while positioning stays in CSS variables.
                  </PopoverPanel>
                </PrimitivePopover.PopoverContent>
              </PrimitivePopover.PopoverPortal>
            </PrimitivePopover.PopoverRoot>
          </DemoSection>

          <DemoSection title="Triggers" description="Supports click, hover, focus and context-menu.">
            <PrimitivePopover.PopoverRoot trigger={['hover', 'focus']} hoverCloseDelay={120} arrow>
              <PrimitivePopover.PopoverTrigger>
                {(triggerProps) => (
                  <Button {...triggerProps} variant="secondary">
                    Hover or focus
                  </Button>
                )}
              </PrimitivePopover.PopoverTrigger>
              <PrimitivePopover.PopoverPortal>
                <PrimitivePopover.PopoverContent>
                  <PrimitivePopover.PopoverArrow />
                  <PopoverPanel title="Combined trigger">
                    Hover and focus share one trigger source model, so they do not close each other incorrectly.
                  </PopoverPanel>
                </PrimitivePopover.PopoverContent>
              </PrimitivePopover.PopoverPortal>
            </PrimitivePopover.PopoverRoot>

            <PrimitivePopover.PopoverRoot trigger={['context-menu']} placement="rightTop" sideOffset={8}>
              <PrimitivePopover.PopoverTrigger>
                {(triggerProps) => (
                  <Button {...triggerProps} variant="outline">
                    Right click
                  </Button>
                )}
              </PrimitivePopover.PopoverTrigger>
              <PrimitivePopover.PopoverPortal>
                <PrimitivePopover.PopoverContent>
                  <PopoverPanel title="Context menu trigger">
                    This is still Popover content; future ContextMenu will reuse the same trigger and floating core with Menu.
                  </PopoverPanel>
                </PrimitivePopover.PopoverContent>
              </PrimitivePopover.PopoverPortal>
            </PrimitivePopover.PopoverRoot>
          </DemoSection>

          <DemoSection title="Placement" description="Supports antd placement and Radix side/align options.">
            <div className="flex w-full flex-col items-center gap-space-md py-space-lg">
              {placementGroups.map((group, rowIndex) => (
                <div
                  key={rowIndex}
                  className="grid w-full max-w-xl grid-cols-[repeat(3,minmax(80px,1fr))] items-center gap-x-space-lg gap-y-space-md"
                >
                  {rowIndex > 0 && rowIndex < 4 ? (
                    <>
                      <div className="justify-self-start">
                        <PlacementPopover item={group[0]} edge />
                      </div>
                      <div />
                      <div className="justify-self-end">
                        <PlacementPopover item={group[1]} edge />
                      </div>
                    </>
                  ) : (
                    group.map((item) => (
                      <div key={item.placement} className="justify-self-center">
                        <PlacementPopover item={item} />
                      </div>
                    ))
                  )}
                </div>
              ))}
            </div>
          </DemoSection>

          <DemoSection title="Offsets" description="Tune main-axis sideOffset and cross-axis alignOffset.">
            <PrimitivePopover.PopoverRoot placement="bottomLeft" sideOffset={18} arrow>
              <PrimitivePopover.PopoverTrigger>
                {(triggerProps) => (
                  <Button {...triggerProps} variant="outline">
                    sideOffset 18
                  </Button>
                )}
              </PrimitivePopover.PopoverTrigger>
              <PrimitivePopover.PopoverPortal>
                <PrimitivePopover.PopoverContent>
                  <PrimitivePopover.PopoverArrow />
                  <PopoverPanel title="Main-axis offset">
                    sideOffset increases the distance between trigger and content.
                  </PopoverPanel>
                </PrimitivePopover.PopoverContent>
              </PrimitivePopover.PopoverPortal>
            </PrimitivePopover.PopoverRoot>

            <PrimitivePopover.PopoverRoot placement="bottomLeft" sideOffset={8} alignOffset={28} arrow>
              <PrimitivePopover.PopoverTrigger>
                {(triggerProps) => (
                  <Button {...triggerProps} variant="outline">
                    alignOffset 28
                  </Button>
                )}
              </PrimitivePopover.PopoverTrigger>
              <PrimitivePopover.PopoverPortal>
                <PrimitivePopover.PopoverContent>
                  <PrimitivePopover.PopoverArrow />
                  <PopoverPanel title="Cross-axis offset">
                    alignOffset moves the aligned edge along the cross axis.
                  </PopoverPanel>
                </PrimitivePopover.PopoverContent>
              </PrimitivePopover.PopoverPortal>
            </PrimitivePopover.PopoverRoot>
          </DemoSection>

          <DemoSection title="Controlled" description="Controlled mode only requests outside updates.">
            <PrimitivePopover.PopoverRoot open={open} onOpenChange={setOpen} placement="bottomLeft" arrow>
              <PrimitivePopover.PopoverTrigger>
                {(triggerProps) => (
                  <Button {...triggerProps} variant={open ? 'secondary' : 'outline'}>
                    {open ? 'Controlled open' : 'Controlled closed'}
                  </Button>
                )}
              </PrimitivePopover.PopoverTrigger>
              <PrimitivePopover.PopoverPortal>
                <PrimitivePopover.PopoverContent>
                  <PrimitivePopover.PopoverArrow />
                  <PopoverPanel title="Controlled popover">
                    Click outside or press Escape to request closing through onOpenChange.
                  </PopoverPanel>
                </PrimitivePopover.PopoverContent>
              </PrimitivePopover.PopoverPortal>
            </PrimitivePopover.PopoverRoot>
          </DemoSection>

          <Card title="getPopupContainer" description="Portal can mount into a custom container.">
            <div ref={setContainer} className="relative min-h-40 rounded-md border border-dashed p-space-lg">
              <PrimitivePopover.PopoverRoot getPopupContainer={() => container ?? document.body} placement="bottomLeft">
                <PrimitivePopover.PopoverTrigger>
                  {(triggerProps) => (
                    <Button {...triggerProps} variant="outline">
                      Mount inside dashed box
                    </Button>
                  )}
                </PrimitivePopover.PopoverTrigger>
                <PrimitivePopover.PopoverPortal>
                  <PrimitivePopover.PopoverContent>
                    <PopoverPanel title="Custom container">
                      The portal node is rendered inside the dashed container.
                    </PopoverPanel>
                  </PrimitivePopover.PopoverContent>
                </PrimitivePopover.PopoverPortal>
              </PrimitivePopover.PopoverRoot>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}

function PlacementPopover(props: { item: (typeof placementGroups)[number][number]; edge?: boolean }) {
  return (
    <PrimitivePopover.PopoverRoot placement={props.item.placement} sideOffset={10} arrow>
      <PrimitivePopover.PopoverTrigger>
        {(triggerProps) => (
          <Button {...triggerProps} className="w-24" variant="outline">
            {props.item.label}
          </Button>
        )}
      </PrimitivePopover.PopoverTrigger>
      <PrimitivePopover.PopoverPortal>
        <PrimitivePopover.PopoverContent>
          <PrimitivePopover.PopoverArrow />
          <PopoverPanel compact title={props.item.placement}>
            {props.edge ? 'Edge placements flip instead of shifting across the trigger.' : 'Single-axis placements shift; edge placements only flip.'}
          </PopoverPanel>
        </PrimitivePopover.PopoverContent>
      </PrimitivePopover.PopoverPortal>
    </PrimitivePopover.PopoverRoot>
  )
}
