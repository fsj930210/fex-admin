import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage } from '@fex-design/angular/primitive/breadcrumb'
@Component({ selector: 'app-breadcrumb-parallelogram', standalone: true, imports: [RouterLink, Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage], templateUrl: './parallelogram-breadcrumb.component.html', changeDetection: ChangeDetectionStrategy.OnPush })
export class ParallelogramBreadcrumbComponent {}
