import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Tooltip, TooltipArrow, TooltipContent, TooltipPortal, TooltipTrigger } from '@fex/components-angular/primitive/tooltip'
import { Button } from '@fex/components-angular/ui/button'
@Component({ selector: 'app-tooltip-style-demo', standalone: true, imports: [Tooltip, TooltipArrow, TooltipContent, TooltipPortal, TooltipTrigger, Button], changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './style-demo.component.html' })
export class TooltipStyleDemo {}
