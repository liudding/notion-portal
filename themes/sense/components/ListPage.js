import Link from 'next/link'
import * as Scroll from 'react-scroll'
import ListEmpty from './ListEmpty'
import LinkCard from './LinkCard'

/**
 * 列表页
 * @param page 当前页
 * @param posts 所有文章
 * @param tags 所有标签
 * @returns {JSX.Element}
 * @constructor
 */
const ListPage = ({ links = [], categories }) => {
  if (!links || links.length === 0) {
    return <ListEmpty />
  }

  return (
    <div>
      <div id="container" className=''>
        {categories?.map(category => {
          return (
            <Scroll.Element name={category.id} key={category.id}>
              {category.children.map((sub) => (<Scroll.Element name={sub.id} key={sub.id} >
                <div className='py-4 mt-8 pl-2 font-bold text-gray-500'>{sub.title}</div>
                <div className='grid gap-8 grid-cols-5'>
                  {sub.children.map(item => (
                    <LinkCard link={item} key={item.id}></LinkCard>
                  ))}
                </div>
              </Scroll.Element>))}
            </Scroll.Element>
          )
        })}
      </div>
    </div >
  )
}

export default ListPage
