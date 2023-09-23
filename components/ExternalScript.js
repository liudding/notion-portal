import CONFIG from '@/config'
import { loadExternalResource } from '@/lib/utils'
import { useEffect } from 'react'

/**
 * 自定义引入外部JS 和 CSS
 * @returns
 */
const ExternalScript = () => {
  useEffect(() => {
    // 静态导入本地自定义样式
    loadExternalResource(CONFIG.FONT_AWESOME, 'css')
    loadExternalResource('/css/custom.css', 'css')
    loadExternalResource('/js/custom.js', 'js')

    // 自动添加图片阴影
    if (CONFIG.IMG_SHADOW) {
      loadExternalResource('/css/img-shadow.css', 'css')
    }

    if (CONFIG.CUSTOM_EXTERNAL_JS && CONFIG.CUSTOM_EXTERNAL_JS.length > 0) {
      for (const url of CONFIG.CUSTOM_EXTERNAL_JS) {
        loadExternalResource(url, 'js')
      }
    }
    if (CONFIG.CUSTOM_EXTERNAL_CSS && CONFIG.CUSTOM_EXTERNAL_CSS.length > 0) {
      for (const url of CONFIG.CUSTOM_EXTERNAL_CSS) {
        loadExternalResource(url, 'css')
      }
    }
    // 渲染所有字体
    CONFIG.FONT_URL?.forEach(e => {
      loadExternalResource(e, 'css')
    })
  }, [])

  return null
}

export default ExternalScript
