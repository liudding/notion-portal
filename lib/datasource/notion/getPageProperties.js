import { getTextContent, getDateValue } from 'notion-utils'
import { NotionAPI } from 'notion-client'
import CONFIG from '@/config'
import formatDate from '../formatDate'
import { defaultMapImageUrl } from 'react-notion-x'

export default async function getPageProperties(block, schema, authToken, tagOptions) {
  const rawProperties = Object.entries(block.value?.properties || [])
  const properties = {
    id: block.id
  }
  for (let i = 0; i < rawProperties.length; i++) {
    const [key, val] = rawProperties[i]

    switch (schema[key]?.type) {
      case 'date': {
        const dateProperty = getDateValue(val)
        delete dateProperty.type
        properties[schema[key].name] = dateProperty
        break
      }
      case 'select':
      case 'multi_select': {
        const selects = getTextContent(val)
        if (selects[0]?.length) {
          properties[schema[key].name] = selects.split(',')
        }
        break
      }
      case 'person': {
        const rawUsers = val.flat()
        const users = []
        const api = new NotionAPI({ authToken })

        for (let i = 0; i < rawUsers.length; i++) {
          if (rawUsers[i][0][1]) {
            const userId = rawUsers[i][0]
            const res = await api.getUsers(userId)
            const resValue =
              res?.recordMapWithRoles?.notion_user?.[userId[1]]?.value
            const user = {
              id: resValue?.id,
              first_name: resValue?.given_name,
              last_name: resValue?.family_name,
              profile_photo: resValue?.profile_photo
            }
            users.push(user)
          }
        }
        properties[schema[key].name] = users
        break
      }
      case 'file': {
        properties[schema[key].name] = {
          name: val[0][0],
          url: val[0][1][0][1] || null
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

  // 映射键：用户自定义表头名
  const fieldNames = CONFIG.NOTION_PROPERTY_NAME
  if (fieldNames) {
    Object.keys(fieldNames).forEach(key => {
      if (fieldNames[key] && properties[fieldNames[key]]) properties[key] = properties[fieldNames[key]]
    })
  }

  // type\status是下拉选框 取数组第一个
  if (properties.type) properties.type = properties.type[0]
  if (properties.status) properties.status = properties.status?.[0]

  // 映射值：用户个性化type和status字段的下拉框选项，在此映射回代码的英文标识
  mapProperties(properties)

  if (properties.type === CONFIG.NOTION_PROPERTY_NAME.type_post) {
    properties.slug = (CONFIG.POST_URL_PREFIX) ? generateCustomizeUrl(properties) : (properties.slug ?? properties.id)
  } else if (properties.type === CONFIG.NOTION_PROPERTY_NAME.type_page) {
    properties.slug = properties.slug ?? properties.id
  } else if (properties.type === CONFIG.NOTION_PROPERTY_NAME.type_menu || properties.type === CONFIG.NOTION_PROPERTY_NAME.type_sub_menu) {
    // 菜单路径为空、作为可展开菜单使用
    properties.to = properties.slug ?? null
    properties.name = properties.title ?? ''
  }

  if (block.created_time) {
    properties.createdTime = formatDate(new Date(block.created_time).toString(), CONFIG.LANG)
  }

  if (block.last_edited_time) {
    properties.lastEditedTime = formatDate(new Date(block.last_edited_time).toString(), CONFIG.LANG)
  }

  properties.fullWidth = block.format?.page_full_width ?? false
  properties.page_icon = getImageUrl(block.format?.page_icon, block) ?? ''
  properties.page_cover = getImageUrl(block.format?.page_cover, block) ?? ''
  properties.content = block.content ?? []

  properties.tagItems = properties?.tags?.map(tag => {
    return { name: tag, color: tagOptions?.find(t => t.value === tag)?.color || 'gray' }
  }) || []
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

function mapProperties(properties) {
  if (properties?.type === CONFIG.NOTION_PROPERTY_NAME.type_post) {
    properties.type = 'Post'
  }
  if (properties?.type === CONFIG.NOTION_PROPERTY_NAME.type_page) {
    properties.type = 'Page'
  }
  if (properties?.type === CONFIG.NOTION_PROPERTY_NAME.type_notice) {
    properties.type = 'Notice'
  }
  if (properties?.status === CONFIG.NOTION_PROPERTY_NAME.status_publish) {
    properties.status = 'Published'
  }
  if (properties?.status === CONFIG.NOTION_PROPERTY_NAME.status_invisible) {
    properties.status = 'Invisible'
  }
}

function generateCustomizeUrl(postProperties) {
  let fullSlug = ''
  const allSlugPatterns = CONFIG.POST_URL_PREFIX.split('/')
  allSlugPatterns.forEach((pattern, idx) => {
    if (pattern === '%year%' && postProperties?.date?.start_date) {
      const formatPostCreatedDate = new Date(postProperties?.date?.start_date)
      fullSlug += formatPostCreatedDate.getUTCFullYear()
    } else if (pattern === '%month%' && postProperties?.date?.start_date) {
      const formatPostCreatedDate = new Date(postProperties?.date?.start_date)
      fullSlug += String(formatPostCreatedDate.getUTCMonth() + 1).padStart(2, 0)
    } else if (pattern === '%day%' && postProperties?.date?.start_date) {
      const formatPostCreatedDate = new Date(postProperties?.date?.start_date)
      fullSlug += String(formatPostCreatedDate.getUTCDate()).padStart(2, 0)
    } else if (pattern === '%slug%') {
      fullSlug += (postProperties.slug ?? postProperties.id)
    } else if (!pattern.includes('%')) {
      fullSlug += pattern
    } else {
      return
    }
    if (idx !== allSlugPatterns.length - 1) {
      fullSlug += '/'
    }
  })
  return `${fullSlug}/${(postProperties.slug ?? postProperties.id)}`
}
