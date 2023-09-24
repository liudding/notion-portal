import CONFIG from '@/config'
import { getGlobalNotionCollectionData, getGlobalNotionData } from '@/lib/notion/getNotionData'
import * as ThemeMap from '@/themes'
import { useGlobal } from '@/lib/global'
import { generateRobotsTxt } from '@/lib/robots.txt'
import { getGlobalSettings } from '@/core/settings'

const Index = props => {
  const { theme } = useGlobal()
  const ThemeComponents = ThemeMap[theme]
  return <ThemeComponents.LayoutIndex {...props} />
}

export async function getStaticProps() {
  const from = 'index'
  const props = await getGlobalNotionData({
    pageId: CONFIG.WEBSITE_NOTION_PAGE_ID,
    from
  })

  const settings = await getGlobalSettings()

  const linksCollection = await getGlobalNotionCollectionData({
    from,
    pageId: CONFIG.LINKS_NOTION_PAGE_ID
  })
  const { siteInfo } = props

  const meta = {
    title: `${siteInfo?.title} | ${siteInfo?.description}`,
    description: siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: '',
    type: 'website'
  }

  // 生成robotTxt
  generateRobotsTxt()

  const categories = formatToGroupTree(linksCollection.collectionRows, settings.CATEGORY_LEVELS, 0)

  return {
    props: {
      meta,
      siteInfo: props.siteInfo,
      settings,
      categories,
      links: linksCollection.collectionRows
    },
    revalidate: parseInt(settings.REVALIDATE)
  }
}

const formatToGroupTree = (links, categoryLevels, level) => {
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
    const sub = formatToGroupTree(group.children, categoryLevels, level + 1)
    if (sub) group.children = sub
  })

  return groups
}

export default Index
