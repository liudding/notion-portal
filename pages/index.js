import CONFIG from '@/config'
import { getGlobalNotionCollectionData } from '@/lib/notion/getNotionData'
import * as ThemeMap from '@/themes'
import { useGlobal } from '@/lib/global'
import { generateRobotsTxt } from '@/lib/robots.txt'
import { getWebsiteConfigs } from '@/lib/datasource'
const Index = props => {
  const { theme } = useGlobal()
  const ThemeComponents = ThemeMap[theme]
  return <ThemeComponents.LayoutIndex {...props} />
}

export async function getStaticProps() {
  // const recordMap = getPageData({ pageId: CONFIG.WEBSITE_NOTION_PAGE_ID })

  const from = 'index'
  // const props = await getGlobalNotionData({ pageId: CONFIG.WEBSITE_NOTION_PAGE_ID, from })

  const linksCollection = await getGlobalNotionCollectionData({ from, pageId: CONFIG.LINKS_NOTION_PAGE_ID })

  const { siteInfo } = getWebsiteConfigs(CONFIG.WEBSITE_NOTION_PAGE_ID)

  const meta = {
    title: `${siteInfo?.title} | ${siteInfo?.description}`,
    description: siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: '',
    type: 'website'
  }

  // 生成robotTxt
  generateRobotsTxt()

  // delete props.allPages

  const categories = formatToGroupTree(linksCollection.collectionData, CONFIG.LINKS_CATEGORY_LEVELS, 0)

  let category1Options
  for (const k in linksCollection.schema) {
    if (linksCollection.schema[k].name === CONFIG.LINKS_CATEGORY_LEVELS[0]) {
      category1Options = linksCollection.schema[k].options
      break
    }
  }
  const orderedCategories = []
  for (const opt of category1Options) {
    const category = categories.find(c => c.title === opt.value)
    if (category) orderedCategories.push(category)
  }

  props.links = linksCollection.collectionData
  props.categories = orderedCategories

  return {
    props: {
      meta,
      ...props,
      links: linksCollection.collectionData
    },
    revalidate: parseInt(CONFIG.NEXT_REVALIDATE_SECOND)
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
