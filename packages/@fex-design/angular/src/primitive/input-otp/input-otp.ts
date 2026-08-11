import { createInputOTPController } from '@fex-design/core/input-otp/create-input-otp-controller'
import type {
  InputOTPAccept,
  InputOTPChangeMeta,
  InputOTPCompleteMeta,
  InputOTPController,
  InputOTPSegmentConfig,
  InputOTPSegmentSnapshot,
  InputOTPTransform,
  InputOTPValue,
} from '@fex-design/core/input-otp/types'
import {
  inputOTPGroupClassName,
  inputOTPInputClassName,
  inputOTPRootClassName,
  inputOTPSeparatorClassName,
} from '@fex-design/styles/input-otp'
import { cn } from '@fex/utils'
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
} from '@angular/core'
import { createCoreStoreSignal } from '../../signals/core-store-signal'
import { createHostClassName } from '../../signals/host-class'

@Component({
  selector: 'div[fexInputOTPRoot]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'group',
    '[class]': 'hostClassName()',
    '[attr.data-slot]': "'input-otp-root'",
    '[attr.data-disabled]': "disabled() ? 'true' : null",
    '[attr.data-readonly]': "readOnly() ? 'true' : null",
    '[attr.data-invalid]': "invalid() ? 'true' : null",
    '[attr.data-complete]': "snapshot().complete ? 'true' : null",
  },
  template: '<ng-content />',
})
export class InputOTPRoot {
  value = input<InputOTPValue | undefined>()
  defaultValue = input<InputOTPValue | undefined>()
  disabled = input(false, { transform: booleanAttribute })
  readOnly = input(false, { transform: booleanAttribute })
  invalid = input(false, { transform: booleanAttribute })
  isComplete = input<
    ((value: InputOTPValue, segments: readonly InputOTPSegmentSnapshot[]) => boolean) | undefined
  >()
  valueChange = output<{ value: InputOTPValue; meta: InputOTPChangeMeta }>()
  complete = output<{ value: InputOTPValue; meta: InputOTPCompleteMeta }>()

  readonly controller: InputOTPController = createInputOTPController()
  readonly snapshot = createCoreStoreSignal(this.controller)
  private readonly inputs = new Map<number, HTMLInputElement>()
  protected readonly hostClassName = createHostClassName(() => cn(inputOTPRootClassName))

  constructor() {
    effect(() => {
      this.controller.setOptions({
        value: this.value(),
        defaultValue: this.defaultValue(),
        disabled: this.disabled(),
        readOnly: this.readOnly(),
        invalid: this.invalid(),
        isComplete: this.isComplete(),
        onChange: (value, meta) => this.valueChange.emit({ value, meta }),
        onComplete: (value, meta) => this.complete.emit({ value, meta }),
      })
    })
  }

  registerInput(index: number, element: HTMLInputElement | null) {
    if (element) this.inputs.set(index, element)
    else this.inputs.delete(index)
  }

  focusInput(index: number, cursor: 'start' | 'end' | 'all' = 'all') {
    const inputElement = this.inputs.get(index)
    if (!inputElement || inputElement.disabled) return
    inputElement.focus()
    const position = cursor === 'start' ? 0 : inputElement.value.length
    inputElement.setSelectionRange(cursor === 'all' ? 0 : position, position)
  }
}

