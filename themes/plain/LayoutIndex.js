import ListPage from './components/ListPage'
import LayoutBase from './LayoutBase'

export const LayoutIndex = (props) => {
  return <LayoutBase {...props}>
    <ListPage {...props} />
  </LayoutBase>
}
