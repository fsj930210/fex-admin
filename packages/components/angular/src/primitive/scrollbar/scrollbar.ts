import { createScrollbarController } from '@fex/components-core/scrollbar/create-scrollbar-controller';
import type { ScrollbarAxis, ScrollbarAutoHide, ScrollbarClickScroll, ScrollbarVisibility } from '@fex/components-core/scrollbar/types';
import { scrollbarBarClassName, scrollbarCornerClassName, scrollbarRootClassName, scrollbarThumbClassName, scrollbarTrackClassName, scrollbarViewportClassName } from '@fex/components-styles/scrollbar';
import { cn } from '@fex/utils';
import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, input, output } from '@angular/core';
import type { AfterViewInit } from '@angular/core';
import { createHostClassName } from '../../signals/host-class';

@Component({ selector: '[fexScrollbarRoot]', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { '[attr.data-slot]': "'scrollbar-root'", '[class]': 'hostClassName()' }, template: '<ng-content />' })
export class ScrollbarRoot implements AfterViewInit {
  visibility = input<ScrollbarVisibility>('auto'); autoHide = input<ScrollbarAutoHide>('scroll'); autoHideDelay = input(900); dragScroll = input(true); clickScroll = input<ScrollbarClickScroll>(false); minThumbSize = input(24); disabled = input(false);
  scrollChange = output<{ scrollLeft: number; scrollTop: number }>();
  private readonly element = inject(ElementRef<HTMLElement>); private readonly destroyRef = inject(DestroyRef);
  protected readonly hostClassName = createHostClassName(() => cn(scrollbarRootClassName));
  ngAfterViewInit() {
    const controller = createScrollbarController({ visibility: this.visibility(), autoHide: this.autoHide(), autoHideDelay: this.autoHideDelay(), dragScroll: this.dragScroll(), clickScroll: this.clickScroll(), minThumbSize: this.minThumbSize(), disabled: this.disabled(), onScroll: (detail) => this.scrollChange.emit(detail) });
    const cleanup = controller.connect(this.element.nativeElement); this.destroyRef.onDestroy(cleanup);
  }
}

@Component({ selector: '[fexScrollbarViewport]', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { '[attr.data-slot]': "'scrollbar-viewport'", '[class]': 'hostClassName()' }, template: '<ng-content />' })
export class ScrollbarViewport { overflowX = input<'auto' | 'hidden'>('auto'); overflowY = input<'auto' | 'hidden'>('auto'); protected readonly hostClassName = createHostClassName(() => cn(scrollbarViewportClassName({ overflowX: this.overflowX(), overflowY: this.overflowY() }))); }

@Component({ selector: '[fexScrollbarBar]', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { '[attr.data-slot]': "'scrollbar-bar'", '[attr.data-axis]': 'axis()', '[attr.data-visible]': "'false'", '[class]': 'hostClassName()' }, template: '<ng-content />' })
export class ScrollbarBar { axis = input.required<ScrollbarAxis>(); protected readonly hostClassName = createHostClassName(() => cn(scrollbarBarClassName({ axis: this.axis() }))); }
@Component({ selector: '[fexScrollbarTrack]', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { '[attr.data-slot]': "'scrollbar-track'", '[class]': 'hostClassName()' }, template: '<ng-content />' })
export class ScrollbarTrack { protected readonly hostClassName = createHostClassName(() => cn(scrollbarTrackClassName)); }
@Component({ selector: '[fexScrollbarThumb]', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { '[attr.data-slot]': "'scrollbar-thumb'", '[class]': 'hostClassName()' }, template: '<ng-content />' })
export class ScrollbarThumb { axis = input.required<ScrollbarAxis>(); protected readonly hostClassName = createHostClassName(() => cn(scrollbarThumbClassName({ axis: this.axis() }))); }
@Component({ selector: '[fexScrollbarCorner]', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { '[attr.data-slot]': "'scrollbar-corner'", '[class]': 'hostClassName()' }, template: '<ng-content />' })
export class ScrollbarCorner { protected readonly hostClassName = createHostClassName(() => cn(scrollbarCornerClassName)); }
