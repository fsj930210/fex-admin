import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Tooltip, TooltipArrow, TooltipContent, TooltipPortal, TooltipTrigger } from '@fex-design/angular/primitive/tooltip'
import { Button } from '@fex-design/angular/ui/button'
import { Kbd } from '@fex-design/angular/ui/kbd'
@Component({ selector: 'app-tooltip-basic-demo', standalone: true, imports: [Tooltip, TooltipArrow, TooltipContent, TooltipPortal, TooltipTrigger, Button, Kbd], changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './basic-demo.component.html' })
export class TooltipBasicDemo {}
