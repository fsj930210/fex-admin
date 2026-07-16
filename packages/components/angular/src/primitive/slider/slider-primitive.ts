import { createSliderController } from "@fex/components-core/slider/create-slider-controller";
import { convertValueToPercentage, getSliderValueFromPointer } from "@fex/components-core/slider/utils";
import {
  sliderRangeClassName,
  sliderRootClassName,
  sliderThumbClassName,
  sliderTrackClassName,
} from "@fex/components-styles/slider";
import { cn } from "@fex/utils";
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  numberAttribute,
  output,
} from "@angular/core";
import { createCoreStoreSignal } from "../../signals/core-store-signal";
import { createHostClassName } from "../../signals/host-class";

type SliderSize = "sm" | "default" | "lg";
type SliderOrientation = "horizontal" | "vertical";
type SliderController = ReturnType<typeof createSliderController>;

function parseNumberArray(value: number[] | readonly number[] | string | number | undefined): number[] | undefined {
  if (Array.isArray(value)) return [...value];
  if (typeof value === "number") return [value];
  if (typeof value === "string") {
    const values = value
      .split(",")
      .map((item) => Number(item.trim()))
      .filter((item) => Number.isFinite(item));
    return values.length ? values : undefined;
  }
  return undefined;
}

@Component({
  selector: "div[fexSliderPrimitive]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "[attr.data-disabled]": "snapshot().disabled ? 'true' : null",
    "[attr.data-orientation]": "snapshot().orientation",
    "(pointerdown)": "handlePointerDown($event)",
    "(pointermove)": "handlePointerMove($event)",
    "(pointerup)": "handlePointerUp($event)",
  },
  template: "<ng-content />",
})
export class SliderRoot {
  value = input<number[] | readonly number[] | string | number | undefined>();
  defaultValue = input<number[] | readonly number[] | string | number | undefined>();
  min = input(0, { transform: numberAttribute });
  max = input(100, { transform: numberAttribute });
  step = input(1, { transform: numberAttribute });
  minStepsBetweenThumbs = input(0, { transform: numberAttribute });
  orientation = input<SliderOrientation>("horizontal");
  disabled = input(false, { transform: booleanAttribute });
  size = input<SliderSize>("default");
  valueChange = output<number[]>();
  valueCommit = output<number[]>();

  private readonly options;
  readonly controller: SliderController;
  readonly snapshot;
  protected readonly hostClassName = createHostClassName(() => cn(sliderRootClassName({ size: this.size(), orientation: this.snapshot().orientation })));

  constructor() {
    const value = this.value;
    const defaultValue = this.defaultValue;
    const min = this.min;
    const max = this.max;
    const step = this.step;
    const minStepsBetweenThumbs = this.minStepsBetweenThumbs;
    const orientation = this.orientation;
    const disabled = this.disabled;
    this.options = {
      get value() { return parseNumberArray(value()); },
      get defaultValue() { return parseNumberArray(defaultValue()); },
      get min() { return min(); },
      get max() { return max(); },
      get step() { return step(); },
      get minStepsBetweenThumbs() { return minStepsBetweenThumbs(); },
      get orientation() { return orientation(); },
      get disabled() { return disabled(); },
      onChange: (nextValue: number[]) => this.valueChange.emit(nextValue),
      onCommit: (nextValue: number[]) => this.valueCommit.emit(nextValue),
    };
    this.controller = createSliderController(this.options);
    const storeSnapshot = createCoreStoreSignal(this.controller);
    this.snapshot = computed(() => {
      storeSnapshot();
      return this.controller.getSnapshot();
    });
  }

  handlePointerDown(event: PointerEvent) {
    const snapshot = this.snapshot();
    const element = event.currentTarget as HTMLDivElement;
    if (event.defaultPrevented || snapshot.disabled) return;
    element.setPointerCapture(event.pointerId);
    this.controller.startSlide(getSliderValueFromPointer(event.clientX, event.clientY, element.getBoundingClientRect(), snapshot.min, snapshot.max, snapshot.orientation));
  }

  handlePointerMove(event: PointerEvent) {
    const snapshot = this.snapshot();
    const element = event.currentTarget as HTMLDivElement;
    if (event.defaultPrevented || snapshot.disabled || !element.hasPointerCapture(event.pointerId)) return;
    this.controller.moveSlide(getSliderValueFromPointer(event.clientX, event.clientY, element.getBoundingClientRect(), snapshot.min, snapshot.max, snapshot.orientation));
  }

  handlePointerUp(event: PointerEvent) {
    const element = event.currentTarget as HTMLDivElement;
    if (!element.hasPointerCapture(event.pointerId)) return;
    element.releasePointerCapture(event.pointerId);
    this.controller.endSlide();
  }
}

