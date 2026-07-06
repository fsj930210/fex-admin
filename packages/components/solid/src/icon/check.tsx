import type { JSX } from 'solid-js'

export function CheckIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      {...props}
      class={['lucide lucide-check-icon lucide-check', props.class].filter(Boolean).join(' ')}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}
