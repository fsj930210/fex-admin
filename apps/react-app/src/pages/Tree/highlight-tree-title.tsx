export function highlightTreeTitle(title: string, keyword: string) {
  if (!keyword) return title
  const index = title.toLowerCase().indexOf(keyword.toLowerCase())
  if (index < 0) return title
  return (
    <>
      {title.slice(0, index)}
      <mark className="rounded-sm bg-warning/20 px-0.5 text-inherit">
        {title.slice(index, index + keyword.length)}
      </mark>
      {title.slice(index + keyword.length)}
    </>
  )
}
