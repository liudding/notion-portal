function SiteFooter({ configs }) {
  const d = new Date()
  const currentYear = d.getFullYear()
  const copyrightDate = (function () {
    if (configs.COPYRIGHT_SINCE && configs.COPYRIGHT_SINCE !== currentYear) {
      return configs.COPYRIGHT_SINCE + '-' + currentYear
    }
    return currentYear
  })()

  return (
    <footer className='w-full px-8 text-sm leading-6 mt-12'>
      <div className='pt-10 pb-28 border-t border-slate-200 sm:flex justify-between text-slate-500 dark:border-slate-200/5'>
        <div>Copyright © {copyrightDate} {configs.COPYRIGHT || ''}</div>
        <div>
          {configs.BEI_AN && <> <a href='https://beian.miit.gov.cn/' className='mr-2'>{configs.BEI_AN}</a></>}
        </div>
      </div>
    </footer>
  )
}
export default SiteFooter
