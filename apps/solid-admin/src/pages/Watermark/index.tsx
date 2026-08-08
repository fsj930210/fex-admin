import { A } from '@solidjs/router'
import { BasicDemo } from './basic-demo'
import { CustomConfigDemo } from './custom-config-demo'
import { ImageDemo } from './image-demo'
import { ModalDrawerDemo } from './modal-drawer-demo'
import { MultilineDemo } from './multiline-demo'
import { RestoreDemo } from './restore-demo'

export function WatermarkPage() {
  return (
    <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div class="mx-auto w-full max-w-5xl space-y-space-xl">
        <header class="space-y-space-md">
          <A class="text-sm text-muted-foreground hover:text-foreground" href="/">
            Back home
          </A>
          <h1 class="text-2xl font-semibold text-foreground">Watermark</h1>
          <p class="max-w-2xl text-sm leading-6 text-muted-foreground">
            Add repeated text watermarks over content, including image previews.
          </p>
        </header>
        <div class="grid gap-space-xl">
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
