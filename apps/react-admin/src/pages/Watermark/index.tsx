import { Link } from 'react-router'
import { BasicDemo } from './basic-demo'
import { CustomConfigDemo } from './custom-config-demo'
import { ImageDemo } from './image-demo'
import { ModalDrawerDemo } from './modal-drawer-demo'
import { MultilineDemo } from './multiline-demo'
import { RestoreDemo } from './restore-demo'

export function WatermarkPage() {
  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-md">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">
            Back home
          </Link>
          <h1 className="text-2xl font-semibold text-foreground">Watermark</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Add repeated text watermarks over content, including image previews.
          </p>
        </header>
        <div className="grid gap-space-xl">
          <BasicDemo />
          <MultilineDemo />
          <ImageDemo />
          <CustomConfigDemo />
          <ModalDrawerDemo />
          <RestoreDemo />
        </div>
      </div>
    </main>
  )
}
