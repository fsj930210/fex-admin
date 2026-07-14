import type { TreeFeatureRegistration } from '../feature-types'
import type { TreeNodeData, TreeSearchSubtreeOptions } from '../types'
import { getSearchSubtree } from '../get-search-subtree'

export interface SearchFeatureApi<TNode extends TreeNodeData> { getSubtree(options: TreeSearchSubtreeOptions<TNode>): readonly TNode[] }
export function searchFeature<TNode extends TreeNodeData>(): TreeFeatureRegistration<TNode> {
  return {
    options: undefined,
    feature: {
      id: 'search',
      setup: (context) => ({
        getSubtree: (options) => getSearchSubtree(
          context.getSnapshot().treeData,
          context.getFieldNames(),
          options,
        ),
      }) satisfies SearchFeatureApi<TNode>,
    },
  }
}
