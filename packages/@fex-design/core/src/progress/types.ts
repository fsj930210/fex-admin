export type ProgressVariant = 'line' | 'circle' | 'dashboard'
export type ProgressStatus = 'normal' | 'info' | 'warning' | 'success' | 'error'
export type ProgressLinecap = 'round' | 'butt' | 'square'
export type ProgressGradient =
  | { from: string; to: string; direction?: string }
  | { stops: Record<string, string>; direction?: string }
export type ProgressColor = string | ProgressGradient

export interface ProgressGeometry {
  value: number | null
  percentage: number | null
  state: 'indeterminate' | 'loading' | 'complete'
  radius: number
  center: number
  circumference: number
  trackDasharray: string
  rangeDasharray: string
  dashOffset: number
  rotation: number
  arcRatio: number
}
