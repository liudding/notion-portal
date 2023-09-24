# Notion Portal


## 部署

### 部署到 Vercel

1. 点击按钮  [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fliudding%2Fnotion-portal)， 开始部署
   1. 如果没有 Vercel 账户需要先注册，然后授权访问 Github
   2. 跟随 Vercel 引导，fork 项目，并等待最终部署成功
2. 准备网站数据模版 
   1. 点击打开 Notion 页面：[模版页面](https://dingliu.notion.site/NotionPortal-Template-354428ac80374a9d84a1890225578a0b)
   2. 点击右上角的 "Duplicate" 将模版复制到自己的 Notion 空间
   3. 在 “**NotionPortal**” 页面中设置网站的名称等网站信息
   4. 在 “**我的链接**” 页面中存放你收集的网站
   5. 点击右上角 Share 将页面 Publish to Web
3. 配置网站
   1. 回到你 fork 的 Github 项目
   2. 根据你的需要修改 config.js 中的配置
      1. 网站信息页面的 ID 配置为 `WEBSITE_NOTION_PAGE_ID`
      2. 链接页面的 ID 配置为 `LINKS_NOTION_PAGE_ID`
4. 也可以在 Vercel 环境变量中配置站点
   1. 回到 Vercel，进入【Settings --> Environment Variables】配置环境变量
   2. 将第 2 步中的两个页面 ID 配置到环境变量
5. 完成，可以访问你的导航网站了
