import CONFIG from '@/config'
import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import { useGlobal } from '@/lib/global'
import * as ThemeMap from '@/themes'

const Page = props => {
  const { theme } = useGlobal()
  const { siteInfo, configs } = props
  console.log('=========', configs)
  const ThemeComponents = ThemeMap[theme]
  if (!siteInfo) {
    return <></>
  }

  console.log('=========', configs)

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
  return {
    // remove first page, we 're not gonna handle that.
    paths: Array.from({ length: 2 }, (_, i) => ({
      params: { page: '' + (i + 2) }
    })),
    fallback: true
  }
}

export async function getStaticProps({ params: { page } }) {
  const from = `page-${page}`
  const props = await getGlobalNotionData({ pageId: CONFIG.WEBSITE_NOTION_PAGE_ID, from })

  props.page = page

  delete props.allPages

  return {
    props,
    revalidate: parseInt(CONFIG.NEXT_REVALIDATE_SECOND)
  }
}

export default Page
