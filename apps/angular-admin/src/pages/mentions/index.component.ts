import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { MentionsBasicDemo } from './basic-demo.component'
import { MentionsCustomTriggerDemo } from './custom-trigger-demo.component'
import { MentionsParamsDemo } from './params-demo.component'
import { MentionsPrefixDemo } from './prefix-demo.component'
import { MentionsValidationDemo } from './validation-demo.component'

@Component({
  selector: 'fex-mentions-page',
  imports: [
    RouterLink,
    MentionsBasicDemo,
    MentionsPrefixDemo,
    MentionsParamsDemo,
    MentionsCustomTriggerDemo,
    MentionsValidationDemo,
  ],
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MentionsComponent {}
