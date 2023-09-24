import CONFIG from '@/config'
import { NotionAPI } from 'notion-client'
import { getDataFromCache, setDataToCache } from '@/lib/cache/cache_manager'
import { deepClone, delay } from '../utils'

export async function getBlocksOfPage(pageId, slice) {
  const cacheKey = 'page_block_' + pageId
  let pageBlock = await getDataFromCache(cacheKey)
  if (pageBlock) {
    console.log('[命中缓存]:', cacheKey)
    return filterBlocks(pageBlock, slice)
  }

  const start = new Date().getTime()
  pageBlock = await getPageWithRetry(pageId)
  const end = new Date().getTime()
  console.log('[API耗时]', `${end - start}ms`)

  if (pageBlock) {
    await setDataToCache(cacheKey, pageBlock)
    return filterBlocks(pageBlock, slice)
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
      const authToken = CONFIG.NOTION_ACCESS_TOKEN || null
      const api = new NotionAPI({
        authToken,
        userTimeZone: 'Asia/ShangHai'
      })
      const pageData = await api.getPage(id)
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

/**
 * 获取到的blockMap删除不需要的字段
 * @param {*} pageBlock 页面元素
 * @param {*} slice 截取数量
 * @returns
 */
function filterBlocks(pageBlock, slice) {
  const clonePageBlock = deepClone(pageBlock)
  let count = 0

  for (const i in clonePageBlock?.block) {
    const b = clonePageBlock?.block[i]
    if (slice && slice > 0 && count > slice) {
      delete clonePageBlock?.block[i]
      continue
    }
    count++
    // 处理 c++、c#、汇编等语言名字映射
    if (b?.value?.type === 'code') {
      if (b?.value?.properties?.language?.[0][0] === 'C++') {
        b.value.properties.language[0][0] = 'cpp'
      }
      if (b?.value?.properties?.language?.[0][0] === 'C#') {
        b.value.properties.language[0][0] = 'csharp'
      }
      if (b?.value?.properties?.language?.[0][0] === 'Assembly') {
        b.value.properties.language[0][0] = 'asm6502'
      }
    }

    delete b?.role
    delete b?.value?.version
    delete b?.value?.created_by_table
    delete b?.value?.created_by_id
    delete b?.value?.last_edited_by_table
    delete b?.value?.last_edited_by_id
    delete b?.value?.space_id
  }

  return clonePageBlock
}
