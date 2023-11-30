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
  const { siteInfo } = await getWebsiteConfigs()
  const meta = {
    title: `${siteInfo?.title} | ${siteInfo?.description}`,
    description: siteInfo?.description || '',
    image: siteInfo?.pageCover || null,
    slug: '',
    type: 'website'
  }

  console.log(siteInfo, '----------')

  const links = await getLinks()

  // 生成robotTxt
  generateRobotsTxt()

  return {
    props: {
      meta,
      categories: links.categories,
      links: links.links
    },
    revalidate: parseInt(CONFIG.NEXT_REVALIDATE_SECOND)
  }
}

export default Index
