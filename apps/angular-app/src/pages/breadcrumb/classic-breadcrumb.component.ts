import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@fex-design/angular/primitive/breadcrumb'
@Component({ selector: 'app-breadcrumb-classic', standalone: true, imports: [RouterLink, Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator], templateUrl: './classic-breadcrumb.component.html', changeDetection: ChangeDetectionStrategy.OnPush })
export class ClassicBreadcrumbComponent {}
