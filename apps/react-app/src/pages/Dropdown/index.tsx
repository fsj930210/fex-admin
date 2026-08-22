import { Card } from '@fex-design/react/ui/card'
import { Link } from 'react-router'
import { BasicDemo } from './basic-demo'
import { CustomPanelDemo } from './custom-panel-demo'
import { CustomTriggerDemo } from './custom-trigger-demo'
import { NestedDemo } from './nested-demo'

export function DropdownPage() {
  return <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div className="mx-auto w-full max-w-5xl space-y-space-xl"><header className="space-y-space-md"><Link className="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</Link><div><h1 className="text-2xl font-semibold">Dropdown</h1><p className="mt-2 text-sm text-muted-foreground">Primitive composition of Popover and Menu without a second menu system.</p></div></header><div className="space-y-space-xl"><Card title="Basic" description="A regular action menu."><BasicDemo /></Card><Card title="Nested menus" description="Each parent item is the trigger for another Popover containing the same Menu primitive."><NestedDemo /></Card><Card title="Custom panel" description="Content is composable and is not restricted to menu data."><CustomPanelDemo /></Card><Card title="Custom trigger" description="Trigger render props bind behavior to the caller's element."><CustomTriggerDemo /></Card></div></div></main>
}
