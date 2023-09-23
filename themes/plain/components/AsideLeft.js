import Logo from './Logo'
import { LinkMenuList } from './LinkMenuList'

function AsideLeft(props) {
  return <div className='hidden lg:block fixed z-20 inset-0 top-[1rem] left-[max(0px,calc(50%-45rem))] right-auto w-[15rem] pb-10 pl-5 pr-5 overflow-y-auto'>
    <nav className='lg:text-sm lg:leading-6 relative'>
      <div className='sticky top-0 -ml-0.5 pointer-events-none w-full'>
        <Logo {...props} />
        <div className="w-full h-8 bg-gradient-to-b from-white dark:from-slate-900"></div>
      </div>

      <section className='flex flex-col text-gray-600 my-8'>
        <LinkMenuList {...props} />
      </section>
    </nav>
  </div>
}

export default AsideLeft
