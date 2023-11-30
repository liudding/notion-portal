import CONFIG from '@/config'
import { getDataFromCache, getOrSetFromCache, setDataToCache } from '@/lib/cache/cache_manager'
import { idToUuid } from 'notion-utils'
import { deepClone } from '../utils'
import getAllPageIds from './getAllPageIds'
import getPageProperties from './getPageProperties'
import { mapImgUrl } from './mapImage'
import { getNotionBlocksOfPage } from '@/core/notion'

/**
 * 获取博客数据
 * @param {*} pageId
 * @param {*} from
 * @param latestPostCount 截取最新文章数量
 * @returns
 *
 */
export async function getGlobalNotionData({ pageId, from }) {
  // 获取Notion数据
  const notionPageData = deepClone(await getNotionPageData({
    pageId,
    from
  }))

  // delete notionPageData.block
  delete notionPageData.schema
  delete notionPageData.rawMetadata
  delete notionPageData.pageIds
  delete notionPageData.viewIds
  // delete notionPageData.collection
  delete notionPageData.collectionQuery
  delete notionPageData.collectionId
  delete notionPageData.collectionView
  return notionPageData
}

export async function getGlobalNotionCollectionData({
  pageId,
  from
}) {
  const notionPageData = deepClone(await getCollectionDataWithCache({
    pageId,
    from
  }))

  delete notionPageData.block
  // delete notionPageData.schema
  delete notionPageData.rawMetadata
  delete notionPageData.pageIds
  delete notionPageData.viewIds
  delete notionPageData.collection
  delete notionPageData.collectionQuery
  delete notionPageData.collectionId
  delete notionPageData.collectionView

  return notionPageData
}

/**
 * 获取指定notion的collection数据
 * @param pageId
 * @param from 请求来源
 * @returns {Promise<JSX.Element|*|*[]>}
 */
export async function getNotionPageData({
  pageId,
  from
}) {
  // 尝试从缓存获取
  const cacheKey = 'np:page_data:' + pageId
  const data = await getDataFromCache(cacheKey)
  if (data && data.pageIds?.length > 0) {
    console.log('[命中缓存]:', `from:${from}`, `root-page-id:${pageId}`)
    return data
  }
  const pageRecordMap = await getPageDataByNotionAPI({
    pageId,
    from
  })
  // 存入缓存
  if (pageRecordMap) {
    await setDataToCache(cacheKey, pageRecordMap)
  }
  return pageRecordMap
}

export async function getCollectionDataWithCache({
  pageId,
  from
}) {
  const cacheKey = 'np:collection_data:' + pageId
  return await getOrSetFromCache(cacheKey, async () => {
    return await getCollectionData({
      pageId,
      from
    })
  })
}

/**
 * 获取标签选项
 * @param schema
 * @returns {undefined}
 */
function getTagOptions(schema) {
  if (!schema) return {}
  const tagSchema = Object.values(schema).find(e => e.name === CONFIG.NOTION_PROPERTY_NAME.tags)
  return tagSchema?.options || []
}

/**
 * 站点信息
 * @param notionPageData
 * @returns {Promise<{title,description,pageCover,icon}>}
 */
function getSiteInfo({
  collection,
  block
}) {
  const title = collection?.name?.[0][0] || 'Untitled'
  const description = collection?.description ? Object.assign(collection).description[0][0] : ''
  const pageCover = collection?.cover ? (mapImgUrl(collection?.cover, block[idToUuid(CONFIG.WEBSITE_NOTION_PAGE_ID)]?.value)) : ''
  let icon = collection?.icon ? (mapImgUrl(collection?.icon, collection, 'collection')) : null
  // 站点图标不能是emoji情
  const emojiPattern = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g
  if (emojiPattern.test(icon)) {
    icon = null
  }
  return {
    title,
    description,
    pageCover,
    icon
  }
}

/**
 * 获取 collection 的 schema 及其 rows
 * @param pageRecordMap
 * @param pageId
 * @returns {Promise<{schema: *, pageIds: ([]|*), collectionData: *[], block: *, collection: *}|null|*[]>}
 */
async function getCollectionData({
  pageRecordMap,
  pageId
}) {
  if (!pageRecordMap) {
    pageRecordMap = await getNotionBlocksOfPage(pageId)
    if (!pageRecordMap) {
      return []
    }
    pageId = idToUuid(pageId)
  }

  const block = pageRecordMap.block
  const rawMetadata = block[pageId]?.value
  // Check Type Page-Database 和 Inline-Database
  if (
    rawMetadata?.type !== 'collection_view_page' &&
    rawMetadata?.type !== 'collection_view'
  ) {
    console.warn(`pageId "${pageId}" is not a database`)
    return null
  }

  const collection = Object.values(pageRecordMap.collection)[0]?.value
  const collectionId = rawMetadata?.collection_id
  const collectionQuery = pageRecordMap.collection_query
  const collectionView = pageRecordMap.collection_view
  const schema = collection?.schema

  const viewIds = rawMetadata?.view_ids
  const collectionRows = []
  const pageIds = getAllPageIds(collectionQuery, collectionId, collectionView, viewIds)
  if (pageIds?.length === 0) {
    console.error('获取到的 collection 为空，请检查notion模板', collectionQuery, collection, collectionView, viewIds, pageRecordMap)
  }
  for (let i = 0; i < pageIds.length; i++) {
    const id = pageIds[i]
    const value = block[id]?.value
    if (!value) {
      continue
    }
    const properties = (await getPageProperties(id, block, schema, null, getTagOptions(schema))) || null
    if (properties) {
      collectionRows.push(properties)
    }
  }

  return {
    block,
    collection,
    schema,
    collectionRows,
    pageIds
  }
}

/**
 * 调用NotionAPI获取Page数据
 * @returns {Promise<JSX.Element|null|*>}
 */
async function getPageDataByNotionAPI({
  pageId
}) {
  const pageRecordMap = await getNotionBlocksOfPage(pageId)
  if (!pageRecordMap) {
    return []
  }
  pageId = idToUuid(pageId)
  const block = pageRecordMap.block
  const rawMetadata = block[pageId]?.value
  // Check Type Page-Database和Inline-Database
  if (
    rawMetadata?.type !== 'collection_view_page' &&
    rawMetadata?.type !== 'collection_view'
  ) {
    console.warn(`pageId "${pageId}" is not a database`)
    return null
  }

  const collectionId = rawMetadata?.collection_id
  const viewIds = rawMetadata?.view_ids
  const collectionQuery = pageRecordMap.collection_query
  const collectionView = pageRecordMap.collection_view

  const {
    schema,
    collection,
    pageIds
  } = await getCollectionData({
    pageRecordMap,
    pageId
  })

  // 查找所有的Post和Page
  // const allPages = collectionData.filter(post => {
  //   return post && post?.slug &&
  //     (!post?.slug?.startsWith('http')) &&
  //     (post?.status === 'Invisible' || post?.status === 'Published')
  // })

  // const categoryOptions = getAllCategories({
  //   allPages,
  //   categoryOptions: getCategoryOptions(schema)
  // })
  // const tagOptions = getAllTags({
  //   allPages,
  //   tagOptions: getTagOptions(schema)
  // })
  const siteInfo = getSiteInfo({
    collection,
    block
  })

  return {
    siteInfo,
    // allPages,
    collection,
    collectionQuery,
    collectionId,
    collectionView,
    viewIds,
    block,
    schema,
    // tagOptions,
    // categoryOptions,
    rawMetadata,
    pageIds
  }
}
