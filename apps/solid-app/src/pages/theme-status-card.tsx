import { useTheme } from '@fex-design/solid/primitive/theme-provider/use-theme'
import { createMemo } from 'solid-js'

export function ThemeStatusCard(props: { title: string }) {
  const { controller, snapshot } = useTheme()
  const canSwitchTheme = createMemo(
    () => !snapshot().forcedTheme && snapshot().themes.includes('light') && snapshot().themes.includes('dark'),
  )
  const nextTheme = createMemo(() => (snapshot().resolvedTheme === 'dark' ? 'light' : 'dark'))

  return (
    <div class="rounded-md border border-border bg-card-background p-space-lg text-card-foreground shadow-card">
      <div class="space-y-space-sm">
        <p class="text-base font-medium">{props.title}</p>
        <p class="text-sm text-muted-foreground">theme: {snapshot().theme}</p>
        <p class="text-sm text-muted-foreground">resolvedTheme: {snapshot().resolvedTheme}</p>
        <p class="text-sm text-muted-foreground">forcedTheme: {snapshot().forcedTheme ?? 'none'}</p>
      </div>
      <button
        class="mt-space-lg rounded-md border border-border bg-background px-space-lg py-space-sm text-sm text-foreground transition-colors hover:bg-hover-background disabled:cursor-not-allowed disabled:text-disabled-foreground"
        disabled={!canSwitchTheme()}
        type="button"
        onClick={() => controller.setTheme(nextTheme())}
      >
        {snapshot().forcedTheme ? 'Locked by forcedTheme' : `Switch to ${nextTheme()}`}
      </button>
    </div>
  )
}
