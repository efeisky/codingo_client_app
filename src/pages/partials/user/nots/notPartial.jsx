import React, { useState } from 'react'
import { useEffect } from 'react'
import './notPartial.css'
const NotPartial = ({content,date}) => {
  const [dateValue, setDateValue] = useState({
    lessonName : '',
    lessonID : 0
  })
  useEffect(() => {
    
    const lesson = date.split('-')[0] === '1' ? 'Matematik' : 'Python'
    setDateValue({
      lessonName : lesson,
      lessonID : parseInt(date.split('-')[1]) + 1
    })
  }, [])
  
  return (
    <div className='notArea'>
      <div className="notDate">
        {dateValue.lessonName + ' ' + dateValue.lessonID  + '. Ders'}
      </div>
      <div className="notContent">
        {JSON.parse(content).map((item,index) => (
          <span key={index}>
            <img 
            src='/assest/img/userIcons/nots_star.svg' 
            securitypolicy='restricted'
            alt='Not Görseli'
            crossOrigin='anonymous'
            referrerPolicy='no-referrer'
            />
            {item.content}
          </span>
        ))}
      </div>
    </div>
  )
}

export default NotPartial