import { ChangeDetectionStrategy, Component } from '@angular/core'
import { MentionsContent } from '@fex-design/angular/primitive/mentions/content'
import { MentionsItem } from '@fex-design/angular/primitive/mentions/item'
import { MentionsList } from '@fex-design/angular/primitive/mentions/list'
import { MentionsRoot } from '@fex-design/angular/primitive/mentions/root'
import { MentionsTriggerInput } from '@fex-design/angular/primitive/mentions/trigger-input'
import Card from '@fex-design/angular/ui/card'
import { mentionUsers } from './data'

@Component({
  selector: 'fex-mentions-custom-trigger-demo',
  imports: [Card, MentionsRoot, MentionsTriggerInput, MentionsContent, MentionsList, MentionsItem],
  templateUrl: './custom-trigger-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MentionsCustomTriggerDemo {
  protected value = ''
  protected readonly users = mentionUsers
  protected update(event: { value: string }) {
    this.value = event.value
  }
}
