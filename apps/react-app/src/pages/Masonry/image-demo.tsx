import { MasonryItem, MasonryRoot, MasonryViewport } from '@fex-design/react/primitive/masonry'

const images = [[10, 4, 3], [20, 3, 4], [40, 1, 1], [30, 16, 9], [60, 4, 5], [50, 5, 4], [70, 3, 2]]

export function ImageMasonryDemo() {
  return <MasonryRoot columns={{ minColumnWidth: 160, max: 3 }} gap={16}><MasonryViewport>{images.map(([id, width, height], index) => <MasonryItem key={id} itemKey={id!} index={index}><article className="overflow-hidden rounded-md border border-border bg-muted-background"><div className="relative overflow-hidden bg-muted" style={{ aspectRatio: `${width}/${height}` }}><img className="absolute inset-0 h-full w-full object-cover" src={`https://picsum.photos/id/${id}/640/${Math.round(640 * height! / width!)}`} alt={`瀑布流示例图片 ${index + 1}`} onError={event => { event.currentTarget.hidden = true; event.currentTarget.parentElement?.setAttribute('data-load-error', '') }} /></div><p className="p-space-sm text-sm">比例 {width}:{height}</p></article></MasonryItem>)}</MasonryViewport></MasonryRoot>
}
