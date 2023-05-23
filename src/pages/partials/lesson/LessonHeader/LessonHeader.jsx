import React from 'react'
import './LessonHeader.css'
export const LessonHeader = ({status,lessonSubject,questionCount,activeQuestion}) => {
  return (
    <div className='lessonHeader'>
        <div className="subject">Ders Konusu : <span id='importantValue'>{lessonSubject}</span></div>
        <div className="status">{status === 'information' ? 'Konu Anlatımı' : 'Soru Çözümü'}</div>
        {lessonSubject === 'Pratik Yap' ? (
          <>Çözdükçe Karıştır, Kendini Geliştir</>
        ) : (
          <div className="count"> <span id="importantValue">{activeQuestion}</span> / {questionCount}</div>
        )}
    </div>
  )
}
