import CONFIG from '@/config'
import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'

import 'animate.css'
import '@/styles/globals.css'
import '@/styles/nprogress.css'

// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css'
import '@/styles/notion.css' //  重写部分样式

import { GlobalContextProvider } from '@/lib/global'
import { DebugPanel } from '@/components/DebugPanel'
import { ThemeSwitch } from '@/components/ThemeSwitch'
import ExternalScript from '@/components/ExternalScript'
import smoothscroll from 'smoothscroll-polyfill'

import AOS from 'aos'
import 'aos/dist/aos.css' // You can also use <link> for styles
import { isMobile } from '@/lib/utils'

const Gtag = dynamic(() => import('@/components/Gtag'), { ssr: false })
const Busuanzi = dynamic(() => import('@/components/Busuanzi'), { ssr: false })
const GoogleAdsense = dynamic(() => import('@/components/GoogleAdsense'), {
  ssr: false
})

const MyApp = ({ Component, pageProps }) => {
  // 外部插件
  const externalPlugins = <>
    {JSON.parse(CONFIG.THEME_SWITCH) && <ThemeSwitch />}
    {JSON.parse(CONFIG.DEBUG) && <DebugPanel />}
    {CONFIG.ANALYTICS_GOOGLE_ID && <Gtag />}
    {JSON.parse(CONFIG.ANALYTICS_BUSUANZI_ENABLE) && <Busuanzi />}
    {CONFIG.ADSENSE_GOOGLE_ID && <GoogleAdsense />}
    <ExternalScript />
  </>

  useEffect(() => {
    AOS.init()
    if (isMobile()) {
      smoothscroll.polyfill()
    }
  }, [])

  return (
    <GlobalContextProvider>
      <Component {...pageProps} />
      {externalPlugins}
    </GlobalContextProvider>
  )
}

export default MyApp
