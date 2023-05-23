import React from 'react'

import './../chatCSS/chatAreaTop.css'

export const ChatAreaTop = ({username,mode}) => {
  return (
    <nav className='chatNav'>
      <div className="selectedUsername">
        @{username} ile yaptığın sohbet
      </div>
    </nav>
  )
}
