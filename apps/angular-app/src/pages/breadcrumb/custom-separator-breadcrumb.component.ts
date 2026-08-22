import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@fex-design/angular/primitive/breadcrumb'
@Component({ selector: 'app-breadcrumb-custom-separator', standalone: true, imports: [RouterLink, Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator], templateUrl: './custom-separator-breadcrumb.component.html', changeDetection: ChangeDetectionStrategy.OnPush })
export class CustomSeparatorBreadcrumbComponent {}
