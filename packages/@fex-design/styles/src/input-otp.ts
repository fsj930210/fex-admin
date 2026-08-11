export const inputOTPRootClassName =
  'inline-flex items-center gap-space-sm data-[disabled=true]:opacity-70'

export const inputOTPGroupClassName =
  'inline-flex items-center [&_[data-slot=input-otp-input]:not(:first-child)]:-ml-px [&_[data-slot=input-otp-input]:not(:first-child)]:rounded-l-none [&_[data-slot=input-otp-input]:not(:last-child)]:rounded-r-none'

export const inputOTPInputClassName = [
  'h-8 w-8 min-w-8 rounded-md border border-border bg-background px-2 text-center text-sm font-medium text-foreground outline-none transition-colors',
  'focus:z-10 focus:border-focus focus:ring-3 focus:ring-focus/50',
  'disabled:cursor-not-allowed disabled:bg-disabled-background disabled:text-disabled-foreground',
  'read-only:bg-muted-background',
  'aria-invalid:border-danger aria-invalid:ring-3 aria-invalid:ring-danger/20',
].join(' ')

export const inputOTPSeparatorClassName =
  'flex min-w-3 items-center justify-center text-muted-foreground'
