<script lang="ts">
  import { useTheme } from '@fex-design/svelte/primitive/theme-provider/use-theme'

  let { title }: { title: string } = $props()
  const { controller, snapshot } = useTheme()
  const canSwitchTheme = $derived(
    !$snapshot.forcedTheme && $snapshot.themes.includes('light') && $snapshot.themes.includes('dark'),
  )
  const nextTheme = $derived($snapshot.resolvedTheme === 'dark' ? 'light' : 'dark')
</script>

<div class="rounded-md border border-border bg-card-background p-space-lg text-card-foreground shadow-card">
  <div class="space-y-space-sm">
    <p class="text-base font-medium">{title}</p>
    <p class="text-sm text-muted-foreground">theme: {$snapshot.theme}</p>
    <p class="text-sm text-muted-foreground">resolvedTheme: {$snapshot.resolvedTheme}</p>
    <p class="text-sm text-muted-foreground">forcedTheme: {$snapshot.forcedTheme ?? 'none'}</p>
  </div>
  <button
    class="mt-space-lg rounded-md border border-border bg-background px-space-lg py-space-sm text-sm text-foreground transition-colors hover:bg-hover-background disabled:cursor-not-allowed disabled:text-disabled-foreground"
    disabled={!canSwitchTheme}
    type="button"
    onclick={() => controller.setTheme(nextTheme)}
  >
    {$snapshot.forcedTheme ? 'Locked by forcedTheme' : `Switch to ${nextTheme}`}
  </button>
</div>
