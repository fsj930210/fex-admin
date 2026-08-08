import { Directive, ElementRef, HostListener, inject } from '@angular/core'
import { MentionsRoot } from './mentions'

function selection(element: HTMLTextAreaElement) {
  return { start: element.selectionStart ?? 0, end: element.selectionEnd ?? 0 }
}

@Directive({
  selector: 'textarea[fexMentionsTrigger]',
  standalone: true,
  host: {
    '[value]': 'root.snapshot().value',
    '[disabled]': 'root.disabled',
    '[readOnly]': 'root.readOnly',
    '[attr.required]': 'root.required || null',
    '[attr.aria-invalid]': 'root.resolvedInvalid || null',
    '[attr.aria-expanded]': 'root.snapshot().open',
    '[attr.aria-controls]': 'root.listId',
    '[attr.aria-activedescendant]': 'activeId',
    role: 'combobox',
  },
})
export class MentionsTriggerInput {
  readonly root = inject(MentionsRoot)
  private readonly element = inject<ElementRef<HTMLTextAreaElement>>(ElementRef)
  private composing = false

  get activeId() {
    const key = this.root.snapshot().activeKey
    return key === undefined ? null : this.root.listId + '-' + key
  }
  private get nativeElement() {
    return this.element.nativeElement
  }
  @HostListener('input') input() {
    this.root.controller.setValue(this.nativeElement.value, selection(this.nativeElement))
  }
  @HostListener('keydown', ['$event']) keydown(event: KeyboardEvent) {
    if (this.composing) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      this.root.controller.setOpen(true, 'keyboard')
      this.root.controller.moveActive(event.key === 'ArrowDown' ? 1 : -1)
    } else if ((event.key === 'Enter' || event.key === 'Tab') && this.root.snapshot().open) {
      if (this.root.controller.selectActive()) event.preventDefault()
    } else if (event.key === 'Escape') this.root.controller.setOpen(false, 'escape')
  }
  @HostListener('blur') blur() {
    this.root.controller.setOpen(false, 'blur')
  }
  @HostListener('compositionstart') compositionStart() {
    this.composing = true
  }
  @HostListener('compositionend') compositionEnd() {
    this.composing = false
    this.input()
  }
}
