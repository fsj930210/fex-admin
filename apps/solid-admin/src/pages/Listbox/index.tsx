import { A } from '@solidjs/router'
import { Card } from '@fex/components-solid/ui/card'
import {
  ListboxItem as PrimitiveListboxItem,
  ListboxRoot as PrimitiveListboxRoot,
} from '@fex/components-solid/primitive/listbox'
import {
  ListboxGroup,
  ListboxGroupLabel,
  ListboxItem,
  ListboxRoot,
} from '@fex/components-solid/ui/listbox'
import { createSignal, For, type JSX } from 'solid-js'

const tricks = [
  {
    value: 'kickflip',
    title: 'Kickflip',
    description: 'Flip the board 360 degrees along its long axis',
  },
  {
    value: 'heelflip',
    title: 'Heelflip',
    description: 'Flip the board in the opposite direction of a kickflip',
  },
  { value: 'tre-flip', title: 'Tre Flip', description: 'A 360 flip with a backside shove-it' },
  {
    value: 'fs-540',
    title: 'FS 540',
    description: 'Flip the board 540 degrees along its long axis',
  },
  {
    value: 'mc-twist',
    title: '360 Varial McTwist',
    description: 'A 540 inverted aerial with board rotation',
  },
  {
    value: 'the-900',
    title: 'The 900',
    description: 'Legendary 900 aerial rotation pioneered by Tony Hawk',
  },
] as const

export function ListboxPage(): JSX.Element {
  const [selectedTrick, setSelectedTrick] = createSignal<string | number | undefined>('kickflip')
  const [selectedTricks, setSelectedTricks] = createSignal<(string | number)[]>([
    'kickflip',
    'heelflip',
  ])

  return (
    <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div class="mx-auto w-full max-w-5xl space-y-space-xl">
        <header class="space-y-space-md">
          <A class="text-sm text-muted-foreground hover:text-foreground" href="/">
            Back home
          </A>
          <div>
            <h1 class="text-2xl font-semibold text-foreground">Listbox</h1>
            <p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
              Selection list primitives with single, multiple, vertical, horizontal and grouped
              layouts.
            </p>
          </div>
        </header>

        <div class="space-y-space-xl">
          <Card
            title="Primitive"
            description="Headless root and item parts without default item layout."
          >
            <PrimitiveListboxRoot
              items={tricks}
              defaultValue="kickflip"
              class="flex max-w-xl flex-col gap-2"
            >
              <For each={tricks.slice(0, 3)}>
                {(trick) => (
                  <PrimitiveListboxItem
                    value={trick.value}
                    class="rounded-md border border-border bg-background p-3 text-sm data-[selected=true]:border-primary/40 data-[selected=true]:bg-primary/5"
                  >
                    {trick.title}
                  </PrimitiveListboxItem>
                )}
              </For>
            </PrimitiveListboxRoot>
          </Card>

          <Card title="Single" description="Controlled single selection uses onChange.">
            <ListboxRoot
              items={tricks}
              value={selectedTrick()}
              onChange={(value) => setSelectedTrick(Array.isArray(value) ? value[0] : value)}
              class="max-w-xl"
            >
              <For each={tricks.slice(0, 4)}>
                {(trick) => (
                  <ListboxItem
                    value={trick.value}
                    title={trick.title}
                    description={trick.description}
                  />
                )}
              </For>
            </ListboxRoot>
          </Card>

          <Card title="Multiple" description="Multiple selection returns an array.">
            <ListboxRoot
              multiple
              items={tricks}
              value={selectedTricks()}
              onChange={(values) =>
                setSelectedTricks(
                  Array.isArray(values) ? values : values === undefined ? [] : [values],
                )
              }
              class="max-w-xl"
            >
              <For each={tricks.slice(0, 4)}>
                {(trick) => (
                  <ListboxItem
                    value={trick.value}
                    title={trick.title}
                    description={trick.description}
                  />
                )}
              </For>
            </ListboxRoot>
          </Card>

          <Card title="Horizontal" description="Horizontal orientation lays items out in rows.">
            <ListboxRoot items={tricks} defaultValue="tre-flip" orientation="horizontal">
              <For each={tricks.slice(0, 4)}>
                {(trick) => (
                  <ListboxItem
                    class="w-56"
                    value={trick.value}
                    title={trick.title}
                    description={trick.description}
                  />
                )}
              </For>
            </ListboxRoot>
          </Card>

          <Card title="Grouped Items" description="Group related options with the same controller.">
            <ListboxRoot
              multiple
              items={tricks}
              defaultValue={['kickflip', 'heelflip']}
              class="mx-auto max-w-xl"
            >
              <ListboxGroup>
                <ListboxGroupLabel>Basic Tricks</ListboxGroupLabel>
                <For each={tricks.slice(0, 2)}>
                  {(trick) => (
                    <ListboxItem
                      value={trick.value}
                      title={trick.title}
                      description={trick.description}
                    />
                  )}
                </For>
              </ListboxGroup>
              <ListboxGroup>
                <ListboxGroupLabel>Advanced Tricks</ListboxGroupLabel>
                <For each={tricks.slice(4)}>
                  {(trick) => (
                    <ListboxItem
                      value={trick.value}
                      title={trick.title}
                      description={trick.description}
                    />
                  )}
                </For>
              </ListboxGroup>
            </ListboxRoot>
          </Card>

          <Card
            title="Disabled"
            description="Disabled values can be displayed as selected but cannot be changed by user actions."
          >
            <ListboxRoot items={tricks} defaultValue="fs-540" class="max-w-xl">
              <For each={tricks.slice(2, 5)}>
                {(trick) => (
                  <ListboxItem
                    value={trick.value}
                    disabled={trick.value === 'fs-540'}
                    title={trick.title}
                    description={trick.description}
                  />
                )}
              </For>
            </ListboxRoot>
          </Card>
        </div>
      </div>
    </main>
  )
}