@Component({
  selector: "span[fexSliderTrack]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "[attr.data-disabled]": "root.snapshot().disabled ? 'true' : null",
    "[attr.data-orientation]": "root.snapshot().orientation",
  },
  template: "<ng-content />",
})
export class SliderTrack {
  protected readonly hostClassName = createHostClassName(sliderTrackClassName);

  constructor(readonly root: SliderRoot) {}
}

@Component({
  selector: "span[fexSliderRange]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "[style.left]": "rangeStart()",
    "[style.right]": "rangeEnd()",
    "[style.bottom]": "rangeBottom()",
    "[style.top]": "rangeTop()",
    "[attr.data-disabled]": "root.snapshot().disabled ? 'true' : null",
    "[attr.data-orientation]": "root.snapshot().orientation",
  },
  template: "",
})
export class SliderRange {
  protected readonly hostClassName = createHostClassName(sliderRangeClassName);
  protected readonly percentages = computed(() =>
    this.root.snapshot().values.map((value) => convertValueToPercentage(value, this.root.snapshot().min, this.root.snapshot().max)),
  );
  protected readonly start = computed(() => this.root.snapshot().values.length > 1 ? Math.min(...this.percentages()) : 0);
  protected readonly end = computed(() => 100 - Math.max(...this.percentages()));
  protected readonly rangeStart = computed(() => this.root.snapshot().orientation === "horizontal" ? `${this.start()}%` : null);
  protected readonly rangeEnd = computed(() => this.root.snapshot().orientation === "horizontal" ? `${this.end()}%` : null);
  protected readonly rangeBottom = computed(() => this.root.snapshot().orientation === "vertical" ? `${this.start()}%` : null);
  protected readonly rangeTop = computed(() => this.root.snapshot().orientation === "vertical" ? `${this.end()}%` : null);

  constructor(readonly root: SliderRoot) {}
}

@Component({
  selector: "span[fexSliderThumb]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: "slider",
    "[class]": "hostClassName()",
    "[style.position]": "'absolute'",
    "[style.top]": "thumbTop()",
    "[style.bottom]": "thumbBottom()",
    "[style.left]": "thumbLeft()",
    "[style.transform]": "thumbTransform()",
    "[attr.tabindex]": "root.snapshot().disabled ? null : 0",
    "[attr.aria-valuemin]": "root.snapshot().min",
    "[attr.aria-valuemax]": "root.snapshot().max",
    "[attr.aria-valuenow]": "value()",
    "[attr.aria-disabled]": "root.snapshot().disabled ? 'true' : null",
    "[attr.data-disabled]": "root.snapshot().disabled ? 'true' : null",
    "[attr.data-orientation]": "root.snapshot().orientation",
    "(focus)": "handleFocus()",
    "(keydown)": "handleKeydown($event)",
  },
  template: "",
})
export class SliderThumb {
  index = input(0, { transform: numberAttribute });

  protected readonly hostClassName = createHostClassName(sliderThumbClassName);
  protected readonly value = computed(() => this.root.snapshot().values[this.index()] ?? this.root.snapshot().min);
  protected readonly percent = computed(() => convertValueToPercentage(this.value(), this.root.snapshot().min, this.root.snapshot().max));
  protected readonly thumbLeft = computed(() => this.root.snapshot().orientation === "vertical" ? "50%" : `${this.percent()}%`);
  protected readonly thumbTop = computed(() => this.root.snapshot().orientation === "vertical" ? null : "50%");
  protected readonly thumbBottom = computed(() => this.root.snapshot().orientation === "vertical" ? `${this.percent()}%` : null);
  protected readonly thumbTransform = computed(() => this.root.snapshot().orientation === "vertical" ? "translate(-50%, 50%)" : "translate(-50%, -50%)");

  constructor(readonly root: SliderRoot) {}

  handleFocus() {
    this.root.controller.setActiveIndex(this.index());
  }

  handleKeydown(event: KeyboardEvent) {
    const snapshot = this.root.snapshot();
    if (snapshot.disabled) return;
    const keyMap: Record<string, number> = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 10, PageDown: -10 };
    if (event.key === "Home") {
      event.preventDefault();
      this.root.controller.setValueAt(this.index(), snapshot.min, { commit: true });
    } else if (event.key === "End") {
      event.preventDefault();
      this.root.controller.setValueAt(this.index(), snapshot.max, { commit: true });
    } else if (event.key in keyMap) {
      event.preventDefault();
      const direction = keyMap[event.key]!;
      this.root.controller.stepThumb(this.index(), direction > 0 ? 1 : -1, Math.abs(direction));
    }
  }
}
