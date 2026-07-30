import { Rate } from '@fex/components-solid/primitive/rate'
import Card from '@fex/components-solid/ui/card'
import { createSignal } from 'solid-js'
export function IntegerDemo() { const [value, setValue] = createSignal(3); return <Card title="Default integer" description="The default step is 1, so pointer and keyboard input select whole values."><div class="grid gap-space-sm"><Rate value={value()} onValueChange={setValue} aria-label="Integer rating" /><p class="text-sm text-muted-foreground">Current value: {value()}</p></div></Card> }
