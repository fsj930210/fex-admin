import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { Card } from '@fex-design/angular/ui/card'
@Component({
  selector: 'fex-upload-demo-section',
  standalone: true,
  imports: [Card],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './demo-section.component.html',
})
export class UploadDemoSectionComponent {
  readonly title = input.required<string>()
  readonly description = input.required<string>()
}
