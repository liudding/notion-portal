import { defaultMapImageUrl } from 'react-notion-x'

export function getImageUrl(imgObj, blockVal) {
  if (!imgObj) {
    return null
  }
  if (imgObj.startsWith('/')) {
    return 'https://www.notion.so' + imgObj // notion内部图片转相对路径为绝对路径
  }

  if (imgObj.startsWith('http')) {
    // 判断如果是notion上传的图片要拼接访问token
    const u = new URL(imgObj)
    if (u.pathname.startsWith('/secure.notion-static.com') && u.hostname.endsWith('.amazonaws.com')) {
      return defaultMapImageUrl(imgObj, blockVal) // notion上传的图片需要转换请求地址
    }
  }

  // 其他图片链接 或 emoji
  return imgObj
}

/**
 * Notion图片映射处理有emoji的图标
 * @param {*} img
 * @param {*} value
 * @returns
 */
const mapImgUrl = (img, block, type = 'block') => {
  let ret = null
  if (!img) {
    return ret
  }
  // 相对目录，则视为notion的自带图片
  if (img.startsWith('/')) ret = 'https://www.notion.so' + img

  // 书签的地址本身就是永久链接，无需处理
  if (!ret && block?.type === 'bookmark') {
    ret = img
  }

  // notion永久图床地址
  if (!ret && img.indexOf('secure.notion-static.com') > 0 && (CONFIG.IMG_URL_TYPE === 'Notion' || type !== 'block')) {
    ret = 'https://www.notion.so/image/' + encodeURIComponent(img) + '?table=' + type + '&id=' + block.id
  }

  // 剩余的是第三方图片url或emoji
  if (!ret) {
    ret = img
  }

  return ret
}
