import type { Point, Rect } from '../../interactions/types'
import { createStore } from '../../store/create-store'
import type { StoreListener } from '../../store/create-store'
import type { TreeFeatureRegistration } from '../feature-types'
import type {
  TreeItem,
  TreeKey,
  TreeMoveInput,
  TreeMutationResult,
  TreeNodeData,
} from '../types'
import type { ExpansionFeatureApi } from './expansion'

export type TreeDropPosition = 'inside' | 'after'

export interface TreeDropResolveInput {
  sourceKey: TreeKey
  targetKey: TreeKey
  pointer: Point
  /** Current drag preview geometry, when supplied by the DOM adapter. */
  dragRect?: Rect | undefined
  targetRect: Rect
  indent: number
}

export interface TreeDropIntent extends TreeDropResolveInput {
  position: TreeDropPosition
  parentKey: TreeKey | null
  index: number
  /** Horizontal insertion-line offset relative to the DOM row receiving the drop. */
  indicatorOffset: number
  valid: boolean
  reason?: string | undefined
}

export interface TreeCanDropInfo<TNode extends TreeNodeData> {
  source: TreeItem<TNode>
  target: TreeItem<TNode>
  position: TreeDropPosition
  parentKey: TreeKey | null
  index: number
}

export interface DndFeatureOptions<TNode extends TreeNodeData> {
  allowDropInsideLeaf?: boolean | undefined
  maxDepth?: number | undefined
  canDrag?: ((item: TreeItem<TNode>) => boolean) | undefined
  canDrop?: ((info: TreeCanDropInfo<TNode>) => boolean | string) | undefined
}

export interface DndFeatureApi {
  canDrag(key: TreeKey): boolean
  resolve(input: TreeDropResolveInput): TreeDropIntent | undefined
  getActiveIntent(): TreeDropIntent | null
  subscribeActiveIntent(listener: StoreListener): () => void
  setActiveIntent(intent: TreeDropIntent | null): void
  clearActiveIntent(targetKey: TreeKey): void
  drop(intent: TreeDropIntent): TreeMutationResult
}

function getSubtreeDepth(
  key: TreeKey,
  getChildrenKeys: (key: TreeKey | null) => readonly TreeKey[],
): number {
  const children = getChildrenKeys(key)
  if (children.length === 0) return 0
  return 1 + Math.max(...children.map((childKey) => getSubtreeDepth(childKey, getChildrenKeys)))
}

function toMoveInput(intent: TreeDropIntent): TreeMoveInput {
  return {
    sourceKey: intent.sourceKey,
    parentKey: intent.parentKey,
    index: intent.index,
  }
}

export function dndFeature<TNode extends TreeNodeData>({
  allowDropInsideLeaf = true,
  maxDepth,
  canDrag,
  canDrop,
}: DndFeatureOptions<TNode> = {}): TreeFeatureRegistration<TNode> {
  return {
    options: undefined,
    feature: {
      id: 'dnd',
      setup: (context) => {
        const activeIntentStore = createStore<TreeDropIntent | null>(null)
        const resolve = (input: TreeDropResolveInput): TreeDropIntent | undefined => {
          const source = context.getItem(input.sourceKey)
          const target = context.getItem(input.targetKey)
          if (!source || !target || input.indent <= 0) return undefined

          const dragRect = input.dragRect
          const overlapsTarget = !dragRect || (
            dragRect.x < input.targetRect.x + input.targetRect.width
            && dragRect.x + dragRect.width > input.targetRect.x
            && dragRect.y < input.targetRect.y + input.targetRect.height
            && dragRect.y + dragRect.height > input.targetRect.y
          )
          const horizontalOffset = (dragRect?.x ?? input.pointer.x) - input.targetRect.x
          // The store supplies the vertically intersected target. Horizontal offset alone chooses
          // whether the source is inserted after it or as its first child.
          const canNest = overlapsTarget
            && horizontalOffset >= input.indent
            && (allowDropInsideLeaf || !target.isLeaf)
          const position: TreeDropPosition = canNest ? 'inside' : 'after'

          const parentKey = position === 'inside' ? target.key : target.parentKey
          let index = position === 'inside'
            ? 0
            : target.index + 1

          if (source.parentKey === parentKey && source.index < index) index -= 1

          const intent: TreeDropIntent = {
            ...input,
            position,
            parentKey,
            index,
            indicatorOffset: position === 'inside'
              ? input.indent
              : 4,
            valid: true,
          }
          const invalidate = (reason: string): TreeDropIntent => ({ ...intent, valid: false, reason })

          if (source.disabled || canDrag?.(source) === false) {
            return invalidate('This node cannot be dragged.')
          }
          if (source.key === target.key) return invalidate('Cannot drop onto itself.')
          if (
            parentKey === source.key
            || (parentKey !== null && context.getDescendantKeys(source.key).includes(parentKey))
          ) {
            return invalidate('Cannot drop into its own descendant.')
          }
          if (!allowDropInsideLeaf && position === 'inside' && target.isLeaf) {
            return invalidate('Leaf nodes cannot accept children.')
          }
          if (maxDepth !== undefined) {
            const nextDepth = parentKey === null
              ? 0
              : (context.getItem(parentKey)?.depth ?? -1) + 1
            if (nextDepth + getSubtreeDepth(source.key, context.getChildrenKeys) > maxDepth) {
              return invalidate('Drop would exceed maxDepth.')
            }
          }
          const customResult = canDrop?.({ source, target, position, parentKey, index })
          if (customResult === false || typeof customResult === 'string') {
            return invalidate(
              typeof customResult === 'string' ? customResult : 'Drop was rejected.',
            )
          }
          return intent
        }

        return {
          canDrag: (key) => {
            const item = context.getItem(key)
            return Boolean(item && !item.disabled && canDrag?.(item) !== false)
          },
          resolve,
          getActiveIntent: activeIntentStore.getSnapshot,
          subscribeActiveIntent: activeIntentStore.subscribe,
          setActiveIntent: (intent) => {
            const current = activeIntentStore.getSnapshot()
            if (
              current?.sourceKey === intent?.sourceKey
              && current?.targetKey === intent?.targetKey
              && current?.parentKey === intent?.parentKey
              && current?.index === intent?.index
              && current?.position === intent?.position
            ) return
            activeIntentStore.setSnapshot(intent)
          },
          clearActiveIntent: (targetKey) => {
            if (activeIntentStore.getSnapshot()?.targetKey === targetKey) {
              activeIntentStore.setSnapshot(null)
            }
          },
          drop: (intent) => {
            if (!intent.valid) {
              return {
                ok: false,
                type: 'move',
                changedKeys: [],
                reason: intent.reason ?? 'Drop was rejected.',
              }
            }
            const result = context.moveNode(toMoveInput(intent))
            if (result.ok && intent.position === 'inside') {
              context.getFeature<ExpansionFeatureApi>('expansion')?.expand(intent.targetKey)
            }
            return result
          },
        } satisfies DndFeatureApi
      },
    },
  }
}
