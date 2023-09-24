import { getGlobalNotionCollectionData } from '@/lib/notion/getNotionData'
import CONFIG from '@/config'

let SETTINGS = null

export function initGlobalSettings(blocks) {
  SETTINGS = formatSettings(blocks)
  return SETTINGS
}

export async function getGlobalSettings() {
  if (SETTINGS) {
    return SETTINGS
  }

  const websiteSettings = await getGlobalNotionCollectionData({
    pageId: CONFIG.WEBSITE_NOTION_PAGE_ID
  })

  return initGlobalSettings(websiteSettings.collectionRows)
}

export function formatSettings(blocks) {
  const settings = {}
  for (const item of blocks) {
    if (!(item.Name in SETTING_KEYS)) {
      continue
    }

    const key = SETTING_KEYS[item.Name]
    if (typeof key !== 'object' || key === null) {
      settings[item.Name] = item.Value ?? key
      continue
    }

    if (key.type === 'array') {
      settings[item.Name] = item.Value.split(key.delimiter || ',')
    }
  }

  return settings
}

const SETTING_KEYS = {
  WEBSITE_URL: {},
  KEYWORDS: '',
  CATEGORY_LEVELS: {
    type: 'array',
    delimiter: ','
  },
  COPYRIGHT_SINCE: '',
  APPEARANCE: 'light',
  REVALIDATE: 120
}
