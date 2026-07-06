import { ListboxItem as PrimitiveListboxItem, ListboxRoot as PrimitiveListboxRoot } from '@fex/components-react/primitive/listbox'
import {
  ListboxGroup,
  ListboxGroupLabel,
  ListboxItem,
  ListboxRoot,
} from '@fex/components-react/ui/listbox'
import { Card } from '@fex/components-react/ui/card'
import { useState } from 'react'
import { Link } from 'react-router'

const tricks = [
  { value: 'kickflip', title: 'Kickflip', description: 'Flip the board 360 degrees along its long axis' },
  { value: 'heelflip', title: 'Heelflip', description: 'Flip the board in the opposite direction of a kickflip' },
  { value: 'tre-flip', title: 'Tre Flip', description: 'A 360 flip with a backside shove-it' },
  { value: 'fs-540', title: 'FS 540', description: 'Flip the board 540 degrees along its long axis' },
  { value: 'mc-twist', title: '360 Varial McTwist', description: 'A 540 inverted aerial with board rotation' },
  { value: 'the-900', title: 'The 900', description: 'Legendary 900 aerial rotation pioneered by Tony Hawk' },
] as const

export function ListboxPage() {
  const [selectedTrick, setSelectedTrick] = useState<string | number | undefined>('kickflip')
  const [selectedTricks, setSelectedTricks] = useState<(string | number)[]>(['kickflip', 'heelflip'])

  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-md">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">
            Back home
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Listbox</h1>
            <p className="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
              Selection list primitives with controlled, uncontrolled, single, multiple, vertical, horizontal and grouped layouts.
            </p>
          </div>
        </header>

        <div className="space-y-space-xl">
          <Card title="Primitive" description="Headless root and item parts without default item layout.">
            <PrimitiveListboxRoot
              items={tricks}
              defaultValue="kickflip"
              className="flex max-w-xl flex-col gap-2"
            >
              {tricks.slice(0, 3).map((trick) => (
                <PrimitiveListboxItem
                  key={trick.value}
                  value={trick.value}
                  className="rounded-md border border-border bg-background p-3 text-sm data-[selected=true]:border-primary/40 data-[selected=true]:bg-primary/5"
                >
                  {trick.title}
                </PrimitiveListboxItem>
              ))}
            </PrimitiveListboxRoot>
          </Card>

          <Card title="Single" description="Controlled single selection uses onChange instead of onValueChange.">
            <ListboxRoot
              items={tricks}
              value={selectedTrick}
              onChange={(value) => setSelectedTrick(Array.isArray(value) ? value[0] : value)}
              className="max-w-xl"
            >
              {tricks.slice(0, 4).map((trick) => (
                <ListboxItem key={trick.value} value={trick.value} title={trick.title} description={trick.description} />
              ))}
            </ListboxRoot>
          </Card>

          <Card title="Multiple" description="Multiple selection returns the selected values array and selectedItems metadata.">
            <ListboxRoot
              multiple
              items={tricks}
              value={selectedTricks}
              onChange={(values) => setSelectedTricks(Array.isArray(values) ? values : values === undefined ? [] : [values])}
              className="max-w-xl"
            >
              {tricks.slice(0, 4).map((trick) => (
                <ListboxItem key={trick.value} value={trick.value} title={trick.title} description={trick.description} />
              ))}
            </ListboxRoot>
          </Card>

          <Card title="Horizontal" description="Horizontal orientation lays items out in rows.">
            <ListboxRoot items={tricks} defaultValue="tre-flip" orientation="horizontal">
              {tricks.slice(0, 4).map((trick) => (
                <ListboxItem key={trick.value} value={trick.value} title={trick.title} description={trick.description} className="w-56" />
              ))}
            </ListboxRoot>
          </Card>

          <Card title="Grouped Items" description="Group related options and keep the same selection controller.">
            <ListboxRoot multiple items={tricks} defaultValue={['kickflip', 'heelflip']} className="mx-auto max-w-xl">
              <ListboxGroup>
                <ListboxGroupLabel>Basic Tricks</ListboxGroupLabel>
                {tricks.slice(0, 2).map((trick) => (
                  <ListboxItem key={trick.value} value={trick.value} title={trick.title} description={trick.description} />
                ))}
              </ListboxGroup>
              <ListboxGroup>
                <ListboxGroupLabel>Advanced Tricks</ListboxGroupLabel>
                {tricks.slice(4).map((trick) => (
                  <ListboxItem key={trick.value} value={trick.value} title={trick.title} description={trick.description} />
                ))}
              </ListboxGroup>
            </ListboxRoot>
          </Card>

          <Card title="Disabled" description="Disabled values can be displayed as selected but cannot be changed by user actions.">
            <ListboxRoot items={tricks} defaultValue="fs-540" className="max-w-xl">
              {tricks.slice(2, 5).map((trick) => (
                <ListboxItem
                  key={trick.value}
                  value={trick.value}
                  disabled={trick.value === 'fs-540'}
                  title={trick.title}
                  description={trick.description}
                />
              ))}
            </ListboxRoot>
          </Card>
        </div>
      </div>
    </main>
  )
}
