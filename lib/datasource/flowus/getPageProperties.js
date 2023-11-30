import { defaultMapImageUrl } from 'react-notion-x'
import { getTextContent } from './utils'

export default async function getPageProperties(block, schema) {
  const rawProperties = Object.entries(block?.properties || [])
  const properties = {
    id: block.id
  }
  for (let i = 0; i < rawProperties.length; i++) {
    const [key, val] = rawProperties[i]

    switch (schema[key]?.type) {
      case 'date': {
        // const dateProperty = getDateValue(val)
        // delete dateProperty.type
        // properties[schema[key].name] = dateProperty
        break
      }
      case 'select':
      case 'multi_select': {
        if (val?.length) {
          properties[schema[key].name] = val[0].text.split(',')
        }
        break
      }
      case 'person': {
        break
      }
      case 'file': {
        properties[schema[key].name] = {
          name: val[0].text,
          url: val[0].url
        }
        break
      }
      default:
        properties[schema[key].name] = getTextContent(val)
        break
    }

    if (properties[schema[key].name] === undefined) {
      properties[schema[key].name] = null
    }
  }

  properties.fullWidth = block.format?.page_full_width ?? false
  properties.page_icon = getImageUrl(block.format?.page_icon, block) ?? ''
  properties.page_cover = getImageUrl(block.format?.page_cover, block) ?? ''
  properties.content = block.content ?? []

  // properties.tagItems = properties?.tags?.map(tag => {
  //   return { name: tag, color: tagOptions?.find(t => t.value === tag)?.color || 'gray' }
  // }) || []
  delete properties.content
  return properties
}

// 从Block获取封面图;优先取PageCover，否则取内容图片
function getImageUrl(imgObj, blockVal) {
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
