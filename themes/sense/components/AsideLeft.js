import Logo from './Logo'
import SearchInput from './SearchInput'
import { useRouter } from 'next/router'
import { LinkMenuList } from './LinkMenuList'

function AsideLeft(props) {
  const { tagOptions, post, slot, siteInfo } = props
  return <div className='relative dark:bg-hexo-black-gray min-h-screen py-14 border-r border-gray-200 hidden lg:block z-20' >
    <div style={{ width: 260 }}></div>
    <div className='fixed top-0 left-0 px-10 py-14 h-full' style={{ width: 260 }}>
      <Logo {...props} />

      <section className='flex flex-col text-gray-600 my-8'>
        <LinkMenuList {...props} />
      </section>
    </div>
  </div>
}

export default AsideLeft
