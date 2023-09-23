// pages/sitemap.xml.js
import { getServerSideSitemap } from 'next-sitemap'
import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import CONFIG from '@/config'

export const getServerSideProps = async (ctx) => {
  const { allPages } = await getGlobalNotionData({ from: 'rss' })
  const defaultFields = [
    {
      loc: `${CONFIG.LINK}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.7'
    }, {
      loc: `${CONFIG.LINK}/archive`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.7'
    }, {
      loc: `${CONFIG.LINK}/category`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.7'
    }, {
      loc: `${CONFIG.LINK}/search`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.7'
    }, {
      loc: `${CONFIG.LINK}/tag`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.7'
    }
  ]
  const postFields = allPages?.filter(p => p.status === CONFIG.NOTION_PROPERTY_NAME.status_publish)?.map(post => {
    return {
      loc: `${CONFIG.LINK}/${post.slug}`,
      lastmod: new Date(post?.date?.start_date || post?.createdTime).toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.7'
    }
  })
  const fields = defaultFields.concat(postFields)

  // 缓存
  ctx.res.setHeader(
    'Cache-Control',
    'public, max-age=3600, stale-while-revalidate=59'
  )

  return getServerSideSitemap(ctx, fields)
}

export default () => { }
