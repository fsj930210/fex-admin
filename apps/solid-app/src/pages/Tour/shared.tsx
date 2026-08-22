import { CloseIcon } from '@fex-design/solid/icon/close'
import { TourControl, TourTarget, useTour } from '@fex-design/solid/primitive/tour'
import { type JSX } from 'solid-js'

export function DemoTarget(props: { name: string; children: JSX.Element }) {
  return <TourTarget name={props.name}>{(slot) => <div ref={slot.ref} {...slot.props} role="button" tabIndex={0} class="inline-flex h-9 items-center rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted-background">{props.children}</div>}</TourTarget>
}
export function StartTourButton(props: { children?: JSX.Element }) {
  const { open } = useTour()
  return <button type="button" class="inline-flex h-9 items-center justify-center rounded-md border border-primary bg-primary px-3 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90" onClick={open}>{props.children ?? '开始引导'}</button>
}
export function TourProgress() {
  const { snapshot } = useTour()
  const progress = () => snapshot().total > 0 ? ((snapshot().currentIndex + 1) / snapshot().total) * 100 : 0
  return <div class="flex items-center gap-2"><span class="shrink-0 text-xs tabular-nums text-muted-foreground">{snapshot().currentIndex + 1} / {snapshot().total}</span><div class="h-1.5 min-w-0 flex-1 overflow-hidden rounded-sm bg-muted-background" role="progressbar" aria-label="引导进度" aria-valuemin="0" aria-valuemax={snapshot().total} aria-valuenow={snapshot().currentIndex + 1}><div class="h-full bg-primary transition-[width]" style={{ width: `${progress()}%` }} /></div></div>
}
export function TourPanel(props: { title: JSX.Element; description: JSX.Element; children?: JSX.Element }) {
  return <div class="relative w-72 space-y-3"><TourControl action="close" aria-label="关闭" class="absolute right-0 top-0 z-10 size-7 p-0"><CloseIcon class="size-4" /></TourControl><div class="space-y-1 pr-8"><h3 class="text-sm font-semibold">{props.title}</h3><p class="text-sm leading-5 text-muted-foreground">{props.description}</p></div><TourProgress />{props.children}</div>
}
export function DefaultTourActions() {
  const { snapshot } = useTour()
  return <div class="flex items-center justify-end gap-2"><TourControl action="skip" class="border-transparent bg-transparent">跳过</TourControl><TourControl action="previous">上一步</TourControl><TourControl action={snapshot().isLast ? 'complete' : 'next'} class="!border-primary !bg-primary !text-primary-foreground">{snapshot().isLast ? '完成' : '下一步'}</TourControl></div>
}
export function TourNavigation() {
  const { snapshot } = useTour()
  return <div class="flex justify-end gap-2"><TourControl action="previous">上一步</TourControl><TourControl action={snapshot().isLast ? 'complete' : 'next'}>{snapshot().isLast ? '完成' : '下一步'}</TourControl></div>
}
export function TourIndicators(props: { count: number }) {
  const { snapshot, goTo } = useTour()
  return <div class="flex items-center gap-1" aria-label="引导进度">{Array.from({ length: props.count }, (_, index) => <button type="button" aria-label={`第 ${index + 1} 步`} aria-current={index === snapshot().currentIndex ? 'step' : undefined} class={index === snapshot().currentIndex ? 'h-1.5 w-5 rounded-full bg-primary' : 'h-1.5 w-1.5 rounded-full bg-muted-foreground/40'} onClick={() => void goTo(index)} />)}</div>
}
