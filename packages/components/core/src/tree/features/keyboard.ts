import type { TreeFeatureRegistration } from '../feature-types'
import type { TreeNodeData } from '../types'

export function keyboardFeature<TNode extends TreeNodeData>(): TreeFeatureRegistration<TNode> {
  return { options: undefined, feature: { id: 'keyboard', requires: ['expansion', 'focus'], setup: () => ({}) } }
}
