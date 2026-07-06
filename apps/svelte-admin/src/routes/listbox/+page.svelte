<script lang="ts">
  import Card from '@fex/components-svelte/ui/card'
  import Listbox from '@fex/components-svelte/ui/listbox'
  import ListboxGroup from '@fex/components-svelte/ui/listbox-group'
  import ListboxGroupLabel from '@fex/components-svelte/ui/listbox-group-label'
  import ListboxItem from '@fex/components-svelte/ui/listbox-item'
  import PrimitiveListbox from '@fex/components-svelte/primitive/listbox'
  import PrimitiveListboxItem from '@fex/components-svelte/primitive/listbox-item'

  const tricks = [
    { value: 'kickflip', title: 'Kickflip', description: 'Flip the board 360 degrees along its long axis' },
    { value: 'heelflip', title: 'Heelflip', description: 'Flip the board in the opposite direction of a kickflip' },
    { value: 'tre-flip', title: 'Tre Flip', description: 'A 360 flip with a backside shove-it' },
    { value: 'fs-540', title: 'FS 540', description: 'Flip the board 540 degrees along its long axis' },
    { value: 'mc-twist', title: '360 Varial McTwist', description: 'A 540 inverted aerial with board rotation' },
    { value: 'the-900', title: 'The 900', description: 'Legendary 900 aerial rotation pioneered by Tony Hawk' },
  ] as const

  let selectedTrick: string | number | undefined = $state('kickflip')
  let selectedTricks: (string | number)[] = $state(['kickflip', 'heelflip'])
</script>

<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
  <div class="mx-auto w-full max-w-5xl space-y-space-xl">
    <header class="space-y-space-md">
      <a class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</a>
      <div>
        <h1 class="text-2xl font-semibold text-foreground">Listbox</h1>
        <p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
          Selection list primitives with single, multiple, vertical, horizontal and grouped layouts.
        </p>
      </div>
    </header>

    <div class="space-y-space-xl">
      <Card title="Primitive" description="Headless root and item parts without default item layout.">
        <PrimitiveListbox items={tricks} defaultValue="kickflip" class="flex max-w-xl flex-col gap-2">
          {#each tricks.slice(0, 3) as trick (trick.value)}
            <PrimitiveListboxItem
              value={trick.value}
              class="rounded-md border border-border bg-background p-3 text-sm data-[selected=true]:border-primary/40 data-[selected=true]:bg-primary/5"
            >
              {trick.title}
            </PrimitiveListboxItem>
          {/each}
        </PrimitiveListbox>
      </Card>

      <Card title="Single" description="Controlled single selection uses onChange.">
        <Listbox
          items={tricks}
          value={selectedTrick}
          class="max-w-xl"
          onChange={(value: string | number | (string | number)[] | undefined) =>
            (selectedTrick = Array.isArray(value) ? value[0] : value)}
        >
          {#each tricks.slice(0, 4) as trick (trick.value)}
            <ListboxItem value={trick.value} title={trick.title} description={trick.description} />
          {/each}
        </Listbox>
      </Card>

      <Card title="Multiple" description="Multiple selection returns an array.">
        <Listbox
          multiple
          items={tricks}
          value={selectedTricks}
          class="max-w-xl"
          onChange={(values: string | number | (string | number)[] | undefined) =>
            (selectedTricks = Array.isArray(values) ? values : values === undefined ? [] : [values])}
        >
          {#each tricks.slice(0, 4) as trick (trick.value)}
            <ListboxItem value={trick.value} title={trick.title} description={trick.description} />
          {/each}
        </Listbox>
      </Card>

      <Card title="Horizontal" description="Horizontal orientation lays items out in rows.">
        <Listbox items={tricks} defaultValue="tre-flip" orientation="horizontal">
          {#each tricks.slice(0, 4) as trick (trick.value)}
            <ListboxItem class="w-56" value={trick.value} title={trick.title} description={trick.description} />
          {/each}
        </Listbox>
      </Card>

      <Card title="Grouped Items" description="Group related options with the same controller.">
        <Listbox multiple items={tricks} defaultValue={['kickflip', 'heelflip']} class="mx-auto max-w-xl">
          <ListboxGroup>
            <ListboxGroupLabel>Basic Tricks</ListboxGroupLabel>
            {#each tricks.slice(0, 2) as trick (trick.value)}
              <ListboxItem value={trick.value} title={trick.title} description={trick.description} />
            {/each}
          </ListboxGroup>
          <ListboxGroup>
            <ListboxGroupLabel>Advanced Tricks</ListboxGroupLabel>
            {#each tricks.slice(4) as trick (trick.value)}
              <ListboxItem value={trick.value} title={trick.title} description={trick.description} />
            {/each}
          </ListboxGroup>
        </Listbox>
      </Card>

      <Card title="Disabled" description="Disabled values can be displayed as selected but cannot be changed by user actions.">
        <Listbox items={tricks} defaultValue="fs-540" class="max-w-xl">
          {#each tricks.slice(2, 5) as trick (trick.value)}
            <ListboxItem
              value={trick.value}
              disabled={trick.value === 'fs-540'}
              title={trick.title}
              description={trick.description}
            />
          {/each}
        </Listbox>
      </Card>
    </div>
  </div>
</main>
