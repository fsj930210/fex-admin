import { createMentionsController } from '@fex-design/core/mentions/create-mentions-controller'
import type {
  MentionsChangeMeta,
  MentionsController,
  MentionsKey,
  MentionsOpenReason,
  MentionsParseInput,
  MentionsQuery,
  MentionsRegisteredItem,
  MentionsSearchMeta,
  MentionsSelectMeta,
  MentionsSnapshot,
} from '@fex-design/core/mentions/types'
import {
  mentionsContentClassName,
  mentionsItemClassName,
  mentionsListClassName,
  mentionsRootClassName,
} from '@fex-design/styles/mentions'
import { cn } from '@fex/utils'
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  inject,
  signal,
} from '@angular/core'
import type { OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core'
import { createHostClassName } from '../../signals/host-class'
import { TextareaInput, TextareaRoot } from '../textarea/textarea'

function normalizePrefix(prefix: string | readonly string[] | undefined) {
  return Array.isArray(prefix) ? prefix : prefix ? [prefix] : ['@']
}

@Component({
  selector: 'fex-mentions-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClassName()', 'data-slot': 'mentions-root' },
  template: '<ng-content />',
})
export class MentionsRoot<TData = unknown> implements OnChanges, OnDestroy {
  private readonly classInput = signal('')
  @Input('class') set className(value: string | null | undefined) {
    this.classInput.set(value ?? '')
  }
  @Input() value?: string
  @Input() defaultValue?: string
  @Input() prefix?: string | readonly string[]
  @Input() open?: boolean
  @Input() defaultOpen?: boolean
  @Input() disabled = false
  @Input() readOnly = false
  @Input() invalid = false
  @Input() required = false
  @Input() status: 'error' | 'warning' | undefined = undefined
  @Input() parseQuery?: (input: MentionsParseInput) => MentionsQuery | null
  @Output() readonly change = new EventEmitter<{ value: string; meta: MentionsChangeMeta }>()
  @Output() readonly search = new EventEmitter<{ text: string; meta: MentionsSearchMeta }>()
  @Output() readonly itemSelect = new EventEmitter<{
    item: MentionsRegisteredItem<TData>
    meta: MentionsSelectMeta
  }>()
  @Output('select') readonly select = this.itemSelect
  @Output() readonly openChange = new EventEmitter<{
    open: boolean
    meta: { reason: MentionsOpenReason }
  }>()
  protected readonly hostClassName = createHostClassName(() =>
    cn(mentionsRootClassName, this.classInput()),
  )
  readonly listId = 'mentions-' + Math.random().toString(36).slice(2)
  readonly controller: MentionsController<TData>
  readonly snapshot = signal<MentionsSnapshot>({
    value: '',
    open: false,
    query: null,
    activeKey: undefined,
    interaction: null,
  })
  private readonly unsubscribe: () => void

  constructor() {
    const root = this
    this.controller = createMentionsController<TData>({
      get value() {
        return root.value
      },
      get defaultValue() {
        return root.defaultValue
      },
      get open() {
        return root.open
      },
      get defaultOpen() {
        return root.defaultOpen
      },
      get prefixes() {
        return normalizePrefix(root.prefix)
      },
      get parseQuery() {
        return root.parseQuery
      },
      onChange: (value, meta) => root.change.emit({ value, meta }),
      onSearch: (text, meta) => root.search.emit({ text, meta }),
      onSelect: (item, meta) =>
        root.itemSelect.emit({ item: item as MentionsRegisteredItem<TData>, meta }),
      onOpenChange: (open, meta) => root.openChange.emit({ open, meta }),
    })
    this.snapshot.set(this.controller.getSnapshot())
    this.unsubscribe = this.controller.subscribe(() => {
      this.snapshot.set(this.controller.getSnapshot())
    })
  }

  get resolvedInvalid() {
    return this.invalid || this.status === 'error'
  }

  ngOnChanges() {
    this.snapshot.set(this.controller.getSnapshot())
  }

  ngOnDestroy() {
    this.unsubscribe()
  }
}

