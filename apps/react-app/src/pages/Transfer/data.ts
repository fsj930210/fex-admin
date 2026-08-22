export interface TransferMember extends Record<string, unknown> {
  id: string
  name: string
  department: string
  disabled?: boolean
}

export const transferMembers: TransferMember[] = [
  { id: 'ada', name: 'Ada Lovelace', department: 'Engineering' },
  { id: 'grace', name: 'Grace Hopper', department: 'Engineering' },
  { id: 'margaret', name: 'Margaret Hamilton', department: 'Engineering' },
  { id: 'susan', name: 'Susan Kare', department: 'Design' },
  { id: 'dieter', name: 'Dieter Rams', department: 'Design', disabled: true },
  { id: 'katherine', name: 'Katherine Johnson', department: 'Operations' },
]

export const transferFieldNames = {
  key: 'id',
  label: 'name',
  disabled: 'disabled',
} as const
