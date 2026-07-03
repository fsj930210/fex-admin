function normalizeAccept(accept?: string | string[]) {
  if (!accept) {
    return []
  }

  return (Array.isArray(accept) ? accept : accept.split(','))
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
}

export function matchAccept(file: File, accept?: string | string[]) {
  const acceptList = normalizeAccept(accept)
  if (acceptList.length === 0) {
    return true
  }

  const fileName = file.name.toLowerCase()
  const mimeType = file.type.toLowerCase()

  return acceptList.some((rule) => {
    if (rule.startsWith('.')) {
      return fileName.endsWith(rule)
    }
    if (rule.endsWith('/*')) {
      return mimeType.startsWith(rule.slice(0, -1))
    }
    return mimeType === rule
  })
}

