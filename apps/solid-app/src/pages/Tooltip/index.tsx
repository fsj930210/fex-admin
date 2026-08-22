import { Card } from '@fex-design/solid/ui/card'
import { A } from '@solidjs/router'
import { BasicDemo } from './basic-demo'
import { ControlledDemo } from './controlled-demo'
import { DisabledDemo } from './disabled-demo'
import { PlacementDemo } from './placement-demo'
import { StyleDemo } from './style-demo'
export function TooltipPage() { return <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div class="mx-auto w-full max-w-5xl space-y-space-xl"><header class="space-y-space-md"><A class="text-sm text-muted-foreground" href="/">Back home</A><div><h1 class="text-2xl font-semibold">Tooltip</h1><p class="mt-2 text-sm text-muted-foreground">Accessible hover and focus descriptions built on the shared floating core.</p></div></header><div class="space-y-space-xl"><Card title="Basic and shortcut" description="Arrow is explicit and content composes Kbd."><BasicDemo /></Card><Card title="Placement" description="Uses existing floating placements."><PlacementDemo /></Card><Card title="Disabled control" description="A focusable wrapper owns Tooltip events."><DisabledDemo /></Card><Card title="Styles and arrow" description="One variable colors Content and Arrow."><StyleDemo /></Card><Card title="Controlled" description="The parent owns open state."><ControlledDemo /></Card></div></div></main> }
