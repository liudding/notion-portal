// import { defaultMapImageUrl } from 'react-notion-x'

export function getImageUrl(imgObj, block) {
  if (!imgObj) {
    return null
  }
  if (imgObj.startsWith('/')) {
    return 'https://www.notion.so' + imgObj // notion内部图片转相对路径为绝对路径
  }

  if (block?.type === 'bookmark') {
    return imgObj
  }

  if (imgObj.startsWith('http')) {
    if (imgObj.indexOf('secure.notion-static.com') > 0 || imgObj.indexOf('prod-files-secure') > 0) {
      let table = 'block'
      if (!block.type && block.schema) {
        table = 'collection'
      }

      return 'https://www.notion.so/image/' + encodeURIComponent(imgObj) + '?table=' + table + '&id=' + block.id
    }
  }

  // 其他图片链接 或 emoji
  return imgObj
}
