import Link from 'next/link'
import LogoIcon from '../icons/logo'

const Logo = props => {
  const { siteInfo } = props
  return (
    <section className="flex bg-white">
      <Link
        href="/"
        className="hover:bg-black hover:text-white duration-500 px-4 py-2 cursor-pointer dark:text-gray-300 dark:border-gray-300 font-black flex items-center text-lg">

        {siteInfo.icon
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={siteInfo.icon} className="object-contain" style={{ height: 30 }} referrerPolicy="no-referrer"
                 alt="logo"/>
          : <LogoIcon/>}
        <div className="ml-2">{siteInfo?.title}</div>
      </Link>
    </section>
  )
}

export default Logo
