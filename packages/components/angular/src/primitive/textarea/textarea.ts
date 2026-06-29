import { textareaClassName as textareaStyleClassName } from "@fex/components-styles/textarea";
import { cn } from "@fex/utils";
import { Directive, ElementRef, inject } from "@angular/core";

@Directive({
  selector: "textarea[fex-textarea]",
  standalone: true,
  host: { "[class]": "hostClassName", "data-slot": "textarea" },
})
export class Textarea {
  private readonly elementRef = inject<ElementRef<HTMLTextAreaElement>>(ElementRef);
  protected readonly hostClassName = cn(textareaStyleClassName, this.elementRef.nativeElement.getAttribute("class") ?? "");
}
