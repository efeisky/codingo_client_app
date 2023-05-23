import React from 'react'
import DOMPurify from 'dompurify'
import './LessonInformation.css'

export const LessonInformation = ({infoVideo,infoTitle,infoXML,changeActiveMode}) => {
  const sanitizedHTML = DOMPurify.sanitize(infoXML);
  return (
    <div className='information'>
      {infoVideo ? (
        <>
        <iframe 
        width="960" 
        height="540" 
        src={infoVideo}
        title={infoTitle}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowFullScreen></iframe>
        
        <div className="textSubject">{infoTitle}</div>
        <div className="textContent" dangerouslySetInnerHTML={{ __html: sanitizedHTML }}></div>
        <button className="goQuestions" onClick={()=>{changeActiveMode()}}>Sorulara Başla</button>
        </>

      ) : (
        <></>
      )}
    </div>
  )
}
