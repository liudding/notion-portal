
export function getTextContent(nodes) {
  return (nodes || []).reduce((carry, item) => {
    return carry + (item.text || '')
  }, '')
}

export function getImageUrl(path) {
  if (!path) {
    return null
  }

  if (path.startsWith('http')) {
    return path
  }

  if (path.startsWith('/')) {
    return 'https://cdn.flowus.cn' + path
  }

  return 'https://cdn.flowus.cn/' + path
}

export function getIconUrl(path) {
  return 'https://baiyunshan.flowus.cn/assets/byte-icon/dark' + path
}

