import { ChangeDetectionStrategy, Component } from '@angular/core'
import { MentionsContent } from '@fex-design/angular/primitive/mentions/content'
import { MentionsItem } from '@fex-design/angular/primitive/mentions/item'
import { MentionsList } from '@fex-design/angular/primitive/mentions/list'
import { MentionsPrefixCase } from '@fex-design/angular/primitive/mentions/prefix-case'
import { MentionsRoot } from '@fex-design/angular/primitive/mentions/root'
import { MentionsTrigger } from '@fex-design/angular/primitive/mentions/trigger'
import Card from '@fex-design/angular/ui/card'
import { mentionCommands, mentionDocs, mentionUsers } from './data'

@Component({
  selector: 'fex-mentions-prefix-demo',
  imports: [
    Card,
    MentionsRoot,
    MentionsTrigger,
    MentionsContent,
    MentionsList,
    MentionsItem,
    MentionsPrefixCase,
  ],
  templateUrl: './prefix-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MentionsPrefixDemo {
  protected value = ''
  protected selected = 'Type @, #, or /'
  protected readonly prefixes = ['@', '#', '/']
  protected readonly users = mentionUsers
  protected readonly docs = mentionDocs
  protected readonly commands = mentionCommands
  protected update(event: { value: string }) {
    this.value = event.value
  }
  protected select(event: { item: { value: string }; meta: { prefix: string } }) {
    this.selected = event.meta.prefix + ' -> ' + event.item.value
  }
}
