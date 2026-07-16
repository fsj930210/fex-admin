import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import Card from '@fex/components-angular/ui/card'
import {
  ListboxItem as PrimitiveListboxItem,
  ListboxRoot as PrimitiveListboxRoot,
} from '@fex/components-angular/primitive/listbox'
import {
  ListboxGroup,
  ListboxGroupLabel,
  ListboxItem,
  ListboxItemIndicator,
  ListboxRoot,
} from '@fex/components-angular/ui/listbox'

@Component({
  selector: 'fex-listbox-page',
  imports: [
    Card,
    RouterLink,
    PrimitiveListboxRoot,
    PrimitiveListboxItem,
    ListboxRoot,
    ListboxGroup,
    ListboxGroupLabel,
    ListboxItem,
    ListboxItemIndicator,
  ],
  host: { class: 'block' },
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListboxComponent {
  protected readonly tricks = [
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

  protected readonly selectedTrick = signal<string | number | undefined>('kickflip')
  protected readonly selectedTricks = signal<(string | number)[]>(['kickflip', 'heelflip'])

  protected setSingle(event: [string | number | (string | number)[] | undefined, unknown]) {
    this.selectedTrick.set(Array.isArray(event[0]) ? event[0][0] : event[0])
  }

  protected setMultiple(event: [string | number | (string | number)[] | undefined, unknown]) {
    this.selectedTricks.set(
      Array.isArray(event[0]) ? event[0] : event[0] === undefined ? [] : [event[0]],
    )
  }
}
