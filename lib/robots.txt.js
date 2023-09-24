import fs from 'fs'
import { getGlobalSettings } from '@/core/settings'

export async function generateRobotsTxt() {
  const settings = await getGlobalSettings()
  const content = `
    # *
    User-agent: *
    Allow: /
  
    # Host
    Host: ${settings.WEBSITE_URL}
  
    # Sitemaps
    Sitemap: ${settings.WEBSITE_URL}/sitemap.xml
  
    `
  try {
    fs.mkdirSync('./public', { recursive: true })
    fs.writeFileSync('./public/robots.txt', content)
  } catch (error) {
    // 在vercel运行环境是只读的，这里会报错；
    // 但在vercel编译阶段、或VPS等其他平台这行代码会成功执行
  }
}
