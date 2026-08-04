import { computed, ElementRef, inject, type Signal } from '@angular/core'
import { cn } from '@fex/utils'

export type ClassValueSource = string | Signal<string | undefined> | (() => string | undefined)

function readClassValue(source: ClassValueSource) {
  return typeof source === 'function' ? source() : source
}

export function getInitialHostClassName() {
  return inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.getAttribute('class') ?? ''
}

export function createHostClassName(className: ClassValueSource) {
  const initialClassName = getInitialHostClassName()
  return computed(() => cn(readClassValue(className), initialClassName))
}
