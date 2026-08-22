import type { InputOTPChangeMeta, InputOTPValue } from '@fex-design/core/input-otp/types'
import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { InputOTPGroup, InputOTPInput, InputOTPRoot } from '@fex-design/angular/primitive/input-otp'
import Card from '@fex-design/angular/ui/card'
@Component({selector:'fex-input-otp-paste-demo',standalone:true,imports:[Card,InputOTPRoot,InputOTPGroup,InputOTPInput],changeDetection:ChangeDetectionStrategy.OnPush,templateUrl:'./paste-demo.component.html'})
export class PasteDemoComponent { protected readonly indexes=[0,1,2]; protected readonly value=signal<InputOTPValue>(['','','']); protected change(event:{value:InputOTPValue;meta:InputOTPChangeMeta}){this.value.set(event.value)} }
