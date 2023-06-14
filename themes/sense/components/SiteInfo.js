import BLOG from '@/blog.config'

function SiteInfo({ title }) {
  const d = new Date()
  const currentYear = d.getFullYear()
  const copyrightDate = (function () {
    if (Number.isInteger(BLOG.SINCE) && BLOG.SINCE < currentYear) {
      return BLOG.SINCE + '-' + currentYear
    }
    return currentYear
  })()

  return (
    <footer
      className='relative leading-6 justify-start w-full text-gray-400 text-xs font-sans flex items-center justify-around'
    >
      <div>
        {BLOG.BEI_AN && <> <a href='https://beian.miit.gov.cn/' className='mr-2'>{BLOG.BEI_AN}</a></>}
      </div>
    </footer>
  )
}
export default SiteInfo
