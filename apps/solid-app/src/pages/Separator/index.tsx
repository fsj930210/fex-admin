import { BasicDemo, ListDemo, MenuDemo, TextDemo, VariantsDemo, VerticalDemo } from './demos'
export function SeparatorPage() {
  return (
    <main class="grid gap-space-xl p-page-padding">
      <BasicDemo />
      <VerticalDemo />
      <MenuDemo />
      <ListDemo />
      <TextDemo />
      <VariantsDemo />
    </main>
  )
}
