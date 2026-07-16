export interface Person {
  id: string
  name: string
  status: 'active' | 'paused' | 'invited'
  department: 'Engineering' | 'Design' | 'Operations'
  age: number
  visits: number
  progress: number
  children?: Person[]
}
export const people: Person[] = [
  {
    id: 'u-001',
    name: 'Ada Lovelace',
    status: 'active',
    department: 'Engineering',
    age: 36,
    visits: 18,
    progress: 92,
  },
  {
    id: 'u-002',
    name: 'Grace Hopper',
    status: 'active',
    department: 'Engineering',
    age: 42,
    visits: 31,
    progress: 88,
  },
  {
    id: 'u-003',
    name: 'Alan Turing',
    status: 'paused',
    department: 'Operations',
    age: 41,
    visits: 12,
    progress: 64,
  },
  {
    id: 'u-004',
    name: 'Margaret Hamilton',
    status: 'active',
    department: 'Engineering',
    age: 38,
    visits: 25,
    progress: 96,
  },
  {
    id: 'u-005',
    name: 'Dieter Rams',
    status: 'invited',
    department: 'Design',
    age: 34,
    visits: 7,
    progress: 42,
  },
  {
    id: 'u-006',
    name: 'Susan Kare',
    status: 'active',
    department: 'Design',
    age: 31,
    visits: 22,
    progress: 81,
  },
  {
    id: 'u-007',
    name: 'Don Norman',
    status: 'paused',
    department: 'Design',
    age: 45,
    visits: 16,
    progress: 57,
  },
  {
    id: 'u-008',
    name: 'Katherine Johnson',
    status: 'active',
    department: 'Operations',
    age: 39,
    visits: 29,
    progress: 90,
  },
  {
    id: 'u-009',
    name: 'Mary Jackson',
    status: 'invited',
    department: 'Operations',
    age: 35,
    visits: 9,
    progress: 48,
  },
  {
    id: 'u-010',
    name: 'Dorothy Vaughan',
    status: 'active',
    department: 'Operations',
    age: 40,
    visits: 27,
    progress: 86,
  },
  {
    id: 'u-011',
    name: 'John Maeda',
    status: 'paused',
    department: 'Design',
    age: 37,
    visits: 14,
    progress: 69,
  },
  {
    id: 'u-012',
    name: 'Linus Torvalds',
    status: 'active',
    department: 'Engineering',
    age: 33,
    visits: 34,
    progress: 94,
  },
]
export const people4 = people.slice(0, 4)
export const people5 = people.slice(0, 5)
export const people6 = people.slice(0, 6)
export const people9 = people.slice(0, 9)
export const peopleTree: Person[] = [
  { ...people[0]!, children: [people[1]!, people[3]!] },
  { ...people[4]!, children: [people[5]!, people[6]!] },
  { ...people[7]!, children: [people[8]!, people[9]!] },
]
export const virtualPeople: Person[] = Array.from({ length: 10_000 }, (_, index) => {
  const source = people[index % people.length]!
  return {
    ...source,
    id: `virtual-${index + 1}`,
    name: `${source.name} ${index + 1}`,
    visits: source.visits + index,
    progress: (source.progress + index) % 101,
  }
})
