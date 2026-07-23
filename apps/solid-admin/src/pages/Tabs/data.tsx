import type { JSX } from 'solid-js'
export interface DemoTab { value: string, label: JSX.Element, content: JSX.Element, closable?: boolean }
export const initialTabs: DemoTab[] = [
  { value: 'overview', label: 'Overview', content: <p>Project health, activity and recent changes.</p> },
  { value: 'analytics', label: 'Analytics', content: <p>Traffic, conversion and retention metrics.</p>, closable: true },
  { value: 'reports', label: 'Reports', content: <p>Saved operational and finance reports.</p>, closable: true },
]
export function createTab(index: number): DemoTab { return { value: `tab-${index}`, label: `Tab ${index}`, content: <p>Content for dynamically added Tab {index}.</p>, closable: true } }
