export async function getDroppedFiles(dataTransfer: DataTransfer) {
  const files: File[] = []
  const entries = [...dataTransfer.items]
    .map((item) => item.webkitGetAsEntry?.())
    .filter(Boolean) as FileSystemEntry[]
  if (!entries.length) return [...dataTransfer.files]

  async function visit(entry: FileSystemEntry, path = ''): Promise<void> {
    if (entry.isFile) {
      const file = await new Promise<File>((resolve, reject) =>
        (entry as FileSystemFileEntry).file(resolve, reject),
      )
      Object.defineProperty(file, 'webkitRelativePath', {
        configurable: true,
        value: `${path}${file.name}`,
      })
      files.push(file)
      return
    }
    const reader = (entry as FileSystemDirectoryEntry).createReader()
    const children: FileSystemEntry[] = []
    for (;;) {
      const batch = await new Promise<FileSystemEntry[]>((resolve, reject) =>
        reader.readEntries(resolve, reject),
      )
      if (!batch.length) break
      children.push(...batch)
    }
    await Promise.all(children.map((child) => visit(child, `${path}${entry.name}/`)))
  }

  await Promise.all(entries.map((entry) => visit(entry)))
  return files
}
