import { emptyClassName, emptyContentClassName, emptyDescriptionClassName, emptyHeaderClassName, emptyMediaClassName, emptyTitleClassName, type EmptyMediaStyleProps } from "@fex/components-styles/empty";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { createHostClassName } from "../../signals/host-class";

@Component({
  selector: "fex-empty",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "data-slot": "empty",
  },
  template: "<ng-content />",
})
export class Empty {
  protected readonly hostClassName = createHostClassName(emptyClassName);
}

@Component({
  selector: "fex-empty-header",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "data-slot": "empty-header",
  },
  template: "<ng-content />",
})
export class EmptyHeader {
  protected readonly hostClassName = createHostClassName(emptyHeaderClassName);
}

@Component({
  selector: "fex-empty-media",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { "[class]": "hostClassName()", "data-slot": "empty-icon", "[attr.data-variant]": "variant()" },
  template: "<ng-content />",
})
export class EmptyMedia {
  readonly variant = input<EmptyMediaStyleProps["variant"]>("default");
  protected readonly hostClassName = createHostClassName(() => emptyMediaClassName({ variant: this.variant() }));
}

@Component({
  selector: "fex-empty-title",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "data-slot": "empty-title",
  },
  template: "<ng-content />",
})
export class EmptyTitle {
  protected readonly hostClassName = createHostClassName(emptyTitleClassName);
}

@Component({
  selector: "fex-empty-description",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "data-slot": "empty-description",
  },
  template: "<ng-content />",
})
export class EmptyDescription {
  protected readonly hostClassName = createHostClassName(emptyDescriptionClassName);
}

@Component({
  selector: "fex-empty-content",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "data-slot": "empty-content",
  },
  template: "<ng-content />",
})
export class EmptyContent {
  protected readonly hostClassName = createHostClassName(emptyContentClassName);
}
