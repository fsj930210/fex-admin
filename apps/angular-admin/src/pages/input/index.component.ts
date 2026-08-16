import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import {
  InputAddonAfter,
  InputAddonBefore,
  InputClear,
  InputControl,
  InputGroup,
  InputGroupAddon,
  InputPrefix,
  InputRoot,
  InputSuffix,
} from '@fex-design/angular/primitive/input'
import { Button } from '@fex-design/angular/ui/button'
import Card from '@fex-design/angular/ui/card'

@Component({
  selector: 'fexInput-page',
  imports: [
    RouterLink,
    Card,
    Button,
    InputRoot,
    InputControl,
    InputGroup,
    InputGroupAddon,
    InputPrefix,
    InputSuffix,
    InputAddonBefore,
    InputAddonAfter,
    InputClear,
  ],
  host: { class: 'block' },
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent {
  protected controlledValue = 'fex-admin'
  protected manualValue = 'manual-value'
}
