import type { SelectOption } from '@fex/components-core/select/types'
export const frameworkOptions: SelectOption[] = [
  { value: 'angular', label: 'Angular', group: 'Frameworks', keywords: ['google'] },
  { value: 'react', label: 'React', group: 'Frameworks', keywords: ['meta'] },
  { value: 'solid', label: 'Solid', group: 'Frameworks' },
  { value: 'svelte', label: 'Svelte', group: 'Frameworks' },
  { value: 'vue', label: 'Vue', group: 'Frameworks', keywords: ['evan you'] },
  { value: 'typescript', label: 'TypeScript', group: 'Languages' },
  { value: 'javascript', label: 'JavaScript', group: 'Languages' },
]
export const virtualOptions: SelectOption[] = Array.from({ length: 1000 }, (_, index) => ({
  value: `option-${index + 1}`,
  label: `Option ${index + 1}`,
}))
