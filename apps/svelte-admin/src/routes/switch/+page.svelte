<script lang="ts">
  import SwitchRoot from '@fex/components-svelte/primitive/switch'
  import SwitchThumb from '@fex/components-svelte/primitive/switch-thumb'
  import Card from '@fex/components-svelte/ui/card'
  let checked = $state(true)
</script>
<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div class="mx-auto w-full max-w-5xl space-y-space-xl">
  <header class="space-y-space-xl"><a class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</a><div><h1 class="text-2xl font-semibold text-foreground">Switch</h1><p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">Boolean toggle UI with controlled and uncontrolled usage.</p></div></header>
  <div class="space-y-space-xl">
    <Card title="Basic" description="Uncontrolled switch uses defaultChecked."><SwitchRoot defaultChecked aria-label="Enable notifications">{#snippet children(_checked, state)}<SwitchThumb {state} />{/snippet}</SwitchRoot></Card>
    <Card title="Controlled" description="Controlled switch uses checked and onCheckedChange."><div class="grid gap-space-md"><SwitchRoot {checked} onCheckedChange={(next) => (checked = next)} aria-label="Controlled switch">{#snippet children(_checked, state)}<SwitchThumb {state} />{/snippet}</SwitchRoot><p class="text-sm text-muted-foreground">Current value: {String(checked)}</p></div></Card>
    <Card title="Sizes" description="Switch supports sm, default, and lg sizes."><div class="flex items-center gap-space-md"><SwitchRoot size="sm" defaultChecked aria-label="Small switch">{#snippet children(_checked, state)}<SwitchThumb size="sm" {state} />{/snippet}</SwitchRoot><SwitchRoot defaultChecked aria-label="Default switch">{#snippet children(_checked, state)}<SwitchThumb {state} />{/snippet}</SwitchRoot><SwitchRoot size="lg" defaultChecked aria-label="Large switch">{#snippet children(_checked, state)}<SwitchThumb size="lg" {state} />{/snippet}</SwitchRoot></div></Card>
    <Card title="Disabled" description="Disabled state blocks interaction."><div class="flex items-center gap-space-md"><SwitchRoot disabled aria-label="Disabled switch">{#snippet children(_checked, state)}<SwitchThumb {state} />{/snippet}</SwitchRoot><SwitchRoot disabled defaultChecked aria-label="Disabled checked switch">{#snippet children(_checked, state)}<SwitchThumb {state} />{/snippet}</SwitchRoot></div></Card>
  </div>
</div></main>
