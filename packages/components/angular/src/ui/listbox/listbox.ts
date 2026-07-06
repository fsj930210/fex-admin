import {
  listboxGroupClassName,
  listboxGroupLabelClassName,
  listboxItemClassName,
  listboxItemIndicatorClassName,
  listboxRootClassName,
} from "@fex/components-styles/listbox";
import { cn } from "@fex/utils";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CheckIcon } from "../../icon/check";
import {
  ListboxGroup as PrimitiveListboxGroup,
  ListboxGroupLabel as PrimitiveListboxGroupLabel,
  ListboxItem as PrimitiveListboxItem,
  ListboxItemIndicator as PrimitiveListboxItemIndicator,
  ListboxRoot as PrimitiveListboxRoot,
} from "../../primitive/listbox/listbox";
import { createHostClassName } from "../../signals/host-class";

@Component({
  selector: "fex-ui-listbox",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: "listbox",
    "data-slot": "listbox",
    "[class]": "hostClassName()",
    "[attr.aria-multiselectable]": "snapshot().multiple || null",
    "[attr.aria-orientation]": "orientation()",
    "[attr.data-orientation]": "orientation()",
  },
  providers: [{ provide: PrimitiveListboxRoot, useExisting: ListboxRoot }],
  template: "<ng-content />",
})
export class ListboxRoot extends PrimitiveListboxRoot {
  protected readonly hostClassName = createHostClassName(() => cn(listboxRootClassName({})));
}

@Component({
  selector: "fex-ui-listbox-group",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: "group",
    "data-slot": "listbox-group",
    "[class]": "hostClassName()",
  },
  template: "<ng-content />",
})
export class ListboxGroup extends PrimitiveListboxGroup {
  protected readonly hostClassName = createHostClassName(() => cn(listboxGroupClassName));
}

@Component({
  selector: "fex-ui-listbox-group-label",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "data-slot": "listbox-group-label",
    "[class]": "hostClassName()",
  },
  template: "<ng-content />",
})
export class ListboxGroupLabel extends PrimitiveListboxGroupLabel {
  protected readonly hostClassName = createHostClassName(() => cn(listboxGroupLabelClassName));
}

@Component({
  selector: "fex-ui-listbox-item",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: "option",
    tabindex: "0",
    "data-slot": "listbox-item",
    "[class]": "hostClassName()",
    "[attr.aria-selected]": "selected()",
    "[attr.aria-disabled]": "disabledState() || null",
    "[attr.data-selected]": "selected() ? 'true' : 'false'",
    "[attr.data-disabled]": "disabledState() ? 'true' : null",
  },
  template: "<ng-content />",
})
export class ListboxItem extends PrimitiveListboxItem {
  protected readonly hostClassName = createHostClassName(() => cn(listboxItemClassName({})));
}

@Component({
  selector: "fex-ui-listbox-item-indicator",
  standalone: true,
  imports: [CheckIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "aria-hidden": "true",
    "data-slot": "listbox-item-indicator",
    "[class]": "hostClassName()",
  },
  template: "<ng-content /><fex-check-icon />",
})
export class ListboxItemIndicator extends PrimitiveListboxItemIndicator {
  protected readonly hostClassName = createHostClassName(() => cn(listboxItemIndicatorClassName));
}

export { ListboxRoot as Listbox };
