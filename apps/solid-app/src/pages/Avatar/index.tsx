import { ContentDemo } from './content-demo'
import { ShapeDemo } from './shape-demo'
import { SizeDemo } from './size-demo'
import { GroupDemo } from './group-demo'
export function AvatarPage() {
  return (
    <main class="grid gap-space-xl p-page-padding">
      <SizeDemo />
      <ShapeDemo />
      <ContentDemo />
      <GroupDemo />
    </main>
  )
}
