import { Card } from '@fex/components-react/ui/card'
import { BasicDemo } from './basic-demo'
import { HeaderFooterDemo } from './header-footer-demo'
import { NestedDemo } from './nested-demo'
import { PlacementDemo } from './placement-demo'
import { PresetDemo } from './preset-demo'
import { SizeDemo } from './size-demo'
export function DrawerPage() { return <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div className="mx-auto max-w-5xl space-y-space-xl"><header><h1 className="text-2xl font-semibold">Drawer</h1><p className="mt-2 text-sm text-muted-foreground">Composable drawer primitives.</p></header><Card title="Basic and mask"><BasicDemo /></Card><Card title="Placement"><PlacementDemo /></Card><Card title="Presets"><PresetDemo /></Card><Card title="Header and footer"><HeaderFooterDemo /></Card><Card title="Resizable size"><SizeDemo /></Card><Card title="Nested"><NestedDemo /></Card></div></main> }
