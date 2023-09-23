import 'gitalk/dist/gitalk.css'
import CONFIG from '@/config'
import GitalkComponent from 'gitalk/dist/gitalk-component'

const Gitalk = ({ frontMatter }) => {
  return <GitalkComponent options={{
    id: frontMatter.id,
    title: frontMatter.title,
    clientID: CONFIG.COMMENT_GITALK_CLIENT_ID,
    clientSecret: CONFIG.COMMENT_GITALK_CLIENT_SECRET,
    repo: CONFIG.COMMENT_GITALK_REPO,
    owner: CONFIG.COMMENT_GITALK_OWNER,
    admin: CONFIG.COMMENT_GITALK_ADMIN.split(','),
    distractionFreeMode: JSON.parse(CONFIG.COMMENT_GITALK_DISTRACTION_FREE_MODE)
  }} />
}

export default Gitalk
