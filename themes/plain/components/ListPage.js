import * as Scroll from 'react-scroll'
import ListEmpty from './ListEmpty'
import LinkCard from './LinkCard'

/**
 * 列表页
 * @returns {JSX.Element}
 * @constructor
 */
const ListPage = ({
  links = [],
  categories,
  configs
}) => {
  if (!links || links.length === 0) {
    return <ListEmpty />
  }

  return (
    <div id="container" className="px-8">
      {categories?.map(category => {
        return (
          <Scroll.Element name={category.id} key={category.id}>
            {category.children.map((sub) => (<Scroll.Element name={sub.id} key={sub.id}>
              <div className="py-4 mt-8 pl-2 font-bold text-gray-500">{sub.title}</div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:grid-cols-4 xl:gap-x-8">
                {sub.children.map(item => (
                  <LinkCard link={item} configs={configs} key={item.id}></LinkCard>
                ))}
              </div>
            </Scroll.Element>))}
          </Scroll.Element>
        )
      })}
    </div>
  )
}

export default ListPage
