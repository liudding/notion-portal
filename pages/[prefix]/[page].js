import { useGlobal } from '@/lib/global'
import * as ThemeMap from '@/themes'
import { getLinks, getWebsiteConfigs } from '@/lib/datasource/website'
import { getPageData } from '@/lib/datasource'

const Page = props => {
  const { theme } = useGlobal()
  const { siteInfo, meta } = props
  const ThemeComponents = ThemeMap[theme]
  if (!siteInfo) {
    return <></>
  }

  const metadata = {
    ...meta,
    title: `${props.page} | ${siteInfo?.title}`,
    description: meta?.description || siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: 'page/' + props.page,
    type: 'website'
  }
  return <ThemeComponents.LayoutPage {...props} meta={metadata} />
}

export async function getStaticPaths(props) {
  const { configs } = await getWebsiteConfigs()
  const { links } = await getLinks()

  return {
    paths: links.map(i => ({
      params: { page: i.id, prefix: configs.DETAIL_PAGE_URL_PREFIX || 'p' }
    })),
    fallback: true
  }
}

export async function getStaticProps({ params }) {
  const { siteInfo, configs } = await getWebsiteConfigs()
  const page = await getPageData(params.page)

  return {
    props: { siteInfo, configs, params, page: page },
    revalidate: parseInt(configs.REVALIDATE)
  }
}

export default Page
