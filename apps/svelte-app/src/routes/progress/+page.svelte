<script lang="ts">
  import Progress from '@fex-design/svelte/primitive/progress'
  import CheckIcon from '@fex-design/svelte/icon/check'
  import MinusIcon from '@fex-design/svelte/icon/minus'
  import PlusIcon from '@fex-design/svelte/icon/plus'
  import Button from '@fex-design/svelte/ui/button'
  import Card from '@fex-design/svelte/ui/card'

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
  const stepLineDemos = [
    { value: 50, steps: 5, color: 'var(--info)' },
    { value: 30, steps: 5, color: 'var(--info)' },
    { value: 100, steps: 5, color: 'var(--success)', success: true },
    { value: 60, steps: 5, color: 'var(--success)' },
  ]
  const circleStepDemos = [
    { label: 'Custom count', value: 50, steps: 12, gap: 2, color: 'var(--info)' },
    { label: 'Custom gap', value: 100, steps: 8, gap: 5, color: 'var(--success)', success: true },
  ]
  const getActiveSteps = (value: number, steps: number) => Math.round((value / 100) * steps)
  const getStepDasharray = (steps: number, gap: number) => {
    const stepLength = 100 / steps
    const dash = Math.max(0, stepLength - gap)
    return `${dash} ${100 - dash}`
  }
  let dynamicValue = $state(20)
  const decrease = () => {
    dynamicValue = Math.max(0, dynamicValue - 10)
  }
  const increase = () => {
    dynamicValue = Math.min(100, dynamicValue + 10)
  }
</script>

