import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { BasicDemoComponent } from './basic-demo.component'
import { ControlledDemoComponent } from './controlled-demo.component'
import { MixedRulesDemoComponent } from './mixed-rules-demo.component'
import { PasteDemoComponent } from './paste-demo.component'
import { VariableLengthDemoComponent } from './variable-length-demo.component'
@Component({selector:'fex-input-otp-page',standalone:true,imports:[RouterLink,BasicDemoComponent,ControlledDemoComponent,MixedRulesDemoComponent,PasteDemoComponent,VariableLengthDemoComponent],changeDetection:ChangeDetectionStrategy.OnPush,templateUrl:'./index.component.html'})
export class InputOTPPage {}
