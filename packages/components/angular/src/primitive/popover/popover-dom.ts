import { Injectable } from "@angular/core";

export interface PopoverPortalMount {
  cleanup(): void;
}

@Injectable()
export class PopoverDomService {
  mountFloatingElement(element: HTMLElement, container: HTMLElement | null | undefined): PopoverPortalMount {
    const originalParent = element.parentNode;
    const targetContainer = container ?? originalParent;

    if (targetContainer && element.parentNode !== targetContainer) {
      targetContainer.appendChild(element);
    }

    return {
      cleanup: () => {
        if (originalParent && element.parentNode !== originalParent) {
          originalParent.appendChild(element);
        }
      },
    };
  }
}
