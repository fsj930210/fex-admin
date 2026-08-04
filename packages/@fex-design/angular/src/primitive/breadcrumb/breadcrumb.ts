import { ChangeDetectionStrategy, Component } from '@angular/core'
import { breadcrumbClassName, breadcrumbEllipsisClassName, breadcrumbItemClassName, breadcrumbLinkClassName, breadcrumbListClassName, breadcrumbPageClassName, breadcrumbSeparatorClassName } from '@fex-design/styles/breadcrumb'
import { createHostClassName } from '../../signals/host-class'

@Component({ selector: 'fex-breadcrumb', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { '[class]': 'hostClassName()', 'data-slot': 'breadcrumb', role: 'navigation', 'aria-label': 'Breadcrumb' }, template: '<ng-content />' })
export class Breadcrumb { protected readonly hostClassName = createHostClassName(() => breadcrumbClassName({})) }
@Component({ selector: 'fex-breadcrumb-list', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { '[class]': 'hostClassName()', 'data-slot': 'breadcrumb-list', role: 'list' }, template: '<ng-content />' })
export class BreadcrumbList { protected readonly hostClassName = createHostClassName(() => breadcrumbListClassName) }
@Component({ selector: 'fex-breadcrumb-item', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { '[class]': 'hostClassName()', 'data-slot': 'breadcrumb-item', role: 'listitem' }, template: '<ng-content />' })
export class BreadcrumbItem { protected readonly hostClassName = createHostClassName(() => breadcrumbItemClassName) }
@Component({ selector: 'a[fexBreadcrumbLink]', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { '[class]': 'hostClassName()', 'data-slot': 'breadcrumb-link' }, template: '<ng-content />' })
export class BreadcrumbLink { protected readonly hostClassName = createHostClassName(() => breadcrumbLinkClassName) }
@Component({ selector: 'fex-breadcrumb-page', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { '[class]': 'hostClassName()', 'data-slot': 'breadcrumb-page', 'aria-current': 'page' }, template: '<ng-content />' })
export class BreadcrumbPage { protected readonly hostClassName = createHostClassName(() => breadcrumbPageClassName) }
@Component({ selector: 'fex-breadcrumb-separator', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { '[class]': 'hostClassName()', 'data-slot': 'breadcrumb-separator', role: 'presentation', 'aria-hidden': 'true' }, template: '<ng-content />' })
export class BreadcrumbSeparator { protected readonly hostClassName = createHostClassName(() => breadcrumbSeparatorClassName) }
@Component({ selector: 'fex-breadcrumb-ellipsis', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { '[class]': 'hostClassName()', 'data-slot': 'breadcrumb-ellipsis', 'aria-hidden': 'true' }, template: '<ng-content>...</ng-content>' })
export class BreadcrumbEllipsis { protected readonly hostClassName = createHostClassName(() => breadcrumbEllipsisClassName) }
