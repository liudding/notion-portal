function SiteFooter({ copyrightSince, beian }) {
  const d = new Date()
  const currentYear = d.getFullYear()
  const copyrightDate = (function () {
    if (Number.isInteger(copyrightSince) && copyrightSince < currentYear) {
      return copyrightSince + '-' + currentYear
    }
    return currentYear
  })()

  return (
    <footer className='w-full px-8 text-sm leading-6 mt-12'>
      <div className='pt-10 pb-28 border-t border-slate-200 sm:flex justify-between text-slate-500 dark:border-slate-200/5'>
        <div>Copyright © {copyrightDate}</div>
        <div>
          {beian && <> <a href='https://beian.miit.gov.cn/' className='mr-2'>{beian}</a></>}
        </div>
      </div>
    </footer>
  )
}
export default SiteFooter
