import CONFIG from '@/config'
import { getCollectionData, getPageData } from '.'
import { getLinksPageId, getWebsiteConfigPageId } from './utils'

const CONFIGS_DATATYPE_MAP = {
  WEBSITE_TITLE: 'string',
  WEBSITE_URL: 'string',
  LINK_CATEGORY_LEVELS: 'array',
  THEME: 'string',

  COPYRIGHT_SINCE: 'string',
  APPEARANCE: 'string'

}

export async function getWebsiteConfigs() {
  const dataId = getWebsiteConfigPageId()

  const recordMap = await getPageData(dataId)

  const collection = Object.values(recordMap.collection)[0]
  console.log('===============', collection)
  const siteInfo = getSiteInfo({ collection })

  const { rows } = await getCollectionData({ recordMap, pageId: dataId })
  const configs = {}
  for (const row of rows) {
    if (!CONFIGS_DATATYPE_MAP[row.Name] || CONFIGS_DATATYPE_MAP[row.Name] === 'string') {
      configs[row.Name] = row.Value
      continue
    }

    if (CONFIGS_DATATYPE_MAP[row.Name] === 'array') {
      configs[row.Name] = row.Value.split(',').map(e => e.trim())
      continue
    }
  }

  return {
    siteInfo,
    configs
  }
}

export async function getLinks() {
  const dataId = getLinksPageId()
  const collection = await getCollectionData({ pageId: dataId })
  const { configs } = await getWebsiteConfigs()

  let categories = []
  if (configs.LINK_CATEGORY_LEVELS) {
    const tree = buildCategoryTree(collection.rows, configs.LINK_CATEGORY_LEVELS, 0)

    let category1Options
    for (const k in collection.schema) {
      if (collection.schema[k].name === configs.LINK_CATEGORY_LEVELS[0]) {
        category1Options = collection.schema[k].options
        break
      }
    }
    const orderedCategories = []
    for (const opt of category1Options) {
      const category = tree.find(c => c.title === opt.value)
      if (category) orderedCategories.push(category)
    }

    categories = orderedCategories
  }

  return {
    categories,
    links: collection.rows
  }
}

function getSiteInfo({
  collection
}) {
  let title = 'Untitled'
  let description = ''

  if (typeof collection.name === 'string') {
    title = collection.name
  } else {
    title = collection?.name?.[0][0] || 'Untitled'
  }

  if (typeof collection.description === 'string') {
    description = collection.description
  } else {
    description = collection.description?.[0][0] || ''
  }

  const pageCover = collection?.cover
  let icon = collection?.icon
  // 站点图标不能是 emoji
  const emojiPattern = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g
  if (emojiPattern.test(icon)) {
    icon = null
  }

  return {
    title,
    description,
    pageCover,
    icon
  }
}

function buildCategoryTree(links, categoryLevels, level) {
  const groupKey = categoryLevels[level]
  if (!groupKey) return

  const groupMap = new Map()
  links.forEach(link => {
    if (!link[groupKey] || !link[groupKey][0]) {
      link[groupKey] = ['未分类']
    }

    const cate = link[groupKey][0]
    if (!groupMap.get(cate)) {
      groupMap.set(cate, {
        id: 'group-' + cate + Math.random() * 1000,
        title: cate,
        children: []
      })
    }

    groupMap.get(cate).children.push(link)
  })

  const groups = Array.from(groupMap.values())
  groups.sort((a, b) => {
    if (a.title === '未分类') return 1
    if (b.title === '未分类') return -1
    return 0
  })
  groups.forEach((group) => {
    const sub = buildCategoryTree(group.children, categoryLevels, level + 1)
    if (sub) group.children = sub
  })

  return groups
}
