import CONFIG from '@/config'
import Head from 'next/head'

const CommonHead = ({ meta, children }) => {
  meta = Object.assign({}, meta)

  let url = CONFIG?.PATH?.length ? `${CONFIG.LINK}/${CONFIG.SUB_PATH}` : CONFIG.LINK
  url = `${url}/${meta.slug}`
  const image = meta.image

  const title = meta.title
  const type = meta.type || 'website'

  delete meta.title
  delete meta.type

  const lang = CONFIG.LANG.replace('-', '_') // Facebook OpenGraph 要 zh_CN 這樣的格式才抓得到語言
  const category = meta?.category || meta?.keywords || '' // section 主要是像是 category 這樣的分類，Facebook 用這個來抓連結的分類

  const ms = []
  for (const k in meta) {
    ms.push({
      name: k,
      content: meta[k]
    })
  }

  return (
    <Head>
      <title>{title}</title>
      <meta name="theme-color" content={CONFIG.BACKGROUND_DARK} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, user-scalable=no"
      />
      <meta name="robots" content="follow, index" />
      <meta charSet="UTF-8" />

      {ms.map(i => <meta name={i.name} content={i.content} key={i.name} />)}

      <meta property="og:locale" content={lang} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={meta?.description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={title} />
      <meta property="og:type" content={type} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:description" content={meta?.description} />
      <meta name="twitter:title" content={title} />

      {CONFIG.COMMENT_WEBMENTION && CONFIG.COMMENT_WEBMENTION.ENABLE && (
        <>
          <link rel="webmention" href={`https://webmention.io/${CONFIG.COMMENT_WEBMENTION.HOSTNAME}/webmention`} />
          <link rel="pingback" href={`https://webmention.io/${CONFIG.COMMENT_WEBMENTION.HOSTNAME}/xmlrpc`} />
        </>
      )}
      {CONFIG.COMMENT_WEBMENTION && CONFIG.COMMENT_WEBMENTION.ENABLE && CONFIG.COMMENT_WEBMENTION.AUTH !== '' && (
        <link href={CONFIG.COMMENT_WEBMENTION.AUTH} rel="me" />
      )}

      {JSON.parse(CONFIG.ANALYTICS_BUSUANZI_ENABLE) && <meta name="referrer" content="no-referrer-when-downgrade" />}
      {meta?.type === 'Post' && (
        <>
          <meta
            property="article:published_time"
            content={meta.date || meta.createdTime}
          />
          <meta property="article:author" content={CONFIG.AUTHOR} />
          <meta property="article:section" content={category} />
          {/* <meta property="article:publisher" content={CONFIG.FACEBOOK_PAGE} /> */}
        </>
      )}
      {children}
    </Head>
  )
}

export default CommonHead
