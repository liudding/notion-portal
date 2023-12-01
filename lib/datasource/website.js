import { getCollectionData, getPageData } from '.'
import { getLinksPageId, getWebsiteConfigPageId } from './utils'
import { deepClone } from '@/lib/utils'

const CONFIGS_DATATYPE_MAP = {
  WEBSITE_TITLE: 'string',
  WEBSITE_URL: 'string',
  LINK_CATEGORY_LEVELS: 'array',
  THEME: 'string',

  COPYRIGHT_SINCE: 'string',
  APPEARANCE: 'string',

  DETAIL_PAGE_ENABLED: 'bool'
}

const LINK_PROPERTIES = ['title', 'url', 'icon_url', 'icon_file', 'desc', 'tags', 'created_time']

export async function getWebsiteConfigs() {
  const dataId = getWebsiteConfigPageId()

  const recordMap = await getPageData(dataId, { cache: true })

  const collection = Object.values(recordMap.collection)[0]

  const siteInfo = getSiteInfo({ collection })

  const { rows } = await getCollectionData({
    recordMap,
    pageId: dataId
  })
  const configs = {}
  for (const row of rows) {
    if (!row.Name || !row.Value) {
      continue
    }

    const t = CONFIGS_DATATYPE_MAP[row.Name]
    const k = row.Name
    const v = row.Value.trim()

    if (!t || t === 'string') {
      configs[row.Name] = v
      continue
    }

    switch (t) {
      case 'array':
        configs[k] = v.split(',').map(e => e.trim())
        break
      case 'bool':
      case 'boolean':
        configs[k] = (v.toLowerCase() === 'true' || v === '1' || v === 1)
        break
      case 'number':
        configs[k] = +v
        break
      case 'object':
        configs[k] = JSON.parse(v)
        break

      default:
        break
    }
  }

  // metadata
  const meta = {}
  for (const k in configs) {
    if (k.startsWith('META:') && configs[k]) {
      meta[k.replace('META:', '').toLowerCase()] = configs[k]
    }
  }

  return {
    siteInfo,
    meta,
    configs
  }
}

export async function getLinks() {
  const dataId = getLinksPageId()
  const collection = await getCollectionData({ pageId: dataId })
  const { configs } = await getWebsiteConfigs()

  const links = []
  for (const r of collection.rows) {
    const dl = deepClone(r)

    for (const p of LINK_PROPERTIES) {
      const k = 'LINK_PROPERTY_' + p.toUpperCase()
      if (r[configs[k]]) {
        dl[p] = r[configs[k]]
        delete dl[configs[k]]
      }
    }

    links.push(dl)
  }

  let categories = []
  if (configs.LINK_CATEGORY_LEVELS) {
    const tree = buildCategoryTree(links, configs.LINK_CATEGORY_LEVELS, 0)

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
    links
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
  let icon = collection?.icon || null
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
