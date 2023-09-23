import { LinkMenuItemDrop } from './LinkMenuItemDrop'

export const LinkMenuList = (props) => {
  const { categories } = props

  return (<>
    <nav id='nav-pc' className='hidden md:block font-sans text-sm'>
      {categories?.map(link => <LinkMenuItemDrop key={link?.id} link={link} />)}
    </nav>
    <nav id='nav-mobile' className='block md:hidden font-sans text-sm pb-1'>
      {categories?.map(link => <LinkMenuItemDrop key={link?.id} link={link} onHeightChange={props.onHeightChange} />)}
    </nav>
  </>

  )
}
