import type { SVGProps } from 'react'

export function ChevronRightIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
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
      className={className}
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

export function ChevronLeftIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return <ChevronRightIcon className={`rotate-180 ${className}`} {...props} />
}

export function ChevronUpIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return <ChevronRightIcon className={`rotate-270 ${className}`} {...props} />
}

export function ChevronDownIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return <ChevronRightIcon className={`rotate-90 ${className}`} {...props} />
}
