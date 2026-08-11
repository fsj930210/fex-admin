import { ChangeDetectionStrategy, Component } from '@angular/core'
import { InputOTPGroup, InputOTPInput, InputOTPRoot, InputOTPSeparator } from '@fex-design/angular/primitive/input-otp'
import Card from '@fex-design/angular/ui/card'
@Component({selector:'fex-input-otp-variable-length-demo',standalone:true,imports:[Card,InputOTPRoot,InputOTPGroup,InputOTPInput,InputOTPSeparator],changeDetection:ChangeDetectionStrategy.OnPush,templateUrl:'./variable-length-demo.component.html'})
export class VariableLengthDemoComponent {}
