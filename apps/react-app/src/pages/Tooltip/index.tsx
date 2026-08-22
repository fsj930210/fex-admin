import { Card } from '@fex-design/react/ui/card'
import { Link } from 'react-router'
import { BasicDemo } from './basic-demo'
import { ControlledDemo } from './controlled-demo'
import { DisabledDemo } from './disabled-demo'
import { PlacementDemo } from './placement-demo'
import { StyleDemo } from './style-demo'
export function TooltipPage() {
  return <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div className="mx-auto w-full max-w-5xl space-y-space-xl"><header className="space-y-space-md"><Link className="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</Link><div><h1 className="text-2xl font-semibold">Tooltip</h1><p className="mt-2 text-sm text-muted-foreground">Accessible hover and focus descriptions built on the shared floating core.</p></div></header><div className="space-y-space-xl"><Card title="Basic and shortcut" description="Arrow is an explicit primitive; content can compose the library Kbd component."><BasicDemo /></Card><Card title="Placement" description="All placement values come directly from the existing floating API."><PlacementDemo /></Card><Card title="Disabled control" description="A focusable wrapper explains why the native disabled button is unavailable."><DisabledDemo /></Card><Card title="Styles and arrow" description="One CSS variable colors Content and Arrow; omit Arrow when it is not wanted."><StyleDemo /></Card><Card title="Controlled" description="The parent owns open while hover, focus and Escape request changes."><ControlledDemo /></Card></div></div></main>
}