<main class="grid gap-space-xl p-page-padding">
  <Card
    title="Basic"
    description="A determinate line progress bar with an external label and value."
  >
    <div class="grid max-w-xl gap-space-sm">
      <div class="flex justify-between text-sm">
        <span>Upload progress</span><span class="text-muted-foreground">35%</span>
      </div>
      <Progress value={35} />
    </div>
  </Card>
  <Card title="Status" description="Info, warning, success and error use system semantic tokens.">
    <div class="grid max-w-xl gap-space-lg">
      <div><span>Normal · 35%</span><Progress value={35} /></div>
      <div><span>Info / 68%</span><Progress value={68} status="info" /></div>
      <div><span>Warning / 82%</span><Progress value={82} status="warning" /></div>
      <div><span>Success · 100%</span><Progress value={100} status="success" /></div>
      <div><span>Error · 42%</span><Progress value={42} status="error" /></div>
    </div>
  </Card>
  <Card title="Color" description="Use arbitrary CSS colors, track colors and gradients.">
    <div class="grid max-w-xl gap-space-lg">
      <div><span>Custom color</span><Progress value={68} color="#7c3aed" /></div>
      <div>
        <span>Custom track</span><Progress value={52} color="#0891b2" trackColor="#cffafe" />
      </div>
      <div><span>Gradient</span><Progress value={88} color={gradient} /></div>
    </div>
  </Card>
  <Card title="Segmented" description="Use hard color stops to show staged progress.">
    <div class="grid max-w-xl gap-space-xl">
      <div class="grid gap-space-sm">
        <div class="flex justify-between text-sm">
          <span>Segmented line</span><span class="text-muted-foreground">60%</span>
        </div>
        <Progress value={60} color={segmentGradient} showValue />
      </div>
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
      {#each stepLineDemos as demo (demo.value)}
        <div class="flex items-center gap-space-sm">
          <div class="flex gap-1">
            {#each Array.from({ length: demo.steps }) as _, index}
              <span
                class="h-2 w-4 rounded-[1px]"
                style:background={index < getActiveSteps(demo.value, demo.steps)
                  ? demo.color
                  : 'var(--progress-remaining)'}
              ></span>
            {/each}
          </div>
          {#if demo.success}
            <span
              class="inline-flex size-4 items-center justify-center rounded-full bg-success text-[10px] text-white"
              ><CheckIcon class="size-3" /></span
            >
          {:else}
            <span class="text-sm">{demo.value}%</span>
          {/if}
        </div>
      {/each}
    </div>
  </Card>
  <Card title="Step Circle" description="Show progress as fixed circular steps with custom count and gap.">
    <div class="flex flex-wrap gap-space-xl">
      {#each circleStepDemos as demo (demo.label)}
        <div class="grid justify-items-center gap-space-sm">
          <div class="relative inline-flex size-32 items-center justify-center">
            <svg aria-hidden="true" class="size-32" viewBox="0 0 128 128">
              {#each Array.from({ length: demo.steps }) as _, index}
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke={index < getActiveSteps(demo.value, demo.steps)
                    ? demo.color
                    : 'var(--progress-remaining)'}
                  stroke-width="16"
                  stroke-linecap="butt"
                  pathLength="100"
                  stroke-dasharray={getStepDasharray(demo.steps, demo.gap)}
                  stroke-dashoffset={50 - index * (100 / demo.steps)}
                ></circle>
              {/each}
            </svg>
            <span class="absolute text-2xl">
              {#if demo.success}<CheckIcon class="size-8 text-success" />{:else}{demo.value}%{/if}
            </span>
          </div>
          <span class="text-sm">{demo.label}</span>
        </div>
      {/each}
    </div>
  </Card>
  <Card title="Size" description="Configure line thickness.">
    <div class="grid max-w-xl gap-space-lg">
      <div><span>Thin · 4px</span><Progress value={30} thickness={4} /></div>
      <div><span>Medium · 8px</span><Progress value={55} thickness={8} /></div>
      <div><span>Large · 12px</span><Progress value={80} thickness={12} /></div>
    </div>
  </Card>
  <Card title="Linecap" description="Round line / round track, butt and square endings with the same value.">
    <div class="grid max-w-xl gap-space-lg">
      <div><span>Round line / round track</span><Progress value={36} thickness={12} linecap="round" /></div>
      <div>
        <span>Butt · round track</span><Progress
          value={36}
          thickness={12}
          linecap="butt"
          trackLinecap="round"
        />
      </div>
      <div><span>Square line / round track</span><Progress value={36} thickness={12} linecap="square" /></div>
    </div>
  </Card>
  <Card title="Circle" description="Circular progress supports status and gradients.">
    <div class="flex flex-wrap gap-space-xl">
      <Progress variant="circle" value={72} size={96} thickness={8} color={gradient} showValue />
      <Progress variant="circle" value={100} size={96} thickness={8} status="success" showValue />
      <Progress variant="circle" value={42} size={96} thickness={8} status="error" showValue />
    </div>
  </Card>
  <Card title="Dashboard" description="Configure the gap degree and placement.">
    <div class="flex flex-wrap gap-space-xl">
      <Progress variant="dashboard" value={64} size={96} thickness={8} gapDegree={90} showValue />
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
    <div class="grid max-w-xl gap-space-lg">
      <div class="grid gap-space-sm">
        <div class="flex justify-between text-sm">
          <span>Controlled line</span><span class="text-muted-foreground">{dynamicValue}%</span>
        </div>
        <Progress value={dynamicValue} />
      </div>
      <div class="flex flex-wrap items-center gap-space-xl">
        <Progress variant="circle" value={dynamicValue} size={96} thickness={8} showValue />
        <div class="flex gap-space-sm">
          <Button variant="outline" size="icon-sm" disabled={dynamicValue <= 0} onclick={decrease}>
            <MinusIcon />
          </Button>
          <Button variant="outline" size="icon-sm" disabled={dynamicValue >= 100} onclick={increase}>
            <PlusIcon />
          </Button>
        </div>
      </div>
    </div>
  </Card>
  <Card title="Indeterminate" description="Use a moving indicator when the value is unknown.">
    <div class="grid max-w-xl gap-space-xl">
      <div><span>Processing</span><Progress value={null} /></div>
      <div class="grid w-fit justify-items-center gap-space-sm">
        <Progress variant="circle" value={null} size={72} thickness={6} color="#1677ff" />
        <span class="text-sm">Processing</span>
      </div>
    </div>
  </Card>
</main>
