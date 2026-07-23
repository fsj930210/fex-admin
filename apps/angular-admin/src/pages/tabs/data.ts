export interface DemoTab { value: string, label: string, content: string, closable?: boolean }
export const initialTabs: DemoTab[] = [
  { value: 'overview', label: 'Overview', content: 'Project health, activity and recent changes.' },
  { value: 'analytics', label: 'Analytics', content: 'Traffic, conversion and retention metrics.', closable: true },
  { value: 'reports', label: 'Reports', content: 'Saved operational and finance reports.', closable: true },
]
export function createTab(index: number): DemoTab { return { value: `tab-${index}`, label: `Tab ${index}`, content: `Content for dynamically added Tab ${index}.`, closable: true } }
