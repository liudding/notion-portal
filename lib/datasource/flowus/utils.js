
export function getTextContent(nodes) {
  return (nodes || []).reduce((item, carry) => {
    return carry + (item.text || '')
  }, '')
}
