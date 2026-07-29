import { A } from '@solidjs/router'
import { BasicDemos } from './basic-demos'
import { CustomDemos } from './custom-demos'
import { IntegrationDemos } from './integration-demos'
import { PickerDemos } from './picker-demos'

export function DatePickerPage() {
  return (
    <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div class="mx-auto w-full max-w-6xl space-y-space-xl">
        <header class="space-y-space-xl">
          <A class="text-sm text-muted-foreground hover:text-foreground" href="/">返回首页</A>
          <div>
            <h1 class="text-2xl font-semibold text-foreground">DatePicker</h1>
            <p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
              DatePicker primitive 组合 Input、Popover 和 Calendar，示例覆盖单选、多选、范围、禁用、面板切换和自定义渲染。
            </p>
          </div>
        </header>
        <div class="space-y-space-xl">
          <BasicDemos />
          <PickerDemos />
          <CustomDemos />
          <IntegrationDemos />
        </div>
      </div>
    </main>
  )
}

