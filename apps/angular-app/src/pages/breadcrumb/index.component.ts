import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@fex-design/angular/primitive/breadcrumb'
import { Card } from '@fex-design/angular/ui/card'
import { BreadcrumbDropdownDemoComponent } from './dropdown-demo.component'
import { ClassicBreadcrumbComponent } from './classic-breadcrumb.component'
import { CustomSeparatorBreadcrumbComponent } from './custom-separator-breadcrumb.component'
import { CapsuleBreadcrumbComponent } from './capsule-breadcrumb.component'
import { RibbonBreadcrumbComponent } from './ribbon-breadcrumb.component'
import { ParallelogramBreadcrumbComponent } from './parallelogram-breadcrumb.component'

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterLink, Card, Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, ClassicBreadcrumbComponent, CustomSeparatorBreadcrumbComponent, CapsuleBreadcrumbComponent, RibbonBreadcrumbComponent, ParallelogramBreadcrumbComponent, BreadcrumbDropdownDemoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './index.component.html',
})
export class BreadcrumbComponent {}
