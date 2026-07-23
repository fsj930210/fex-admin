import { Link } from 'react-router'
import { BasicTabsDemo } from './basic-demo'
import { CustomTabsDemo } from './custom-demo'
import { DynamicTabsDemo } from './dynamic-demo'
import { SortableTabsDemo } from './sortable-demo'
import { VariantTabsDemo } from './variant-demo'

export function TabsPage() { return <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div className="mx-auto w-full max-w-5xl space-y-space-xl"><header className="space-y-space-sm"><Link className="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</Link><div><h1 className="text-2xl font-semibold text-foreground">Tabs</h1><p className="max-w-3xl text-sm leading-6 text-muted-foreground">Composable tab navigation with lazy retained content, data-driven shortcuts and complete custom rendering.</p></div></header><div className="space-y-space-xl"><BasicTabsDemo/><VariantTabsDemo/><DynamicTabsDemo/><SortableTabsDemo/><CustomTabsDemo/></div></div></main> }
