import { Progress } from '@fex-design/react/primitive/progress'
import { CheckIcon } from '@fex-design/react/icon/check'
import { MinusIcon } from '@fex-design/react/icon/minus'
import { PlusIcon } from '@fex-design/react/icon/plus'
import { Button } from '@fex-design/react/ui/button'
import { Card } from '@fex-design/react/ui/card'
import { useState, type ComponentProps } from 'react'
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
const Line = ({ label, ...props }: { label: string } & ComponentProps<typeof Progress>) => (
  <div className="grid gap-space-sm">
    <div className="flex justify-between text-sm">
      <span>{label}</span>
      {props.value != null && <span className="text-muted-foreground">{props.value}%</span>}
    </div>
    <Progress {...props} />
  </div>
)
function StepLine({
  value,
  steps = 5,
  color = 'var(--info)',
  success = false,
}: {
  value: number
  steps?: number
  color?: string
  success?: boolean
}) {
  const activeSteps = Math.round((value / 100) * steps)
  return (
    <div className="flex items-center gap-space-sm">
      <div className="flex gap-1">
        {Array.from({ length: steps }).map((_, index) => (
          <span
            key={index}
            className="h-2 w-4 rounded-[1px]"
            style={{
              background:
                index < activeSteps ? color : 'var(--progress-remaining)',
            }}
          />
        ))}
      </div>
      {success ? (
        <span className="inline-flex size-4 items-center justify-center rounded-full bg-success text-[10px] text-white">
          <CheckIcon className="size-3" />
        </span>
      ) : (
        <span className="text-sm">{value}%</span>
      )}
    </div>
  )
}
function CircleSteps({
  value,
  steps = 10,
  gap = 2,
  color = 'var(--info)',
  success = false,
}: {
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
  const circumference = 2 * Math.PI * radius
  const stepLength = 100 / steps
  const activeSteps = Math.round((value / 100) * steps)
  return (
    <div className="relative inline-flex size-32 items-center justify-center">
      <svg aria-hidden="true" className="size-32" viewBox={`0 0 ${size} ${size}`}>
        {Array.from({ length: steps }).map((_, index) => {
          const dash = Math.max(0, stepLength - gap)
          return (
            <circle
              key={index}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={index < activeSteps ? color : 'var(--progress-remaining)'}
              strokeWidth={thickness}
              strokeLinecap="butt"
              pathLength={100}
              strokeDasharray={`${dash} ${100 - dash}`}
              strokeDashoffset={50 - index * stepLength}
            />
          )
        })}
      </svg>
      <span className="absolute text-2xl">
        {success ? <CheckIcon className="size-8 text-success" /> : `${value}%`}
      </span>
    </div>
  )
}
function DynamicProgressDemo() {
  const [value, setValue] = useState(20)
  const decrease = () => setValue((current) => Math.max(0, current - 10))
  const increase = () => setValue((current) => Math.min(100, current + 10))
  return (
    <div className="grid max-w-xl gap-space-lg">
      <Line label="Controlled line" value={value} />
      <div className="flex flex-wrap items-center gap-space-xl">
        <Progress variant="circle" value={value} size={96} thickness={8} showValue />
        <div className="flex gap-space-sm">
          <Button variant="outline" size="icon-sm" onClick={decrease} disabled={value <= 0}>
            <MinusIcon />
          </Button>
          <Button variant="outline" size="icon-sm" onClick={increase} disabled={value >= 100}>
            <PlusIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
export function ProgressPage() {
  return (
    <main className="grid gap-space-xl p-page-padding">
      <Card
        title="Basic"
        description="A determinate line progress bar with an external label and value."
      >
        <div className="max-w-xl">
          <Line label="Upload progress" value={35} />
        </div>
      </Card>
      <Card title="Status" description="Info, warning, success and error use system semantic tokens.">
        <div className="grid max-w-xl gap-space-lg">
          <Line label="Normal" value={35} />
          <Line label="Info" value={68} status="info" />
          <Line label="Warning" value={82} status="warning" />
          <Line label="Success" value={100} status="success" />
          <Line label="Error" value={42} status="error" />
        </div>
      </Card>
      <Card title="Color" description="Use arbitrary CSS colors, track colors and gradients.">
        <div className="grid max-w-xl gap-space-lg">
          <Line label="Custom color" value={68} color="#7c3aed" />
          <Line label="Custom track" value={52} color="#0891b2" trackColor="#cffafe" />
          <Line label="Gradient" value={88} color={gradient} />
        </div>
      </Card>
      <Card title="Segmented" description="Use hard color stops to show staged progress.">
        <div className="grid max-w-xl gap-space-xl">
          <Line label="Segmented line" value={60} color={segmentGradient} showValue />
          <div className="flex flex-wrap gap-space-xl">
            <div className="grid justify-items-center gap-space-sm">
              <Progress
                variant="circle"
                value={60}
                size={112}
                thickness={8}
                color={segmentGradient}
                showValue
              />
              <span className="text-sm">Circle</span>
            </div>
            <div className="grid justify-items-center gap-space-sm">
              <Progress
                variant="dashboard"
                value={60}
                size={112}
                thickness={8}
                color={segmentGradient}
                gapDegree={90}
                showValue
              />
              <span className="text-sm">Dashboard</span>
            </div>
          </div>
        </div>
      </Card>
      <Card title="Step Line" description="Show progress as fixed linear steps.">
        <div className="grid gap-space-lg">
          <StepLine value={50} steps={5} />
          <StepLine value={30} steps={5} />
          <StepLine value={100} steps={5} color="var(--success)" success />
          <StepLine value={60} steps={5} color="var(--success)" />
        </div>
      </Card>
      <Card title="Step Circle" description="Show progress as fixed circular steps with custom count and gap.">
        <div className="flex flex-wrap gap-space-xl">
          <div className="grid justify-items-center gap-space-sm">
            <CircleSteps value={50} steps={12} gap={2} />
            <span className="text-sm">Custom count</span>
          </div>
          <div className="grid justify-items-center gap-space-sm">
            <CircleSteps value={100} steps={8} gap={5} color="var(--success)" success />
            <span className="text-sm">Custom gap</span>
          </div>
        </div>
      </Card>
      <Card title="Size" description="Configure line thickness.">
        <div className="grid max-w-xl gap-space-lg">
          <Line label="Thin · 4px" value={30} thickness={4} />
          <Line label="Medium · 8px" value={55} thickness={8} />
          <Line label="Large · 12px" value={80} thickness={12} />
        </div>
      </Card>
      <Card title="Linecap" description="Round line / round track, butt and square endings with the same value.">
        <div className="grid max-w-xl gap-space-lg">
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
      <Card
        title="Circle"
        description="Circular progress supports size, thickness, status and gradients."
      >
        <div className="flex flex-wrap gap-space-xl">
          {[
            ['Gradient', 72, 'normal'],
            ['Success', 100, 'success'],
            ['Error', 42, 'error'],
          ].map(([label, value, status]) => (
            <div key={label} className="grid justify-items-center gap-space-sm">
              <Progress
                variant="circle"
                value={value as number}
                size={96}
                thickness={8}
                color={label === 'Gradient' ? gradient : undefined}
                status={status as 'normal' | 'info' | 'warning' | 'success' | 'error'}
                showValue
              />
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Dashboard" description="Configure the gap degree and its placement.">
        <div className="flex flex-wrap gap-space-xl">
          <div className="grid justify-items-center gap-space-sm">
            <Progress
              variant="dashboard"
              value={64}
              size={96}
              thickness={8}
              gapDegree={90}
              showValue
            />
            <span className="text-sm">Bottom gap</span>
          </div>
          <div className="grid justify-items-center gap-space-sm">
            <Progress
              variant="dashboard"
              value={64}
              size={96}
              thickness={8}
              gapDegree={90}
              gapPlacement="top"
              showValue
            />
            <span className="text-sm">Top gap</span>
          </div>
        </div>
      </Card>
      <Card title="Dynamic" description="Control the same progress value from external actions.">
        <DynamicProgressDemo />
      </Card>
      <Card
        title="Indeterminate"
        description="Use a moving indicator when the completion value is unknown."
      >
        <div className="grid max-w-xl gap-space-xl">
          <Line label="Processing" value={null} />
          <div className="grid w-fit justify-items-center gap-space-sm">
            <Progress variant="circle" value={null} size={72} thickness={6} color="#1677ff" />
            <span className="text-sm">Processing</span>
          </div>
        </div>
      </Card>
    </main>
  )
}
