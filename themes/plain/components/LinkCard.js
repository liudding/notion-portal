import Image from 'next/image'
import Link from 'next/link'
import LinkTag from './LinkTag'

const LinkIcon = ({ link }) => {
  if (link.pageIcon) {
    if (link.pageIcon.startsWith('http') || link.pageIcon.startsWith('data:')) {
      return <Image src={link.pageIcon} width={60} height={60} className='object-contain' referrerPolicy="no-referrer" alt="logo"></Image>
    }

    return <span className=''>{link.pageIcon}</span>
  }

  if (link.icon_file) {
    return <Image src={link.icon_file.url} width={60} height={60} className='object-contain' referrerPolicy="no-referrer" alt=""></Image>
  }

  if (link.icon_url) {
    if (link.icon_url.startsWith('//')) {
      link.icon_url = 'https:' + link.icon_url
    }
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={link.icon_url} className='object-contain' style={{ height: 60 }} referrerPolicy="no-referrer" />
  }

  return <div className='rounded-full text-xl font-bold text-gray-600 text-center flex items-center justify-center bg-gray-100' style={{ width: 60, height: 60 }}><div>{link.title}</div></div>
}

const LinkCard = ({ link }) => {
  return (
    <Link href={link.url || ''} target='_blank' className='group relative bg-white rounded-md p-5 bg-white hover:bg-gray-50' style={{ breakInside: 'avoid', boxShadow: '0 0px 6px 3px rgb(0 0 0 / 0.1), 0 0px 0px -1px rgb(0 0 0 / 0.1)' }} key={link.id}>
      <div className='p-0' style={{ height: 60 }}>
        <LinkIcon link={link}></LinkIcon>
      </div>

      <div className='mt-3 p-0 rounded-md'>
        <div className='line-clamp-1'>{link.title}</div>

        <div className='mt-2 flex'>
          {(link.tagItems || []).map(tag => <LinkTag key={tag.name} tag={tag}></LinkTag>)}
        </div>

        <div className='mt-2 px-0 h-[2rem]'>
          <div className='line-clamp-2 text-xs text-gray-400'>{link.desc}</div>
        </div>
      </div>
    </Link>
  )
}

export default LinkCard
