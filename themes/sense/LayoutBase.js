import CommonHead from '@/components/CommonHead'
import TopNav from './components/TopNav'
import AsideLeft from './components/AsideLeft'
import BLOG from '@/config'
import { useGlobal } from '@/lib/global'
import SiteInfo from './components/SiteInfo'

/**
 * 基础布局 采用左右两侧布局，移动端使用顶部导航栏
 * @param children
 * @param layout
 * @param tags
 * @param meta
 * @param post
 * @param currentSearch
 * @param currentCategory
 * @param currentTag
 * @param categories
 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = (props) => {
  const { children, headerSlot, meta } = props
  const { onLoading } = useGlobal()

  const LoadingCover = <div id='cover-loading' className={`${onLoading ? 'z-50 opacity-50' : '-z-10 opacity-0'} pointer-events-none transition-all duration-300`}>
    <div className='w-full h-screen flex justify-center items-center'>
      <i className="fa-solid fa-spinner text-2xl text-black dark:text-white animate-spin">  </i>
    </div>
  </div>

  return (<div id='theme-sense' >
    <CommonHead meta={meta} />
    <TopNav {...props} />

    <div className={(BLOG.LAYOUT_SIDEBAR_REVERSE ? 'flex-row-reverse' : '') + ' flex'}>
      <AsideLeft {...props} />

      <main id='wrapper' className='relative flex flex-col items-center w-full py-8 justify-between z-10'>
        <div id='container-inner' className='2xl:max-w-6xl md:max-w-4xl w-full relative'>
          <div> {headerSlot} </div>
          <div> {onLoading ? LoadingCover : children} </div>
        </div>
        <SiteInfo></SiteInfo>
      </main>

    </div>

  </div>)
}

export default LayoutBase
