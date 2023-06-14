import Image from 'next/image'
import Link from 'next/link'

const LinkCard = ({ link }) => {
  return (
    <Link href={link.URL || ''} target='_blank' className='grid-item  bg-white rounded-md p-1 bg-white' style={{ breakInside: 'avoid', height: 180, boxShadow: '0 0px 6px 3px rgb(0 0 0 / 0.1), 0 0px 0px -1px rgb(0 0 0 / 0.1)' }} key={link.id}>
      <div className='p-1' style={{ height: 60 }}>
        {link.icon ? <Image src={link.icon} width={60} height={60}></Image> : <div></div>}
      </div>

      <div className='mt-2 p-2 rounded-md' style={{ height: 80 }}>
        <div className='line-clamp-1'>{link.Name}</div>

        <div className='mt-2'>
          {(link.tags || []).map(tag => <span className='text-xs text-gray-400 px-2 py-1 mr-2 rounded-full border' key={tag}>{tag}</span>)}
        </div>
      </div>

      <div style={{ height: 40 }} className='px-2'>
        <div className='line-clamp-1 text-xs text-gray-400'>{link.desc}</div>
      </div>

    </Link>
  )
}

export default LinkCard
