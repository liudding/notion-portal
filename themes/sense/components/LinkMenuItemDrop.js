import * as Scroll from 'react-scroll'
import { useState } from 'react'

export const LinkMenuItemDrop = ({ link }) => {
  const [show, changeShow] = useState(false)
  link.subMenus = link.subMenus || link.children
  const hasSubMenu = link?.subMenus?.length > 0

  return <li
    className='relative py-1 duration-500 justify-between text-gray-500 dark:text-gray-300 hover:text-black cursor-pointer text-left list-none'>

    <Scroll.Link onMouseUp={() => changeShow(!show)} to={link?.id} spy={true} smooth={true} offset={-50} duration={500} className='w-full my-auto items-center rounded p-2 px-4 hover:bg-gray-100 justify-between flex select-none' >
      <div><div className={`${link.icon} text-center w-4 mr-2`} />{link.title}</div>
      {link.slot}
      {hasSubMenu &&
        <div className='text-right'>
          <i className={`fas fa-chevron-right duration-500 transition-all ${show ? ' rotate-90' : ''}`}></i>
        </div>
      }

    </Scroll.Link>

    {/* 子菜单 */}
    {hasSubMenu &&
      <ul className={`${show ? 'block visible opacity-100' : 'hidden invisible opacity-0'} py-1 w-full border-gray-100 list-none dark:border-gray-800 transition-all duration-300`}>
        {link?.subMenus?.map(sLink => {
          return <li key={sLink.id}>
            <Scroll.Link to={sLink.id} spy={true} smooth={true} offset={-50} duration={500} className='my-auto p-2 px-4 select-none rounded items-center justify-start flex text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 tracking-widest transition-all duration-200 dark:border-gray-800 '>
              {sLink.icon && <i className={`${sLink.icon} w-4 text-center `} />}
              <div className={'ml-4 whitespace-nowrap'}>{sLink.title || sLink.title}</div>
              {sLink.slot}
            </Scroll.Link>
          </li>
        })}
      </ul>
    }

  </li>
}
