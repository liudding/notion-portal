import * as flowus from './flowus'
import * as notion from './notion'

import CONFIG from '@/config'
import { getDataFromCache, getOrSetFromCache } from '@/lib/cache/cache_manager'
import { delay } from '../utils'

const DATA_SOURCES = {
  flowus,
  notion
}

const ds = DATA_SOURCES[CONFIG.DATASOURCE]

export async function getPageData(pageId, options = { cache: true }) {
  const getData = async () => {
    const start = new Date().getTime()
    const recordMap = await getPageWithRetry(pageId)
    const end = new Date().getTime()
    console.log('[API耗时]', `${end - start}ms`)
    return recordMap
  }

  if (!options.cache) {
    return await getData()
  }

  const cacheKey = 'page_block_' + pageId
  return await getOrSetFromCache(cacheKey, getData)
}

/**
 * 获取 collection 的 schema 及其 rows
 * @param recordMap
 * @param pageId
 * @param options
 * @returns {Promise<{schema: *, pageIds: ([]|*), collectionData: *[], block: *, collection: *}|null|*[]>}
 */
export async function getCollectionData({
  recordMap,
  pageId
}, options = { cache: true }) {
  const getData = async () => {
    if (!recordMap) {
      recordMap = await getPageData(pageId, { cache: options.cache })
      if (!recordMap) {
        return []
      }
    }

    const blockMap = recordMap.block
    const rawMetadata = blockMap[pageId]
    // Check Type Page-Database 和 Inline-Database
    if (
      rawMetadata?.type !== 'collection_view_page' &&
      rawMetadata?.type !== 'collection_view'
    ) {
      console.warn(`pageId "${pageId}" is not a database`)
      return null
    }

    const collection = Object.values(recordMap.collection)[0]
    const collectionId = rawMetadata?.collection_id
    const collectionQuery = recordMap.collection_query
    const collectionView = recordMap.collection_view
    const schema = collection?.schema

    const viewIds = rawMetadata?.view_ids
    const rows = []
    const pageIds = getAllPageIds(collectionQuery, collectionId, collectionView, viewIds)
    if (pageIds?.length === 0) {
      console.error('the collection is empty: ', collectionQuery, collection, collectionView, viewIds, recordMap)
    }

    // console.log(blockMap)

    for (let i = 0; i < pageIds.length; i++) {
      const id = pageIds[i]
      const value = blockMap[id]
      if (!value) {
        continue
      }

      const properties = (await ds.getPageProperties(value, schema, null)) || null
      if (properties) {
        rows.push(properties)
      }
    }

    return {
      blockMap,
      collection,
      schema,
      rows
    }
  }

  if (!options.cache) {
    return await getData()
  }

  const cacheKey = 'collectiondata_' + pageId
  return await getOrSetFromCache(cacheKey, getData)
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
      const pageData = await ds.getPageData(id)
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

export default function getAllPageIds(collectionQuery, collectionId, collectionView, viewIds) {
  if (!collectionQuery && !collectionView) {
    return []
  }
  let pageIds = []
  if (collectionQuery && Object.values(collectionQuery).length > 0) {
    const pageSet = new Set()
    Object.values(collectionQuery[collectionId]).forEach(view => {
      view?.blockIds?.forEach(id => pageSet.add(id)) // group视图
      view?.collection_group_results?.blockIds?.forEach(id => pageSet.add(id)) // table视图
    })
    pageIds = [...pageSet]
    // console.log('PageIds: 从collectionQuery获取', collectionQuery, pageIds.length)
  } else if (viewIds && viewIds.length > 0) {
    const ids = collectionView[viewIds[0]].page_sort
    // console.log('PageIds: 从viewId获取', viewIds)
    for (const id of ids) {
      pageIds.push(id)
    }
  }
  return pageIds
}
