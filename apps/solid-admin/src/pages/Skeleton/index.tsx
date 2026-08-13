import {
  AnimationDemo,
  AvatarDemo,
  BasicDemo,
  CardDemo,
  FormDemo,
  TableDemo,
  TextDemo,
} from './demos'
export function SkeletonPage() {
  return (
    <main class="grid gap-space-xl p-page-padding">
      <BasicDemo />
      <AvatarDemo />
      <CardDemo />
      <TextDemo />
      <FormDemo />
      <TableDemo />
      <AnimationDemo />
    </main>
  )
}
