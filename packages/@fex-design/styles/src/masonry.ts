export const masonryRootClassName = 'relative block min-w-0'

export const masonryViewportClassName = 'relative block w-full transition-[height] duration-300'

export const masonryItemClassName = [
  'absolute start-0 top-0 min-w-0',
  'translate-x-[var(--masonry-inline-start)] translate-y-[var(--masonry-top)]',
  'w-[var(--masonry-item-width)]',
  'transition-[transform,width] duration-300 ease-out',
  'motion-reduce:transition-none',
].join(' ')

export const masonryVirtualViewportClassName = 'relative block w-full overflow-auto'
