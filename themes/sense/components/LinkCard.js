import Image from 'next/image'
import Link from 'next/link'
import LinkTag from './LinkTag'

const LinkIcon = ({ link }) => {
  if (link.pageIcon) {
    if (link.pageIcon.startsWith('http') || link.pageIcon.startsWith('data:')) {
      return <Image src={link.pageIcon} width={60} height={60}></Image>
    }

    return <span className=''>{link.pageIcon}</span>
  }

  if (link.iconfile) {
    return <Image src={link.iconfile.url} width={60} height={60}></Image>
  }

  if (link.iconlink) {
    return <Image src={link.iconlink} width={60} height={60}></Image>
  }

  return null
}

const LinkCard = ({ link }) => {
  if (link.Name && link.Name.indexOf('Vercel') >= 0) {
    console.log(link)
  }

  return (
    <Link href={link.URL || ''} target='_blank' className='grid-item  bg-white rounded-md p-2 bg-white' style={{ breakInside: 'avoid', height: 180, boxShadow: '0 0px 6px 3px rgb(0 0 0 / 0.1), 0 0px 0px -1px rgb(0 0 0 / 0.1)' }} key={link.id}>
      <div className='p-1' style={{ height: 60 }}>
        <LinkIcon link={link}></LinkIcon>
      </div>

      <div className='mt-2 p-2 rounded-md' style={{ height: 80 }}>
        <div className='line-clamp-1'>{link.Name}</div>

        <div className='mt-2 flex'>
          {(link.tagItems || []).map(tag => <LinkTag key={tag.name} tag={tag}></LinkTag>)}
        </div>
      </div>

      <div style={{ height: 40 }} className='px-2'>
        <div className='line-clamp-1 text-xs text-gray-400'>{link.desc}</div>
      </div>

    </Link>
  )
}

export default LinkCard
