import ListPage from './components/ListPage'
import LayoutBase from './LayoutBase'

export const LayoutPage = (props) => {
  return <LayoutBase {...props}>

    <ListPage page={props.page} posts={props.posts} postCount={props.postCount} />

  </LayoutBase>
}
