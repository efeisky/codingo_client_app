import React, {useState} from 'react'
import './chatCSS/chatMode.css'

export const ChatMode = ({onModeChange}) => {

  return (
    <div className='modeArea'>
        <div 
        className="schoolMode"
        onClick={()=>{
          onModeChange('school')
        }}
        >Okul</div>
        <div 
        className="personalMode"
        onClick={()=>{
          onModeChange('personel')
        }}
        >Kişisel</div>
    </div>
  )
}
