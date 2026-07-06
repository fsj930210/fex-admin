import { createSelectionController } from "@fex/components-core/selection/create-selection-controller";
import type { SelectionController, SelectionValue } from "@fex/components-core/selection/types";
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  HostListener,
  inject,
  input,
  Output,
} from "@angular/core";
import { createCoreStoreSignal } from "../../signals/core-store-signal";

export type ListboxOrientation = "vertical" | "horizontal";

export type ListboxChangeMeta = {
  selectedValues: SelectionValue[];
  previousSelectedValues: SelectionValue[];
  changedValues: SelectionValue[];
};

@Component({
  selector: "fex-listbox",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: "listbox",
    "data-slot": "listbox",
    "[attr.aria-multiselectable]": "snapshot().multiple || null",
    "[attr.aria-orientation]": "orientation()",
    "[attr.data-orientation]": "orientation()",
  },
  template: "<ng-content />",
})
export class ListboxRoot {
  value = input<SelectionValue | SelectionValue[] | undefined>();
  defaultValue = input<SelectionValue | SelectionValue[] | undefined>();
  multiple = input(false, { transform: booleanAttribute });
  disabledValues = input<readonly SelectionValue[]>([]);
  orientation = input<ListboxOrientation>("vertical");

  @Output() change = new EventEmitter<[SelectionValue | SelectionValue[] | undefined, ListboxChangeMeta]>();

  readonly controller: SelectionController;
  readonly snapshot;

  constructor() {
    const root = this;
    this.controller = createSelectionController({
      get value() {
        return root.value();
      },
      get defaultValue() {
        return root.defaultValue();
      },
      get multiple() {
        return root.multiple();
      },
      get disabledValues() {
        return root.disabledValues();
      },
      onChange(values, meta) {
        root.change.emit([
          root.multiple() ? values : values[0],
          {
            selectedValues: values,
            previousSelectedValues: meta.previousValues,
            changedValues: meta.changedValues,
          },
        ]);
      },
    });
    this.snapshot = createCoreStoreSignal(this.controller);
  }

  selectItem(value: SelectionValue) {
    if (this.snapshot().multiple) {
      this.controller.toggle(value);
      return;
    }
    this.controller.replace(value);
  }
}

@Component({
  selector: "fex-listbox-group",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: "group",
    "data-slot": "listbox-group",
  },
  template: "<ng-content />",
})
export class ListboxGroup {}

@Component({
  selector: "fex-listbox-group-label",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "data-slot": "listbox-group-label",
  },
  template: "<ng-content />",
})
export class ListboxGroupLabel {}

@Component({
  selector: "fex-listbox-item",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: "option",
    tabindex: "0",
    "data-slot": "listbox-item",
    "[attr.aria-selected]": "selected()",
    "[attr.aria-disabled]": "disabledState() || null",
    "[attr.data-selected]": "selected() ? 'true' : 'false'",
    "[attr.data-disabled]": "disabledState() ? 'true' : null",
  },
  template: "<ng-content />",
})
export class ListboxItem {
  private readonly root = inject(ListboxRoot);

  value = input.required<SelectionValue>();
  disabled = input(false, { transform: booleanAttribute });

  protected readonly selected = computed(() => {
    this.root.value();
    this.root.multiple();
    this.root.snapshot().values;
    return this.root.controller.getSnapshot().values.includes(this.value());
  });
  protected readonly disabledState = computed(() => this.disabled() || this.root.controller.isDisabled(this.value()));

  @HostListener("click")
  select() {
    if (this.disabledState()) {
      return;
    }
    this.root.selectItem(this.value());
  }

  @HostListener("keydown", ["$event"])
  selectWithKeyboard(event: KeyboardEvent) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    event.preventDefault();
    this.select();
  }
}

@Component({
  selector: "fex-listbox-item-indicator",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "aria-hidden": "true",
    "data-slot": "listbox-item-indicator",
  },
  template: "<ng-content />",
})
export class ListboxItemIndicator {}
