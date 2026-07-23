import type { ReactNode } from 'react'

export interface DemoTab { value: string, label: ReactNode, content: ReactNode, closable?: boolean }
export const initialTabs: DemoTab[] = [
  { value: 'overview', label: 'Overview', content: <p>Project health, activity and recent changes.</p>, closable: false },
  { value: 'analytics', label: 'Analytics', content: <p>Traffic, conversion and retention metrics.</p>, closable: true },
  { value: 'reports', label: 'Reports', content: <p>Saved operational and finance reports.</p>, closable: true },
]

export function createTab(index: number): DemoTab {
  const value = `tab-${index}`
  return { value, label: `Tab ${index}`, content: <p>Content for dynamically added Tab {index}.</p>, closable: true }
}
