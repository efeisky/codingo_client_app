import React from 'react'
import './../chatCSS/chatAreaTop.css'

export const SchoolChatTop = ({name}) => {
  return (
    <nav className='chatNav'>
      <div className="selectedUsername">
        {name}
      </div>
    </nav>
  )
}
