import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage } from '@fex-design/angular/primitive/breadcrumb'
@Component({ selector: 'app-breadcrumb-capsule', standalone: true, imports: [RouterLink, Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage], templateUrl: './capsule-breadcrumb.component.html', changeDetection: ChangeDetectionStrategy.OnPush })
export class CapsuleBreadcrumbComponent {}
