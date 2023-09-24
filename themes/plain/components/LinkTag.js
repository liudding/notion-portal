import React from 'react'

const tagColors = {
  gray: 'rgba(120, 119, 116, 1)',
  brown: 'rgba(159, 107, 83, 1)',
  orange: 'rgba(217, 115, 13, 1)',
  yellow: 'rgba(203, 145, 47, 1)',
  green: 'rgba(68, 131, 97, 1)',
  purple: 'rgba(144, 101, 176, 1)',
  pink: 'rgba(193, 76, 138, 1)',
  red: 'rgba(212, 76, 71, 1)'
}

const LinkTag = ({ tag }) => {
  const color = tagColors[tag.color]

  return (
    <div className='text-xs text-white text-center px-2 py-1 mr-2 rounded-full' style={{ background: color, minWidth: 20, fontSize: 10, lineHeight: '12px' }}>
      {tag.name}
    </div>
  )
}

export default LinkTag
