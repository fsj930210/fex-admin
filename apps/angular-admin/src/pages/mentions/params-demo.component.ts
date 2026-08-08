import { ChangeDetectionStrategy, Component } from '@angular/core'
import { MentionsContent } from '@fex-design/angular/primitive/mentions/content'
import { MentionsItem } from '@fex-design/angular/primitive/mentions/item'
import { MentionsList } from '@fex-design/angular/primitive/mentions/list'
import { MentionsRoot } from '@fex-design/angular/primitive/mentions/root'
import { MentionsTrigger } from '@fex-design/angular/primitive/mentions/trigger'
import Card from '@fex-design/angular/ui/card'
import { mentionDocs } from './data'

@Component({
  selector: 'fex-mentions-params-demo',
  imports: [Card, MentionsRoot, MentionsTrigger, MentionsContent, MentionsList, MentionsItem],
  templateUrl: './params-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MentionsParamsDemo {
  protected value = ''
  protected readonly docs = mentionDocs
  protected params: string[] = []
  protected update(event: { value: string }) {
    this.value = event.value
  }
  protected select(event: { item: { value: string } }) {
    this.params = [...this.params, event.item.value]
  }
}
