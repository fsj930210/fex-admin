import { ContentDemo } from './content-demo'
import { ShapeDemo } from './shape-demo'
import { SizeDemo } from './size-demo'
export function AvatarPage() {
  return (
    <main class="grid gap-space-xl p-page-padding">
      <SizeDemo />
      <ShapeDemo />
      <ContentDemo />
    </main>
  )
}
