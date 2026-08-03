import { Link } from 'react-router'
import { AlternateDemo } from './alternate-demo'
import { BasicDemo } from './basic-demo'
import { CustomNodeDemo } from './custom-node-demo'
import { HorizontalDemo } from './horizontal-demo'
import { IconDemo } from './icon-demo'
import { PlacementDemo } from './placement-demo'
import { ReverseDemo } from './reverse-demo'
import { StatusDemo } from './status-demo'

export function TimelinePage() {
  return <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div className="mx-auto w-full max-w-5xl space-y-space-xl"><header className="space-y-space-xl"><Link className="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</Link><div><h1 className="text-2xl font-semibold text-foreground">Timeline</h1><p className="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">Composable vertical and horizontal timelines with open statuses, custom indicators and per-item placement.</p></div></header><div className="space-y-space-xl"><BasicDemo /><StatusDemo /><IconDemo /><CustomNodeDemo /><AlternateDemo /><PlacementDemo /><HorizontalDemo /><ReverseDemo /></div></div></main>
}
