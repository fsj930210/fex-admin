import { Progress, type ProgressProps } from '@fex-design/solid/primitive/progress'
import { CheckIcon } from '@fex-design/solid/icon/check'
import { MinusIcon } from '@fex-design/solid/icon/minus'
import { PlusIcon } from '@fex-design/solid/icon/plus'
import { Button } from '@fex-design/solid/ui/button'
import { Card } from '@fex-design/solid/ui/card'
import { createSignal, splitProps } from 'solid-js'
const gradient = { from: '#1677ff', to: '#87d068', direction: 'to right' } as const
const segmentGradient = {
  stops: {
    '0%': 'var(--success)',
    '49.999%': 'var(--success)',
    '50%': 'var(--info)',
    '100%': 'var(--info)',
  },
  direction: 'to right',
} as const
const Line = (props: { label: string } & ProgressProps) => {
  const [local, progressProps] = splitProps(props, ['label'])
  return (
    <div class="grid gap-space-sm">
      <div class="flex justify-between text-sm">
        <span>{local.label}</span>
        {progressProps.value != null && (
          <span class="text-muted-foreground">{progressProps.value}%</span>
        )}
      </div>
      <Progress {...progressProps} />
    </div>
  )
}
function StepLine(props: { value: number; steps?: number; color?: string; success?: boolean }) {
  const steps = () => props.steps ?? 5
  const activeSteps = () => Math.round((props.value / 100) * steps())
  return (
    <div class="flex items-center gap-space-sm">
      <div class="flex gap-1">
        {Array.from({ length: steps() }).map((_, index) => (
          <span
            class="h-2 w-4 rounded-[1px]"
            style={{
              background:
                index < activeSteps()
                  ? (props.color ?? 'var(--info)')
                  : 'var(--progress-remaining)',
            }}
          />
        ))}
      </div>
      {props.success ? (
        <span class="inline-flex size-4 items-center justify-center rounded-full bg-success text-[10px] text-white">
          <CheckIcon class="size-3" />
        </span>
      ) : (
        <span class="text-sm">{props.value}%</span>
      )}
    </div>
  )
}
function CircleSteps(props: {
  value: number
  steps?: number
  gap?: number
  color?: string
  success?: boolean
}) {
  const size = 128
  const thickness = 16
  const center = size / 2
  const radius = (size - thickness) / 2
  const stepLength = () => 100 / (props.steps ?? 10)
  const activeSteps = () => Math.round((props.value / 100) * (props.steps ?? 10))
  return (
    <div class="relative inline-flex size-32 items-center justify-center">
      <svg aria-hidden="true" class="size-32" viewBox={`0 0 ${size} ${size}`}>
        {Array.from({ length: props.steps ?? 10 }).map((_, index) => {
          const dash = Math.max(0, stepLength() - (props.gap ?? 2))
          return (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={
                index < activeSteps() ? (props.color ?? 'var(--info)') : 'var(--progress-remaining)'
              }
              stroke-width={thickness}
              stroke-linecap="butt"
              pathLength={100}
              stroke-dasharray={`${dash} ${100 - dash}`}
              stroke-dashoffset={50 - index * stepLength()}
            />
          )
        })}
      </svg>
      <span class="absolute text-2xl">
        {props.success ? <CheckIcon class="size-8 text-success" /> : `${props.value}%`}
      </span>
    </div>
  )
}
function DynamicProgressDemo() {
  const [value, setValue] = createSignal(20)
  const decrease = () => setValue((current) => Math.max(0, current - 10))
  const increase = () => setValue((current) => Math.min(100, current + 10))
  return (
    <div class="grid max-w-xl gap-space-lg">
      <Line label="Controlled line" value={value()} />
      <div class="flex flex-wrap items-center gap-space-xl">
        <Progress variant="circle" value={value()} size={96} thickness={8} showValue />
        <div class="flex gap-space-sm">
          <Button variant="outline" size="icon-sm" onClick={decrease} disabled={value() <= 0}>
            <MinusIcon />
          </Button>
          <Button variant="outline" size="icon-sm" onClick={increase} disabled={value() >= 100}>
            <PlusIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
export function ProgressPage() {
  return (
    <main class="grid gap-space-xl p-page-padding">
      <Card
        title="Basic"
        description="A determinate line progress bar with an external label and value."
      >
        <div class="max-w-xl">
          <Line label="Upload progress" value={35} />
        </div>
      </Card>
      <Card title="Status" description="Info, warning, success and error use system semantic tokens.">
        <div class="grid max-w-xl gap-space-lg">
          <Line label="Normal" value={35} />
          <Line label="Info" value={68} status="info" />
          <Line label="Warning" value={82} status="warning" />
          <Line label="Success" value={100} status="success" />
          <Line label="Error" value={42} status="error" />
        </div>
      </Card>
      <Card title="Color" description="Use arbitrary CSS colors, track colors and gradients.">
        <div class="grid max-w-xl gap-space-lg">
          <Line label="Custom color" value={68} color="#7c3aed" />
          <Line label="Custom track" value={52} color="#0891b2" trackColor="#cffafe" />
          <Line label="Gradient" value={88} color={gradient} />
        </div>
      </Card>
      <Card title="Segmented" description="Use hard color stops to show staged progress.">
        <div class="grid max-w-xl gap-space-xl">
          <Line label="Segmented line" value={60} color={segmentGradient} showValue />
          <div class="flex flex-wrap gap-space-xl">
            <div class="grid justify-items-center gap-space-sm">
              <Progress
                variant="circle"
                value={60}
                size={112}
                thickness={8}
                color={segmentGradient}
                showValue
              />
              <span class="text-sm">Circle</span>
            </div>
            <div class="grid justify-items-center gap-space-sm">
              <Progress
                variant="dashboard"
                value={60}
                size={112}
                thickness={8}
                color={segmentGradient}
                gapDegree={90}
                showValue
              />
              <span class="text-sm">Dashboard</span>
            </div>
          </div>
        </div>
      </Card>
      <Card title="Step Line" description="Show progress as fixed linear steps.">
        <div class="grid gap-space-lg">
          <StepLine value={50} steps={5} />
          <StepLine value={30} steps={5} />
          <StepLine value={100} steps={5} color="var(--success)" success />
          <StepLine value={60} steps={5} color="var(--success)" />
        </div>
      </Card>
      <Card title="Step Circle" description="Show progress as fixed circular steps with custom count and gap.">
        <div class="flex flex-wrap gap-space-xl">
          <div class="grid justify-items-center gap-space-sm">
            <CircleSteps value={50} steps={12} gap={2} />
            <span class="text-sm">Custom count</span>
          </div>
          <div class="grid justify-items-center gap-space-sm">
            <CircleSteps value={100} steps={8} gap={5} color="var(--success)" success />
            <span class="text-sm">Custom gap</span>
          </div>
        </div>
      </Card>
      <Card title="Size" description="Configure line thickness.">
        <div class="grid max-w-xl gap-space-lg">
          <Line label="Thin · 4px" value={30} thickness={4} />
          <Line label="Medium · 8px" value={55} thickness={8} />
          <Line label="Large · 12px" value={80} thickness={12} />
        </div>
      </Card>
      <Card title="Linecap" description="Round line / round track, butt and square endings with the same value.">
        <div class="grid max-w-xl gap-space-lg">
          <Line label="Round line / round track" value={36} thickness={12} linecap="round" />
          <Line
            label="Butt · round track"
            value={36}
            thickness={12}
            linecap="butt"
            trackLinecap="round"
          />
          <Line label="Square line / round track" value={36} thickness={12} linecap="square" />
        </div>
      </Card>
      <Card title="Circle" description="Circular progress supports status and gradients.">
        <div class="flex flex-wrap gap-space-xl">
          <Progress
            variant="circle"
            value={72}
            size={96}
            thickness={8}
            color={gradient}
            showValue
          />
          <Progress
            variant="circle"
            value={100}
            size={96}
            thickness={8}
            status="success"
            showValue
          />
          <Progress variant="circle" value={42} size={96} thickness={8} status="error" showValue />
        </div>
      </Card>
      <Card title="Dashboard" description="Configure the gap degree and placement.">
        <div class="flex flex-wrap gap-space-xl">
          <Progress
            variant="dashboard"
            value={64}
            size={96}
            thickness={8}
            gapDegree={90}
            showValue
          />
          <Progress
            variant="dashboard"
            value={64}
            size={96}
            thickness={8}
            gapDegree={90}
            gapPlacement="top"
            showValue
          />
        </div>
      </Card>
      <Card title="Dynamic" description="Control the same progress value from external actions.">
        <DynamicProgressDemo />
      </Card>
      <Card title="Indeterminate" description="Use a moving indicator when the value is unknown.">
        <div class="grid max-w-xl gap-space-xl">
          <Line label="Processing" value={null} />
          <div class="grid w-fit justify-items-center gap-space-sm">
            <Progress variant="circle" value={null} size={72} thickness={6} color="#1677ff" />
            <span class="text-sm">Processing</span>
          </div>
        </div>
      </Card>
    </main>
  )
}