@Component({
  selector: 'input[fexInputOTPInput]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    type: 'text',
    '[class]': 'hostClassName()',
    '[value]': 'currentValue()',
    '[disabled]': 'disabledState()',
    '[readOnly]': 'readOnlyState()',
    '[attr.maxlength]': 'null',
    '[attr.aria-invalid]': 'root.snapshot().invalid || null',
    '[attr.data-slot]': "'input-otp-input'",
    '[attr.data-index]': 'index()',
    '[attr.data-filled]': "currentValue().length > 0 ? 'true' : null",
    '[attr.data-complete]': "segment()?.complete ? 'true' : null",
  },
  template: '',
})
export class InputOTPInput {
  readonly root = inject(InputOTPRoot)
  private readonly elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef)
  private readonly destroyRef = inject(DestroyRef)

  index = input.required<number>()
  maxLength = input<number | undefined>()
  autoAdvance = input(true, { transform: booleanAttribute })
  transform = input<InputOTPTransform | undefined>()
  accept = input<InputOTPAccept | undefined>()
  disabled = input(false, { transform: booleanAttribute })
  readOnly = input(false, { transform: booleanAttribute })

  protected readonly currentValue = computed(() => this.root.snapshot().value[this.index()] ?? '')
  protected readonly segment = computed(() =>
    this.root.snapshot().segments.find((item) => item.index === this.index()),
  )
  protected readonly disabledState = computed(() => this.root.disabled() || this.disabled())
  protected readonly readOnlyState = computed(() => this.root.readOnly() || this.readOnly())
  protected readonly hostClassName = createHostClassName(() => cn(inputOTPInputClassName))

  constructor() {
    let unregister: (() => void) | undefined
    effect(() => {
      const config: InputOTPSegmentConfig = {
        index: this.index(),
        maxLength: this.maxLength(),
        autoAdvance: this.autoAdvance(),
        transform: this.transform(),
        accept: this.accept(),
        disabled: this.disabled(),
        readOnly: this.readOnly(),
      }
      if (!unregister) {
        unregister = this.root.controller.registerSegment(config)
        this.root.registerInput(config.index, this.elementRef.nativeElement)
      } else {
        this.root.controller.updateSegment(config)
      }
    })
    this.destroyRef.onDestroy(() => {
      unregister?.()
      this.root.registerInput(this.index(), null)
    })
  }

  private applyText(
    text: string,
    reason: 'input' | 'paste' | 'delete' | 'composition',
    selection = { start: 0, end: this.currentValue().length },
  ) {
    const result = this.root.controller.applyInput({
      index: this.index(),
      text,
      selection,
      reason,
    })
    if (result.focusIndex !== undefined) this.root.focusInput(result.focusIndex, result.cursor)
    return result
  }

  @HostListener('input', ['$event'])
  handleInput(event: InputEvent) {
    const element = event.currentTarget as HTMLInputElement
    const result = this.applyText(element.value, event.inputType.startsWith('delete') ? 'delete' : 'input')
    if (!result.accepted) element.value = this.currentValue()
  }

  @HostListener('paste', ['$event'])
  handlePaste(event: ClipboardEvent) {
    if (event.defaultPrevented || this.disabledState() || this.readOnlyState()) return
    event.preventDefault()
    const element = event.currentTarget as HTMLInputElement
    this.applyText(event.clipboardData?.getData('text') ?? '', 'paste', {
      start: element.selectionStart ?? 0,
      end: element.selectionEnd ?? 0,
    })
  }

  @HostListener('keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.defaultPrevented) return
    const element = event.currentTarget as HTMLInputElement
    const start = element.selectionStart ?? 0
    const end = element.selectionEnd ?? start
    if (event.key === 'Backspace' && this.currentValue() === '' && start === 0 && end === 0) {
      event.preventDefault()
      this.root.focusInput(this.index() - 1, 'end')
    } else if (event.key === 'ArrowLeft' && start === 0 && end === 0) {
      event.preventDefault()
      this.root.focusInput(this.index() - 1, 'end')
    } else if (
      event.key === 'ArrowRight' &&
      start === this.currentValue().length &&
      end === start
    ) {
      event.preventDefault()
      this.root.focusInput(this.index() + 1, 'start')
    }
  }
}

@Component({
  selector: 'div[fexInputOTPGroup]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClassName()',
    '[attr.data-slot]': "'input-otp-group'",
  },
  template: '<ng-content />',
})
export class InputOTPGroup {
  protected readonly hostClassName = createHostClassName(() => cn(inputOTPGroupClassName))
}

@Component({
  selector: 'span[fexInputOTPSeparator]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClassName()',
    '[attr.aria-hidden]': 'true',
    '[attr.data-slot]': "'input-otp-separator'",
  },
  template: '<ng-content />',
})
export class InputOTPSeparator {
  protected readonly hostClassName = createHostClassName(() => cn(inputOTPSeparatorClassName))
}
