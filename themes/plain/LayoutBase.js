import CommonHead from '@/components/CommonHead'
import TopNav from './components/TopNav'
import AsideLeft from './components/AsideLeft'
import { useGlobal } from '@/lib/global'
import SiteFooter from './components/SiteFooter'

/**
 * 基础布局 采用左右两侧布局，移动端使用顶部导航栏
 * @returns {JSX.Element}
 * @constructor
 * @param props
 */
const LayoutBase = (props) => {
  const {
    children,
    headerSlot,
    meta,
    siteInfo,
    configs
  } = props
  const { onLoading } = useGlobal()

  const LoadingCover = <div id="cover-loading"
    className={`${onLoading ? 'z-50 opacity-50' : '-z-10 opacity-0'} pointer-events-none transition-all duration-300`}>
    <div className="w-full h-screen flex justify-center items-center">
      <i className="fa-solid fa-spinner text-2xl text-black dark:text-white animate-spin"> </i>
    </div>
  </div>

  return (<div id="theme-sense">
    <CommonHead meta={meta} />
    <TopNav {...props} />

    <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
      <AsideLeft {...props} />

      <main id="wrapper" className="relative flex flex-col items-center w-full justify-between lg:pl-[16rem]">
        {siteInfo?.pageCover && <div className="w-full mt-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={siteInfo?.pageCover} style={{
            height: '20vh',
            width: '100%'
          }} alt="" className="object-cover rounded" />
        </div>}

        <div id="container-inner" className="w-full relative pb-8">
          {headerSlot && <div> {headerSlot} </div>}
          <div> {onLoading ? LoadingCover : children} </div>
        </div>
        <SiteFooter configs={configs}></SiteFooter>
      </main>
    </div>

  </div>)
}

export default LayoutBase
