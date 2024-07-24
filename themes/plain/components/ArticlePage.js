import NotionPage from '@/components/NotionPage'

/**
 * 详情文章页
 * @returns {JSX.Element}
 * @constructor
 */
const ArticlePage = ({
  page,
  configs
}) => {
  return (
    <div id="container" className="px-8">
      <NotionPage post={page}></NotionPage>
    </div>
  )
}

export default ArticlePage
