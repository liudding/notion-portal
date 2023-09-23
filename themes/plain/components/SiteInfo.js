import CONFIG from '@/config'

function SiteInfo({ title }) {
  const d = new Date()
  const currentYear = d.getFullYear()
  const copyrightDate = (function () {
    if (Number.isInteger(CONFIG.COPYRIGHT_SINCE) && CONFIG.COPYRIGHT_SINCE < currentYear) {
      return CONFIG.COPYRIGHT_SINCE + '-' + currentYear
    }
    return currentYear
  })()

  return (
    <footer className='w-full px-8 text-sm leading-6 mt-12'>
      <div className='pt-10 pb-28 border-t border-slate-200 sm:flex justify-between text-slate-500 dark:border-slate-200/5'>
        <div>Copyright © {copyrightDate}</div>
        <div>
          {CONFIG.BEI_AN && <> <a href='https://beian.miit.gov.cn/' className='mr-2'>{CONFIG.BEI_AN}</a></>}
        </div>
      </div>
    </footer>
  )
}
export default SiteInfo
