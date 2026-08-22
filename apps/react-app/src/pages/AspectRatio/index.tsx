import { LandscapeDemo } from './landscape-demo'
import { PortraitDemo } from './portrait-demo'
import { SquareDemo } from './square-demo'
export function AspectRatioPage() {
  return (
    <main className="grid gap-space-xl p-page-padding">
      <LandscapeDemo />
      <SquareDemo />
      <PortraitDemo />
    </main>
  )
}
