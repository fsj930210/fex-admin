export interface UserSuggestion {
  id: number
  name: string
  email: string
  department: string
  disabled?: boolean
}
export const users: UserSuggestion[] = [
  { id: 1, name: 'Alice Chen', email: 'alice@example.com', department: 'Design' },
  { id: 2, name: 'Aaron Lin', email: 'aaron@example.com', department: 'Engineering' },
  { id: 3, name: 'Amanda Wu', email: 'amanda@example.com', department: 'Finance' },
  { id: 4, name: 'Alex Zhou', email: 'alex@example.com', department: 'Operations', disabled: true },
  { id: 5, name: 'Bella Sun', email: 'bella@example.com', department: 'Marketing' },
]
export const fieldNames = { key: 'id', value: 'name', label: 'name', disabled: 'disabled' } as const
