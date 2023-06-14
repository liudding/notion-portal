import Link from 'next/link'

const Logo = props => {
  const { siteInfo } = props
  return (
    <section className='flex flex-row-reverse'>
      <Link
        href='/'
        className='hover:bg-black hover:text-white duration-500 px-4 py-2 cursor-pointer dark:text-gray-300 dark:border-gray-300 font-black'>
        {siteInfo?.title}
      </Link>
    </section>
  )
}

export default Logo
