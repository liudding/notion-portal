import { useState } from 'react'
import SideBarDrawer from '@/components/SideBarDrawer'
import Logo from './Logo'
import { LinkMenuList } from './LinkMenuList'

/**
 * 顶部导航
 * @param {*} param0
 * @returns
 */
const TopNav = props => {
  const [isOpen, changeShow] = useState(false)

  const toggleMenuOpen = () => {
    changeShow(!isOpen)
  }

  return (<div id='top-nav' className='sticky top-0  z-40 block lg:hidden'>

    {/* 导航栏 */}
    <div className='relative w-full top-0 z-20 transform duration-500 bg-white dark:bg-black'>
      <div className='w-full flex justify-between items-center p-4 '>
        <div className='flex flex-none flex-grow-0'>
          <Logo {...props} />
        </div>
        <div className='flex'>
        </div>

        <div className='mr-1 flex justify-end items-center text-sm space-x-4 font-serif dark:text-gray-200'>
          <div onClick={toggleMenuOpen} className='cursor-pointer'>
            {isOpen ? <i className='fas fa-times' /> : <i className='fas fa-bars' />}
          </div>
        </div>
      </div>
    </div>

    <SideBarDrawer isOpen={isOpen} onClosed={() => { changeShow(false) }}>
      <nav className='lg:text-sm lg:leading-6 relative px-3'>
        <section className='flex flex-col text-gray-600 my-8'>
          <LinkMenuList {...props} />
        </section>
      </nav>
    </SideBarDrawer>

  </div>)
}

export default TopNav