@Component({
  selector: 'fex-mentions-trigger',
  standalone: true,
  imports: [TextareaRoot, TextareaInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mentions-trigger.html',
})
export class MentionsTrigger {
  readonly root = inject(MentionsRoot)
  @Input() placeholder?: string
  @Input('class') className?: string
  composing = false

  get activeId() {
    const key = this.root.snapshot().activeKey
    return key === undefined ? null : this.root.listId + '-' + key
  }

  valueChange(value: string) {
    this.root.controller.setValue(value, { start: value.length, end: value.length })
  }

  keydown(event: KeyboardEvent) {
    if (this.composing) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      this.root.controller.setOpen(true, 'keyboard')
      this.root.controller.moveActive(event.key === 'ArrowDown' ? 1 : -1)
    } else if ((event.key === 'Enter' || event.key === 'Tab') && this.root.snapshot().open) {
      if (this.root.controller.selectActive()) event.preventDefault()
    } else if (event.key === 'Escape') this.root.controller.setOpen(false, 'escape')
  }

  blur() {
    this.root.controller.setOpen(false, 'blur')
  }

  compositionEnd(event: CompositionEvent, element: HTMLTextAreaElement) {
    this.composing = false
    const target = event.currentTarget as HTMLTextAreaElement
    this.root.controller.setValue(target.value, {
      start: target.selectionStart ?? target.value.length,
      end: target.selectionEnd ?? target.value.length,
    })
  }
}

@Component({
  selector: 'fex-mentions-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClassName()',
    '[hidden]': '!visible',
    'data-slot': 'mentions-content',
  },
  template: '<ng-content />',
})
export class MentionsContent {
  readonly root = inject(MentionsRoot)
  private readonly classInput = signal('')
  @Input('class') set className(value: string | null | undefined) {
    this.classInput.set(value ?? '')
  }
  protected readonly hostClassName = createHostClassName(() =>
    cn(mentionsContentClassName, 'absolute left-0 top-full mt-1 min-w-64', this.classInput()),
  )
  get visible() {
    return this.root.snapshot().open && this.root.snapshot().query
  }
}

@Component({
  selector: 'fex-mentions-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClassName()',
    '[id]': 'root.listId',
    role: 'listbox',
    'data-slot': 'mentions-list',
  },
  template: '<ng-content />',
})
export class MentionsList {
  readonly root = inject(MentionsRoot)
  private readonly classInput = signal('')
  @Input('class') set className(value: string | null | undefined) {
    this.classInput.set(value ?? '')
  }
  protected readonly hostClassName = createHostClassName(() =>
    cn(mentionsListClassName, this.classInput()),
  )
}

@Component({
  selector: 'fex-mentions-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClassName()',
    '[id]': 'root.listId + "-" + key',
    '[attr.aria-selected]': 'active || null',
    '[attr.aria-disabled]': 'disabled || null',
    '[attr.data-active]': 'active || null',
    '[attr.data-disabled]': 'disabled || null',
    role: 'option',
    'data-slot': 'mentions-item',
  },
  template: '<ng-content />',
})
export class MentionsItem<TData = unknown> implements OnChanges, OnDestroy, OnInit {
  readonly root = inject(MentionsRoot)
  private readonly classInput = signal('')
  @Input('class') set className(value: string | null | undefined) {
    this.classInput.set(value ?? '')
  }
  @Input() itemKey?: MentionsKey
  @Input({ required: true }) value = ''
  @Input() disabled = false
  @Input() data?: TData
  private unregister?: () => void
  protected readonly hostClassName = createHostClassName(() =>
    cn(mentionsItemClassName, this.classInput()),
  )

  get key() {
    return this.itemKey ?? this.value
  }
  get active() {
    return this.root.snapshot().activeKey === this.key
  }

  ngOnInit() {
    this.register()
  }
  ngOnChanges(_changes: SimpleChanges) {
    this.register()
  }
  ngOnDestroy() {
    this.unregister?.()
  }
  private register() {
    this.unregister?.()
    this.unregister = this.root.controller.registerItem({
      key: this.key,
      value: this.value,
      disabled: this.disabled,
      data: this.data,
    })
  }
  @HostListener('pointermove') activate() {
    this.root.controller.setActiveKey(this.key, 'pointer')
  }
  @HostListener('pointerdown', ['$event']) preserveTriggerFocus(event: PointerEvent) {
    if (event.button === 0) event.preventDefault()
  }
  @HostListener('click') selectItem() {
    this.root.controller.selectItem(this.key)
  }
}

@Component({
  selector: 'fex-mentions-prefix-case',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[hidden]': '!visible' },
  template: '<ng-content />',
})
export class MentionsPrefixCase {
  readonly root = inject(MentionsRoot)
  @Input({ required: true }) prefix = '@'
  get visible() {
    return this.root.snapshot().query?.prefix === this.prefix
  }
}
