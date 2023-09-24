import CONFIG from '@/config'
import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import { useGlobal } from '@/lib/global'
import * as ThemeMap from '@/themes'
import { getGlobalSettings } from '@/core/settings'

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
  return <ThemeComponents.LayoutPage {...props} meta={meta}/>
}

export async function getStaticPaths() {
  return {
    // remove first page, we 're not gonna handle that.
    paths: Array.from({ length: 1 }, (_, i) => ({
      params: { page: '' + (i + 2) }
    })),
    fallback: true
  }
}

export async function getStaticProps({ params: { page } }) {
  const from = `page-${page}`
  const props = await getGlobalNotionData({
    pageId: CONFIG.WEBSITE_NOTION_PAGE_ID,
    from
  })

  const settings = await getGlobalSettings()

  props.page = page

  return {
    props,
    revalidate: parseInt(settings.REVALIDATE)
  }
}

export default Page
