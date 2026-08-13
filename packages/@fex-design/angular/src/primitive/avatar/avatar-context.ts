import { Injectable, signal } from '@angular/core'
@Injectable()
export class AvatarContext {
  readonly loaded = signal(false)
}
