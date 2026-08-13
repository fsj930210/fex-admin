import type { Writable } from 'svelte/store'
export const avatarContextKey = Symbol('avatar')
export type AvatarContext = { loaded: Writable<boolean> }
