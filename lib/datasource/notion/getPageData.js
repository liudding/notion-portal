import CONFIG from '@/config'
import { NotionAPI } from 'notion-client'

export async function getPageData(pageId, slice) {
  const authToken = CONFIG.NOTION_ACCESS_TOKEN || null
  const api = new NotionAPI({
    authToken,
    userTimeZone: 'Asia/ShangHai'
  })
  const pageData = await api.getPage(pageId)
  console.info('[响应成功]:')

  pageData.block = formatBlocks(pageData.block)
  pageData.collection = formatCollections(pageData.collection)

  return pageData
}

function formatBlocks(blocks) {
  const m = {}
  for (const i in blocks) {
    const block = blocks[i].value

    delete block.version
    delete block.created_by_table
    delete block.created_by_id
    delete block.last_edited_by_table
    delete block.last_edited_by_id
    delete block.space_id

    m[block.id] = block
  }

  return m
}

function formatCollections(collections) {
  const m = {}
  for (const i in collections) {
    const c = collections[i].value

    delete c.version
    delete c.created_by_table
    delete c.created_by_id
    delete c.last_edited_by_table
    delete c.last_edited_by_id
    delete c.space_id

    m[c.id] = c
  }

  return m
}
