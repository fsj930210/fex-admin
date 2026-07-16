import { SwitchRoot, SwitchThumb } from '@fex/components-solid/primitive/switch'
import { Card } from '@fex/components-solid/ui/card'
import { A } from '@solidjs/router'
import { createSignal } from 'solid-js'

export function SwitchPage() {
  const [checked, setChecked] = createSignal(true)
  return (
    <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div class="mx-auto w-full max-w-5xl space-y-space-xl">
        <header class="space-y-space-xl">
          <A class="text-sm text-muted-foreground hover:text-foreground" href="/">
            Back home
          </A>
          <div>
            <h1 class="text-2xl font-semibold text-foreground">Switch</h1>
            <p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
              Boolean toggle UI with controlled and uncontrolled usage.
            </p>
          </div>
        </header>
        <div class="space-y-space-xl">
          <Card title="Basic" description="Uncontrolled switch uses defaultChecked.">
            <SwitchRoot defaultChecked aria-label="Enable notifications">
              <SwitchThumb />
            </SwitchRoot>
          </Card>
          <Card
            title="Controlled"
            description="Controlled switch uses checked and onCheckedChange."
          >
            <div class="grid gap-space-md">
              <SwitchRoot
                checked={checked()}
                onCheckedChange={setChecked}
                aria-label="Controlled switch"
              >
                <SwitchThumb />
              </SwitchRoot>
              <p class="text-sm text-muted-foreground">Current value: {String(checked())}</p>
            </div>
          </Card>
          <Card title="Sizes" description="Switch supports sm, default, and lg sizes.">
            <div class="flex items-center gap-space-md">
              <SwitchRoot size="sm" defaultChecked aria-label="Small switch">
                <SwitchThumb />
              </SwitchRoot>
              <SwitchRoot defaultChecked aria-label="Default switch">
                <SwitchThumb />
              </SwitchRoot>
              <SwitchRoot size="lg" defaultChecked aria-label="Large switch">
                <SwitchThumb />
              </SwitchRoot>
            </div>
          </Card>
          <Card title="Disabled" description="Disabled state blocks interaction.">
            <div class="flex items-center gap-space-md">
              <SwitchRoot disabled aria-label="Disabled switch">
                <SwitchThumb />
              </SwitchRoot>
              <SwitchRoot disabled defaultChecked aria-label="Disabled checked switch">
                <SwitchThumb />
              </SwitchRoot>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
