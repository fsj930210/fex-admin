import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Radio, RadioButton, RadioGroup, type RadioValue } from "@fex/components-angular/primitive/radio";
import Card from "@fex/components-angular/ui/card";

const options = [
  { label: "Apple", value: "apple" },
  { label: "Pear", value: "pear" },
  { label: "Orange", value: "orange" },
] as const;

@Component({
  selector: "fex-radio-page",
  standalone: true,
  imports: [RouterLink, RadioGroup, Radio, RadioButton, Card],
  host: { class: "block" },
  templateUrl: "./index.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioComponent {
  protected readonly options = options;
  protected readonly controlled = signal<RadioValue>("pear");
  protected readonly groupValue = signal<RadioValue>("orange");
  protected readonly buttonValue = signal<RadioValue>("apple");
}
