export interface MasonryDemoItem { id: string; height: number; title: string }
export const masonryItems: MasonryDemoItem[] = [140, 220, 168, 280, 190, 250, 156, 236, 180, 264, 148, 208].map((height, index) => ({ id: `item-${index + 1}`, height, title: `Card ${index + 1}` }))
export const virtualMasonryItems: MasonryDemoItem[] = Array.from({ length: 5000 }, (_, index) => ({ id: `virtual-${index + 1}`, height: 96 + ((index * 47) % 180), title: `Item ${index + 1}` }))
