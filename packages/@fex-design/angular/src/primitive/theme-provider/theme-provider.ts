import { createThemeController } from '@fex-design/core/theme/create-theme-controller'
import type {
  ThemeController,
  ThemeControllerOptions,
  ThemeScope,
  ThemeSnapshot,
} from '@fex-design/core/theme/types'
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  Optional,
  SkipSelf,
  signal,
} from '@angular/core'
import type { AfterViewInit, OnChanges, OnDestroy } from '@angular/core'
import { THEME_MEDIA } from '@fex-design/core/theme/constants'
import { getSystemTheme } from '@fex-design/core/theme/system-theme'

@Component({
  selector: 'fex-theme-provider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './theme-provider.html',
})
export class ThemeProvider implements AfterViewInit, OnChanges, OnDestroy {
  @Input() scope: ThemeScope = 'root'
  @Input() themes = ['light', 'dark']
  @Input() defaultTheme = 'light'
  @Input() forcedTheme?: string
  @Input() enableSystem = false
  @Input() enableColorScheme = false
  @Input() attribute: ThemeControllerOptions['attribute'] = 'class'
  @Input() storageKey?: string
  @Input() colorSchemeMap?: ThemeControllerOptions['colorSchemeMap']

  @HostBinding('attr.data-theme-scope')
  get themeScopeAttribute() {
    return this.scope === 'local' ? this.storageKey : null
  }

  @HostBinding('style.display')
  get hostDisplay() {
    return this.scope === 'local' ? 'block' : 'contents'
  }

  private readonly controller: ThemeController
  private unsubscribe?: () => void
  private removeMediaListener?: () => void
  private removeStorageListener?: () => void
  readonly snapshot = signal<ThemeSnapshot>({ theme: 'light', themes: ['light', 'dark'], resolvedTheme: 'light' })

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    @Optional() @SkipSelf() private readonly parent?: ThemeProvider,
  ) {
    this.controller = createThemeController()
    this.snapshot.set(this.controller.getSnapshot())
  }

  ngOnChanges() {
    this.controller.setOptions(this.options)
  }

  ngAfterViewInit() {
    if (this.scope === 'root' && this.parent) {
      throw new Error("ThemeProvider scope='root' cannot be nested.")
    }
    if (this.scope === 'root' && !this.storageKey && !this.forcedTheme) {
      throw new Error("ThemeProvider scope='root' requires storageKey unless forcedTheme is provided.")
    }
    if (this.scope === 'inherit' && !this.parent) {
      throw new Error("ThemeProvider scope='inherit' requires a parent provider.")
    }
    if (this.scope === 'inherit' && this.forcedTheme) {
      throw new Error("ThemeProvider scope='inherit' cannot use forcedTheme.")
    }

    this.unsubscribe = this.activeController.subscribe(() => this.syncTheme())
    this.syncTheme()

    if (this.scope !== 'inherit' && this.enableSystem) {
      const media = window.matchMedia(THEME_MEDIA)
      const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
        this.controller.setSystemTheme(getSystemTheme(event))
      }
      handleChange(media)
      media.addEventListener('change', handleChange)
      this.removeMediaListener = () => media.removeEventListener('change', handleChange)
    }

    if (this.scope !== 'inherit' && this.storageKey && !this.forcedTheme) {
      const handleStorage = (event: StorageEvent) => {
        if (event.key === this.storageKey) this.controller.syncStoredTheme(event.newValue)
      }
      window.addEventListener('storage', handleStorage)
      this.removeStorageListener = () => window.removeEventListener('storage', handleStorage)
    }
  }

  ngOnDestroy() {
    this.unsubscribe?.()
    this.removeMediaListener?.()
    this.removeStorageListener?.()
  }

  get activeController(): ThemeController {
    return this.scope === 'inherit' && this.parent ? this.parent.activeController : this.controller
  }

  setTheme = (theme: Parameters<ThemeController['setTheme']>[0]) => this.activeController.setTheme(theme)

  get currentSnapshot() {
    return this.activeController.getSnapshot()
  }

  private get options(): ThemeControllerOptions {
    return {
      attribute: this.attribute,
      colorSchemeMap: this.colorSchemeMap,
      defaultTheme: this.defaultTheme,
      enableColorScheme: this.enableColorScheme,
      enableSystem: this.enableSystem,
      forcedTheme: this.forcedTheme,
      storageKey: this.storageKey,
      themes: this.themes,
    }
  }

  private syncTheme() {
    this.snapshot.set(this.activeController.getSnapshot())
    if (this.scope === 'inherit') return
    const element = this.scope === 'root' ? document.documentElement : this.elementRef.nativeElement
    this.activeController.applyTo(element)
  }
}
