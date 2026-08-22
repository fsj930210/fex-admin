import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Tooltip, TooltipArrow, TooltipContent, TooltipPortal, TooltipTrigger } from '@fex-design/angular/primitive/tooltip'
import { Button } from '@fex-design/angular/ui/button'
@Component({ selector: 'app-tooltip-placement-demo', standalone: true, imports: [Tooltip, TooltipArrow, TooltipContent, TooltipPortal, TooltipTrigger, Button], changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './placement-demo.component.html' })
export class TooltipPlacementDemo { protected readonly placements = ['topLeft', 'top', 'topRight', 'leftTop', 'rightTop', 'left', 'right', 'leftBottom', 'rightBottom', 'bottomLeft', 'bottom', 'bottomRight'] as const }
