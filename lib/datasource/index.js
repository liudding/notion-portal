import flowus from './flowus'

import CONFIG from '@/config'
import { getDataFromCache, setDataToCache } from '@/lib/cache/cache_manager'
import { delay } from '../../utils'

const DATA_SOURCES = {
  flowus
}

const ds = DATA_SOURCES[CONFIG.DATASOURCE]

export async function getPageData(pageId, slice) {
  const cacheKey = 'page_block_' + pageId
  let pageBlock = await getDataFromCache(cacheKey)
  if (pageBlock) {
    console.log('[命中缓存]:', cacheKey)
    return pageBlock
  }

  const start = new Date().getTime()
  pageBlock = await getPageWithRetry(pageId)
  const end = new Date().getTime()
  console.log('[API耗时]', `${end - start}ms`)

  if (pageBlock) {
    await setDataToCache(cacheKey, pageBlock)
    return pageBlock
  }
  return pageBlock
}

/**
 * 调用接口，失败会重试
 * @param {*} id
 * @param {*} retryAttempts
 */
export async function getPageWithRetry(id, retryAttempts = 3) {
  if (retryAttempts && retryAttempts > 0) {
    console.log('[请求API]', `id:${id}`, retryAttempts < 3 ? `剩余重试次数:${retryAttempts}` : '')
    try {
      const pageData = await ds.getBlocksOfPage(id)
      console.info('[响应成功]:')
      return pageData
    } catch (e) {
      console.warn('[响应异常]:', e)
      await delay(1000)
      const cacheKey = 'page_block_' + id
      const pageBlock = await getDataFromCache(cacheKey)
      if (pageBlock) {
        console.log('[重试缓存]', `id:${id}`)
        return pageBlock
      }
      return await getPageWithRetry(id, retryAttempts - 1)
    }
  } else {
    console.error('[请求失败]:', `id:${id}`)
    return null
  }
}
