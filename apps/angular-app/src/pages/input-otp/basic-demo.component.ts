import { ChangeDetectionStrategy, Component } from '@angular/core'
import { InputOTPGroup, InputOTPInput, InputOTPRoot, InputOTPSeparator } from '@fex-design/angular/primitive/input-otp'
import Card from '@fex-design/angular/ui/card'
@Component({selector:'fex-input-otp-basic-demo',standalone:true,imports:[Card,InputOTPRoot,InputOTPGroup,InputOTPInput,InputOTPSeparator],changeDetection:ChangeDetectionStrategy.OnPush,templateUrl:'./basic-demo.component.html'})
export class BasicDemoComponent { protected readonly indexes=[0,1,2,3,4,5] }
