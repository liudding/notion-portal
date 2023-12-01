import { defaultMapImageUrl } from 'react-notion-x'

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
    // 如果是 notion 上传的图片要拼接访问token
    const u = new URL(imgObj)
    if (u.pathname.startsWith('/secure.notion-static.com') && u.hostname.endsWith('.amazonaws.com')) {
      return defaultMapImageUrl(imgObj, block) // notion上传的图片需要转换请求地址
    }
  }

  // 其他图片链接 或 emoji
  return imgObj
}
