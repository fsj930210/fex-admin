import { Separator } from '@fex-design/solid/primitive/separator'
import { Card } from '@fex-design/solid/ui/card'
import { For, Show } from 'solid-js'
export const BasicDemo = () => (
  <Card title="Basic" description="Separate related sections with a semantic horizontal rule.">
    <div class="grid max-w-xl gap-space-md">
      <div>
        <div class="font-medium">Fex Design</div>
        <div class="text-sm text-muted-foreground">Composable components for five frameworks.</div>
      </div>
      <Separator decorative={false} />
      <div class="text-sm">React · Vue · Solid · Svelte · Angular</div>
    </div>
  </Card>
)
export const VerticalDemo = () => (
  <Card title="Vertical" description="Use vertical separators between compact inline items.">
    <div class="flex h-5 items-center gap-space-md">
      <span>Blog</span>
      <Separator orientation="vertical" />
      <span>Docs</span>
      <Separator orientation="vertical" />
      <span>Source</span>
    </div>
  </Card>
)
export const MenuDemo = () => (
  <Card title="Menu" description="Divide groups without splitting related menu items.">
    <div class="grid max-w-sm gap-space-sm">
      <div>
        <div class="font-medium">Settings</div>
        <div class="text-sm text-muted-foreground">Manage preferences</div>
      </div>
      <div>
        <div class="font-medium">Account</div>
        <div class="text-sm text-muted-foreground">Profile and security</div>
      </div>
      <Separator />
      <div>
        <div class="font-medium">Sign out</div>
        <div class="text-sm text-muted-foreground">End the current session</div>
      </div>
    </div>
  </Card>
)
const items = [
  ['Workspace', 'Fex Design'],
  ['Plan', 'Team'],
  ['Region', 'Asia Pacific'],
]
export const ListDemo = () => (
  <Card title="List" description="Place separators between rows, not after the final item.">
    <div class="grid max-w-lg">
      <For each={items}>
        {([label, value], index) => (
          <div>
            <div class="flex justify-between py-space-md">
              <span>{label}</span>
              <span class="text-muted-foreground">{value}</span>
            </div>
            <Show when={index() < items.length - 1}>
              <Separator />
            </Show>
          </div>
        )}
      </For>
    </div>
  </Card>
)
const Labeled = (props: { label: string; placement: 'start' | 'center' | 'end' }) => (
  <div class="flex items-center gap-space-md">
    <Separator class={props.placement === 'start' ? 'w-12' : 'flex-1'} />
    <span class="shrink-0 text-sm text-muted-foreground">{props.label}</span>
    <Separator class={props.placement === 'end' ? 'w-12' : 'flex-1'} />
  </div>
)
export const TextDemo = () => (
  <Card
    title="With Text"
    description="Compose a label between two separators and control its placement."
  >
    <div class="grid max-w-xl gap-space-xl">
      <Labeled label="Start" placement="start" />
      <Labeled label="Center" placement="center" />
      <Labeled label="End" placement="end" />
    </div>
  </Card>
)
export const VariantsDemo = () => (
  <Card title="Variants" description="Use class composition for solid, dashed and dotted rules.">
    <div class="grid max-w-xl gap-space-lg">
      <div class="grid gap-space-sm">
        <span class="text-sm">Solid</span>
        <Separator />
      </div>
      <div class="grid gap-space-sm">
        <span class="text-sm">Dashed</span>
        <Separator class="h-0 border-t border-dashed bg-transparent" />
      </div>
      <div class="grid gap-space-sm">
        <span class="text-sm">Dotted</span>
        <Separator class="h-0 border-t border-dotted bg-transparent" />
      </div>
    </div>
  </Card>
)
