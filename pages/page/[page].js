import CONFIG from '@/config'
import { getGlobalNotionData, getNotionData } from '@/lib/notion/getNotionData'
import { useGlobal } from '@/lib/global'
import * as ThemeMap from '@/themes'

const Page = props => {
  const { theme } = useGlobal()
  const { siteInfo } = props
  const ThemeComponents = ThemeMap[theme]
  if (!siteInfo) {
    return <></>
  }
  const meta = {
    title: `${props.page} | Page | ${siteInfo?.title}`,
    description: siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: 'page/' + props.page,
    type: 'website'
  }
  return <ThemeComponents.LayoutPage {...props} meta={meta} />
}

export async function getStaticPaths() {
  const from = 'page-paths'
  const { postCount } = await getGlobalNotionData({ from })
  const totalPages = Math.ceil(postCount / CONFIG.POSTS_PER_PAGE)
  return {
    // remove first page, we 're not gonna handle that.
    paths: Array.from({ length: totalPages - 1 }, (_, i) => ({
      params: { page: '' + (i + 2) }
    })),
    fallback: true
  }
}

export async function getStaticProps({ params: { page } }) {
  const from = `page-${page}`
  const props = await getGlobalNotionData({ from })

  props.page = page

  delete props.allPages

  const linksCollection = await getNotionData({ from, pageId: CONFIG.LINKS_NOTION_PAGE_ID })
  console.log('=========', CONFIG.LINKS_CATEGORY_LEVELS)
  const categories = formatToGroupTree(linksCollection.collectionData, CONFIG.LINKS_CATEGORY_LEVELS, 0)
  props.links = linksCollection.collectionData
  props.categories = categories

  console.log(categories, '=========', CONFIG.LINKS_CATEGORY_LEVELS)

  return {
    props,
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

export default Page
