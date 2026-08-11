import type { InputOTPChangeMeta,InputOTPValue } from '@fex-design/core/input-otp/types'
import { ChangeDetectionStrategy,Component,signal } from '@angular/core'
import { InputOTPGroup,InputOTPInput,InputOTPRoot } from '@fex-design/angular/primitive/input-otp'
import { Button } from '@fex-design/angular/ui/button'
import Card from '@fex-design/angular/ui/card'
@Component({selector:'fex-input-otp-controlled-demo',standalone:true,imports:[Card,Button,InputOTPRoot,InputOTPGroup,InputOTPInput],changeDetection:ChangeDetectionStrategy.OnPush,templateUrl:'./controlled-demo.component.html'})
export class ControlledDemoComponent{protected readonly indexes=[0,1,2];protected readonly value=signal<InputOTPValue>(['AB','','']);protected change(event:{value:InputOTPValue;meta:InputOTPChangeMeta}){this.value.set(event.value)}protected clear(){this.value.set(['','',''])}}
