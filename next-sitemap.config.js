const CONFIG = require('./config')

module.exports = {
  siteUrl: CONFIG.LINK,
  changefreq: 'daily',
  priority: 0.7,
  generateRobotsTxt: true,
  sitemapSize: 7000
  // ...other options
  // https://github.com/iamvishnusankar/next-sitemap#configuration-options
}
