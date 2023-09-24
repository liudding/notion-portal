// pages/sitemap.xml.js
import { getServerSideSitemap } from 'next-sitemap'
import { getGlobalSettings } from '@/core/settings'

export const getServerSideProps = async (ctx) => {
  const settings = await getGlobalSettings()
  const fields = [
    {
      loc: `${settings.WEBSITE_URL}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.7'
    }
  ]

  // 缓存
  ctx.res.setHeader(
    'Cache-Control',
    'public, max-age=3600, stale-while-revalidate=59'
  )

  return getServerSideSitemap(ctx, fields)
}

export default () => {
}
