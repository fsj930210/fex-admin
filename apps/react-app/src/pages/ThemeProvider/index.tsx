import { ThemeProvider } from '@fex-design/react/primitive/theme-provider'
import { useTheme } from '@fex-design/react/primitive/theme-provider/use-theme'
import { Card } from '@fex-design/react/ui/card'
import { useState } from 'react'
import { Link } from 'react-router'

function ThemeStatusCard({ title }: { title: string }) {
  const { forcedTheme, resolvedTheme, setTheme, theme, themes } = useTheme()
  const canSwitchTheme = !forcedTheme && themes.includes('light') && themes.includes('dark')
  const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark'

  return (
    <div className="rounded-md border border-border bg-card-background p-space-lg text-card-foreground shadow-card">
      <div className="space-y-space-sm">
        <p className="text-base font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">theme: {theme}</p>
        <p className="text-sm text-muted-foreground">resolvedTheme: {resolvedTheme}</p>
        <p className="text-sm text-muted-foreground">forcedTheme: {forcedTheme ?? 'none'}</p>
      </div>
      <button
        className="mt-space-lg rounded-md border border-border bg-background px-space-lg py-space-sm text-sm text-foreground transition-colors hover:bg-hover-background disabled:cursor-not-allowed disabled:text-disabled-foreground"
        disabled={!canSwitchTheme}
        type="button"
        onClick={() => setTheme(nextTheme)}
      >
        {forcedTheme ? 'Locked by forcedTheme' : `Switch to ${nextTheme}`}
      </button>
    </div>
  )
}

export function ThemeProviderPage() {
  const [inheritedTheme, setInheritedTheme] = useState<'light' | 'dark'>('dark')
  const [innerTheme, setInnerTheme] = useState<'light' | 'dark'>('light')
  const [customTheme, setCustomTheme] = useState<'light' | 'dark' | 'admin-blue'>('admin-blue')

  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-xl">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">
            Back home
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">ThemeProvider</h1>
            <p className="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
              ThemeProvider supports local scopes, inherited scopes, custom local themes, multiple
              themes on the same page, and a forcedTheme override with the highest priority.
            </p>
          </div>
        </header>

        <div className="space-y-space-xl">
          <Card title="Local Scope" description="A local provider applies theme variables to its own wrapper.">
            <ThemeProvider
              scope="local"
              storageKey="fex-theme-provider-local-demo"
              className="rounded-md bg-background p-space-lg text-foreground"
            >
              <ThemeStatusCard title="Interactive local theme" />
            </ThemeProvider>
          </Card>

          <Card title="Multiple Themes" description="Independent local scopes can render light and dark together.">
            <div className="grid gap-space-lg md:grid-cols-2">
              <ThemeProvider
                scope="local"
                forcedTheme="light"
                className="rounded-md bg-background p-space-lg text-foreground"
              >
                <ThemeStatusCard title="Forced light scope" />
              </ThemeProvider>
              <ThemeProvider
                scope="local"
                forcedTheme="dark"
                className="rounded-md bg-background p-space-lg text-foreground"
              >
                <ThemeStatusCard title="Forced dark scope" />
              </ThemeProvider>
            </div>
          </Card>

          <Card
            title="Inherited Scope"
            description="Three nested providers: parent can switch, inherited child follows it, inner local scope stays independent."
          >
            <ThemeProvider
              scope="local"
              forcedTheme={inheritedTheme}
              className="rounded-md bg-background p-space-lg text-foreground"
            >
              <button
                className="mb-space-lg rounded-md border border-border bg-card-background px-space-lg py-space-sm text-sm text-card-foreground transition-colors hover:bg-hover-background"
                type="button"
                onClick={() => setInheritedTheme((theme) => (theme === 'dark' ? 'light' : 'dark'))}
              >
                Switch parent to {inheritedTheme === 'dark' ? 'light' : 'dark'}
              </button>
              <div className="grid gap-space-lg lg:grid-cols-3">
                <ThemeStatusCard title={'Parent local ' + inheritedTheme + ' scope'} />
                <ThemeProvider scope="inherit">
                  <div className="space-y-space-lg rounded-md border border-border bg-background p-space-lg">
                    <ThemeStatusCard title="Inherited middle scope" />
                    <ThemeProvider
                      scope="local"
                      forcedTheme={innerTheme}
                      className="rounded-md bg-background p-space-lg text-foreground"
                    >
                      <button
                        className="mb-space-lg rounded-md border border-border bg-card-background px-space-lg py-space-sm text-sm text-card-foreground transition-colors hover:bg-hover-background"
                        type="button"
                        onClick={() => setInnerTheme((theme) => (theme === 'dark' ? 'light' : 'dark'))}
                      >
                        Switch inner to {innerTheme === 'dark' ? 'light' : 'dark'}
                      </button>
                      <ThemeStatusCard title={'Inner independent ' + innerTheme + ' scope'} />
                    </ThemeProvider>
                  </div>
                </ThemeProvider>
              </div>
            </ThemeProvider>
          </Card>

          <Card
            title="Custom Local Theme"
            description="A local provider can resolve a non-global theme name and expose it through data-theme."
          >
            <ThemeProvider
              scope="local"
              attribute="data-theme"
              themes={['light', 'dark', 'admin-blue']}
              defaultTheme="admin-blue"
              forcedTheme={customTheme}
              colorSchemeMap={{ 'admin-blue': 'light' }}
              className="rounded-md border border-border bg-background p-space-lg text-foreground data-[theme=admin-blue]:[--background:oklch(0.97_0.04_245)] data-[theme=admin-blue]:[--card-background:oklch(0.99_0.025_245)] data-[theme=admin-blue]:[--card-foreground:oklch(0.25_0.08_250)] data-[theme=admin-blue]:[--foreground:oklch(0.22_0.08_250)] data-[theme=admin-blue]:[--muted-foreground:oklch(0.45_0.06_250)] data-[theme=admin-blue]:[--border:oklch(0.82_0.07_245)]"
            >
              <div className="mb-space-lg flex flex-wrap gap-space-sm">
                {(['admin-blue', 'light', 'dark'] as const).map((theme) => (
                  <button
                    key={theme}
                    className="rounded-md border border-border bg-card-background px-space-md py-space-sm text-sm text-card-foreground transition-colors hover:bg-hover-background disabled:cursor-default disabled:bg-selected-background"
                    disabled={customTheme === theme}
                    type="button"
                    onClick={() => setCustomTheme(theme)}
                  >
                    {theme}
                  </button>
                ))}
              </div>
              <ThemeStatusCard title="Local admin-blue theme" />
            </ThemeProvider>
          </Card>

          <Card
            title="Forced Theme Priority"
            description="When forcedTheme is set, setTheme is ignored and the resolved theme remains locked."
          >
            <ThemeProvider
              scope="local"
              defaultTheme="light"
              forcedTheme="dark"
              className="rounded-md bg-background p-space-lg text-foreground"
            >
              <ThemeStatusCard title="Locked dark theme" />
            </ThemeProvider>
          </Card>
        </div>
      </div>
    </main>
  )
}
