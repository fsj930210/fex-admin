import { Injectable } from "@angular/core";

export interface PopoverPortalMount {
  cleanup(): void;
}

export interface PopoverDismissListeners {
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

  listenForDismiss(
    element: HTMLElement,
    onPointerDown: (event: PointerEvent) => void,
    onKeyDown: (event: KeyboardEvent) => void,
  ): PopoverDismissListeners {
    const ownerDocument = element.ownerDocument;

    ownerDocument.addEventListener("pointerdown", onPointerDown, true);
    ownerDocument.addEventListener("keydown", onKeyDown, true);

    return {
      cleanup: () => {
        ownerDocument.removeEventListener("pointerdown", onPointerDown, true);
        ownerDocument.removeEventListener("keydown", onKeyDown, true);
      },
    };
  }
}
