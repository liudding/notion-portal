import CONFIG from '@/config'
import { getPageData } from '.'

export async function getWebsiteConfigs() {
  const recordMap = getPageData(CONFIG.WEBSITE_NOTION_PAGE_ID)

  const collection = Object.values(recordMap.collection)[0]

  const siteInfo = getSiteInfo(collection)

  return {
    siteInfo
  }
}

export async function getLinks() {
  const recordMap = getPageData(CONFIG.LINKS_NOTION_PAGE_ID)

  const collection = Object.values(recordMap.collection)[0]

  const siteInfo = getSiteInfo(collection)

  return {
    siteInfo
  }
}

export function getSiteInfo({
  collection
}) {
  const title = collection?.name?.[0][0] || 'Untitled'
  const description = collection?.description ? Object.assign(collection).description[0][0] : ''
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
