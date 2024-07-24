import CONFIG from '@/config'
import { idToUuid } from 'notion-utils'

export function getWebsiteConfigPageId() {
  if (CONFIG.DATASOURCE === 'notion') {
    return idToUuid(CONFIG.WEBSITE_NOTION_PAGE_ID)
  }

  return CONFIG.WEBSITE_NOTION_PAGE_ID
}

export function getLinksPageId() {
  if (CONFIG.DATASOURCE === 'notion') {
    return idToUuid(CONFIG.LINKS_NOTION_PAGE_ID)
  }

  return CONFIG.LINKS_NOTION_PAGE_ID
}
