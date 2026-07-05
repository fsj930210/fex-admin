import { ChangeDetectionStrategy, Component } from '@angular/core'
import { NgStyle } from '@angular/common'
import { RouterLink } from '@angular/router'
import { FexDraggableDirective } from '@fex/components-angular/directives/draggable'
import { FexDroppableDirective } from '@fex/components-angular/directives/droppable'
import { FexDropzoneDirective } from '@fex/components-angular/directives/dropzone'
import { FexMoveDirective } from '@fex/components-angular/directives/move'
import { FexResizeDirective, FexResizeHandleDirective } from '@fex/components-angular/directives/resize'
import Card from '@fex/components-angular/ui/card'

const draggableItems = {
  'status-card': { id: 'status-card', label: 'Status card', type: 'card' },
  'owner-chip': { id: 'owner-chip', label: 'Owner chip', type: 'chip' },
} as const

@Component({
  selector: 'fex-interactions-page',
  imports: [
    RouterLink,
    NgStyle,
    Card,
    FexDraggableDirective,
    FexDroppableDirective,
    FexDropzoneDirective,
    FexMoveDirective,
    FexResizeDirective,
    FexResizeHandleDirective,
  ],
  host: { class: 'block' },
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InteractionsComponent {
  protected readonly draggableItems = draggableItems
  protected files: string[] = []
  protected dropResult = 'Drop a draggable item into a zone.'
  protected dragOverlay: { label: string; style: Record<string, string | number> } | null = null
  protected dropDemoItems = {
    source: ['status-card', 'owner-chip'],
    'card-zone': [] as string[],
    'any-zone': [] as string[],
  }

  protected itemById(itemId: string) {
    return draggableItems[itemId as keyof typeof draggableItems]
  }

  protected onDropFiles(files: File[]) {
    this.files = files.map((file) => file.name)
  }

  protected setDragOverlay(label: string, style: Record<string, string | number>) {
    this.dragOverlay = style['display'] === 'none' ? null : { label, style }
  }

  protected clearDragOverlay() {
    this.dragOverlay = null
  }

  protected reportDrop(zoneId: 'card-zone' | 'any-zone', zone: string, event: { source: Record<string, unknown>; edge: string | null }) {
    const itemId = String(event.source.id)
    if (!(itemId in draggableItems)) {
      return
    }
    this.dropDemoItems = {
      source: this.dropDemoItems.source.filter((id) => id !== itemId),
      'card-zone': [...this.dropDemoItems['card-zone'].filter((id) => id !== itemId), ...(zoneId === 'card-zone' ? [itemId] : [])],
      'any-zone': [...this.dropDemoItems['any-zone'].filter((id) => id !== itemId), ...(zoneId === 'any-zone' ? [itemId] : [])],
    }
    this.dropResult = `${String(event.source.id)} dropped on ${zone}${event.edge ? ` at ${event.edge}` : ''}.`
  }
}
