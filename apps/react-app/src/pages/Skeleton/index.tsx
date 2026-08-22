import { AnimationDemo } from './animation-demo'
import { AvatarDemo } from './avatar-demo'
import { BasicDemo } from './basic-demo'
import { CardDemo } from './card-demo'
import { FormDemo } from './form-demo'
import { TableDemo } from './table-demo'
import { TextDemo } from './text-demo'
export function SkeletonPage() {
  return (
    <main className="grid gap-space-xl p-page-padding">
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
