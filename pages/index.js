import CONFIG from '@/config'

import * as ThemeMap from '@/themes'
import { useGlobal } from '@/lib/global'
import { generateRobotsTxt } from '@/lib/robots.txt'
import { getLinks, getWebsiteConfigs } from '@/lib/datasource/website'
const Index = props => {
  const { theme } = useGlobal()
  const ThemeComponents = ThemeMap[theme]
  return <ThemeComponents.LayoutIndex {...props} />
}

export async function getStaticProps() {
  const {
    siteInfo,
    meta,
    configs
  } = await getWebsiteConfigs()

  meta.title = `${siteInfo?.title} | ${siteInfo?.description}`
  meta.description = meta.description || siteInfo?.description || ''
  meta.image = siteInfo?.pageCover || null
  meta.type = 'website'

  const links = await getLinks()

  // 生成robotTxt
  generateRobotsTxt()

  return {
    props: {
      configs,
      meta,

      siteInfo,
      categories: links.categories,
      links: links.links
    },
    revalidate: parseInt(CONFIG.NEXT_REVALIDATE_SECOND)
  }
}

export default Index
