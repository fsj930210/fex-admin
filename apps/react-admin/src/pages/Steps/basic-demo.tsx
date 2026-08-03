import { Steps } from '@fex/components-react/primitive/steps'; import { Card } from '@fex/components-react/ui/card'; import { StepList } from './step-list'
export function BasicDemo(){return <Card title="Uncontrolled" description="defaultCurrent selects the initial step without owning later navigation state."><Steps defaultCurrent="profile"><StepList/></Steps></Card>}
