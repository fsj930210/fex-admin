import { ChangeDetectionStrategy, Component } from '@angular/core'
import { InputOTPGroup, InputOTPInput, InputOTPRoot, InputOTPSeparator } from '@fex-design/angular/primitive/input-otp'
import Card from '@fex-design/angular/ui/card'
@Component({selector:'fex-input-otp-mixed-rules-demo',standalone:true,imports:[Card,InputOTPRoot,InputOTPGroup,InputOTPInput,InputOTPSeparator],changeDetection:ChangeDetectionStrategy.OnPush,templateUrl:'./mixed-rules-demo.component.html'})
export class MixedRulesDemoComponent { protected readonly uppercase=(value:string)=>value.toUpperCase(); protected readonly letters=(value:string)=>/^[A-Z]*$/.test(value); protected readonly digits=(value:string)=>/^\d*$/.test(value) }
