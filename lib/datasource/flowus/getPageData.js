import { deepClone } from '../../utils'
import axios from 'axios'

const BASE_URL = 'https://flowus.cn/api/docs/'

export async function getPageData(pageId) {
  const res = await axios.get(`${BASE_URL}${pageId}`)
  const pageData = res.data.data
  console.info('[响应成功]:')
  pageData.block = formatBlocks(pageData.blocks)

  pageData.collection = {}
  pageData.collection[pageId] = formatCollection(pageData.blocks[pageId])

  delete pageData.blocks

  return pageData
}

function formatBlocks(blocks) {
  const m = {}
  for (const i in blocks) {
    const block = blocks[i]

    const b = {
      id: block.uuid,
      type: BlockTypeMap[block.type],
      alive: block.status,
      properties: {
        title: block.data.segments
      },
      format: {
        page_cover: block.data.cover,
        page_icon: block.data.icon.value
      },
      parent_id: block.parentId,
      parent_table: 'block',
      content: block.subNodes,
      created_time: block.createdAt,
      updated_time: block.updatedAt
    }

    if (block.data.collectionProperties) {
      for (const p in block.data.collectionProperties) {
        b[p] = block.data.collectionProperties[p]
      }
    }

    m[block.uuid] = b
  }

  return m
}

function formatBlock(block) {

}

function formatCollection(block) {
  if (BlockTypeMap[block.type] !== 'collection_view_page') {
    return
  }

  return {
    id: block.uuid,
    name: block.data.segments,
    schema: block.data.schema,
    format: {
      collection_page_properties: block.data.collectionPageProperties
    },
    parent_id: block.uuid,
    parent_table: 'block'
  }
}

const BlockTypeMap = {
  0: 'page',
  1: 'text',
  2: 'alias',
  3: 'todo',
  4: 'bulleted_list',
  5: 'numbered_list',
  6: 'toggle',
  7: 'header',
  8: 'image',
  9: 'divider',
  10: 'column_list',
  11: 'column',
  12: 'quote',
  13: 'mark',
  14: 'file',
  15: 'folder',
  16: '',
  17: 'collection',
  18: 'collection_view_page',
  19: 'collection_view',
  20: 'embed',
  21: 'bookmark',
  22: 'copy_indicator',
  23: 'equation',
  24: 'summary_page',
  25: 'code',
  27: 'table',
  28: 'table_row'

}

const TextTypeMap = {
  0: 'text',
  1: 'date',
  2: 'emoji',
  3: 'url',
  4: 'alias',
  5: 'code',
  6: 'datetime',
  7: 'user',
  8: 'equation',
  9: 'mention'
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

    delete b?.role
    delete b?.version
    delete b?.createdBy
    delete b?.updatedBy
    delete b?.spaceId
  }

  return clonePageBlock
}
