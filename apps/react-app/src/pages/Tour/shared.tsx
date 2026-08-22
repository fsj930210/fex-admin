import { Button } from '@fex-design/react/ui/button'
import { CloseIcon } from '@fex-design/react/icon/close'
import { Tour, useTour } from '@fex-design/react/primitive/tour'
import type { ReactNode } from 'react'

export function DemoTarget({ name, children }: { name: string; children: ReactNode }) {
  return (
    <Tour.Target<HTMLDivElement> name={name}>
      {(props) => (
        <div {...props} role="button" tabIndex={0} className="inline-flex h-9 items-center rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted-background">
          {children}
        </div>
      )}
    </Tour.Target>
  )
}

export function StartTourButton({ children = '开始引导' }: { children?: ReactNode }) {
  const { open } = useTour()
  return <Button onClick={open}>{children}</Button>
}

export function TourPanel({ title, description, children }: { title: ReactNode; description: ReactNode; children?: ReactNode }) {
  return (
    <div className="relative w-72 space-y-3">
      <Tour.Control action="close" aria-label="关闭" className="absolute right-0 top-0 z-10 size-7 p-0">
        <CloseIcon className="size-4" />
      </Tour.Control>
      <div className="space-y-1 pr-8"><h3 className="text-sm font-semibold">{title}</h3><p className="text-sm leading-5 text-muted-foreground">{description}</p></div>
      <TourProgress />
      {children}
    </div>
  )
}

export function TourProgress() {
  const { snapshot } = useTour()
  const progress = snapshot.total > 0 ? ((snapshot.currentIndex + 1) / snapshot.total) * 100 : 0
  return <div className="flex items-center gap-2"><span className="shrink-0 text-xs tabular-nums text-muted-foreground">{snapshot.currentIndex + 1} / {snapshot.total}</span><div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-sm bg-muted-background" role="progressbar" aria-label="引导进度" aria-valuemin={0} aria-valuemax={snapshot.total} aria-valuenow={snapshot.currentIndex + 1}><div className="h-full bg-primary transition-[width]" style={{ width: `${progress}%` }} /></div></div>
}

export function DefaultTourActions() {
  const { snapshot } = useTour()
  return <div className="flex items-center justify-end gap-2"><Tour.Control action="skip" className="border-transparent bg-transparent">跳过</Tour.Control><Tour.Control action="previous">上一步</Tour.Control><Tour.Control action={snapshot.isLast ? 'complete' : 'next'} className="!border-primary !bg-primary !text-primary-foreground">{snapshot.isLast ? '完成' : '下一步'}</Tour.Control></div>
}

export function TourNavigation() {
  const { snapshot } = useTour()
  return <div className="flex justify-end gap-2"><Tour.Control action="previous">上一步</Tour.Control><Tour.Control action={snapshot.isLast ? 'complete' : 'next'}>{snapshot.isLast ? '完成' : '下一步'}</Tour.Control></div>
}
