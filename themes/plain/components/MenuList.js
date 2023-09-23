import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import { MenuItemDrop } from './MenuItemDrop'
import { MenuItemCollapse } from './MenuItemCollapse'

export const MenuList = (props) => {
  const { customNav } = props
  const { locale } = useGlobal()

  let links = [
    { name: locale.NAV.INDEX, to: '/' || '/', show: true },
    { name: locale.COMMON.CATEGORY, to: '/category', show: CONFIG.MENU_CATEGORY },
    { name: locale.COMMON.TAGS, to: '/tag', show: CONFIG.MENU_TAG },
    { name: locale.NAV.ARCHIVE, to: '/archive', show: CONFIG.MENU_ARCHIVE },
    { name: locale.NAV.SEARCH, to: '/search', show: CONFIG.MENU_SEARCH }
  ]

  if (customNav) {
    links = links.concat(customNav)
  }

  if (!links || links.length === 0) {
    return null
  }

  return (<>
    <nav id='nav-pc' className='hidden md:block font-sans text-sm'>
      {links?.map(link => <MenuItemDrop key={link?.id} link={link} />)}
    </nav>
    <nav id='nav-mobile' className='block md:hidden font-sans text-sm pb-1'>
      {links?.map(link => <MenuItemCollapse key={link?.id} link={link} onHeightChange={props.onHeightChange} />)}
    </nav>
  </>

  )
}
