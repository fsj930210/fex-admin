import { Step, StepContent, StepIndicator } from '@fex-design/react/primitive/steps'
import { workflow } from './steps-data'
export function StepList({ error = false, disabled = false }: { error?: boolean; disabled?: boolean }) { return workflow.map((item) => <Step key={item.value} value={item.value} disabled={disabled && item.value === 'profile'} status={error && item.value === 'profile' ? 'error' : undefined} data={item.label}><StepIndicator /><StepContent><strong>{item.label}</strong><p className="text-muted-foreground">{item.description}</p></StepContent></Step>) }
