import React,{useEffect, useRef, useState} from 'react'
import './../css/ImageQuestion.css'
export const ImageQuestion = ({content, questionLevel,imageSrc, optionA, optionB, optionC, optionD, answer,isSpeaking,isAnswering}) => {
  const optionRefA = useRef(null)
  const optionRefB = useRef(null)
  const optionRefC = useRef(null)
  const optionRefD = useRef(null)
  const [isSelected, setIsSelected] = useState(false)

  const standardizeOptions = () => {
    optionRefA.current.style.border = '.1rem solid #31455c'
    optionRefA.current.style.backgroundColor = '#2d4055'

    optionRefB.current.style.border = '.1rem solid #31455c'
    optionRefB.current.style.backgroundColor = '#2d4055'

    optionRefC.current.style.border = '.1rem solid #31455c'
    optionRefC.current.style.backgroundColor = '#2d4055'
    
    optionRefD.current.style.border = '.1rem solid #31455c'
    optionRefD.current.style.backgroundColor = '#2d4055'
  }

  useEffect(() => {
    optionRefA.current.style.cursor = 'pointer'
    optionRefB.current.style.cursor = 'pointer'
    optionRefC.current.style.cursor = 'pointer'
    optionRefD.current.style.cursor = 'pointer'
    setIsSelected(false)
    standardizeOptions()
  }, [content])
  
  const selectTrueAnswer = () => {
    if(answer === 1){
      optionRefA.current.style.border = '.1rem solid #3ACD7E'
      optionRefA.current.style.backgroundColor = 'rgba(58, 205, 126, 15%)'
    }
    else if(answer === 2){
      optionRefB.current.style.border = '.1rem solid #3ACD7E'
      optionRefB.current.style.backgroundColor = 'rgba(58, 205, 126, 15%)'
    }
    else if(answer === 3){
      optionRefC.current.style.border = '.1rem solid #3ACD7E'
      optionRefC.current.style.backgroundColor = 'rgba(58, 205, 126, 15%)'
    }
    else{
      optionRefD.current.style.border = '.1rem solid #3ACD7E'
      optionRefD.current.style.backgroundColor = 'rgba(58, 205, 126, 15%)'
    }
  }
  
  const selectFalseAnswer = (userSelect) => {
    if(userSelect === 1){
      optionRefA.current.style.border = '.1rem solid #EA4335'
      optionRefA.current.style.backgroundColor = 'rgba(234, 67, 53, 15%)'
    }
    else if(userSelect === 2){
      optionRefB.current.style.border = '.1rem solid #EA4335'
      optionRefB.current.style.backgroundColor = 'rgba(234, 67, 53, 15%)'
    }
    else if(userSelect === 3){
      optionRefC.current.style.border = '.1rem solid #EA4335'
      optionRefC.current.style.backgroundColor = 'rgba(234, 67, 53, 15%)'
    }
    else{
      optionRefD.current.style.border = '.1rem solid #EA4335'
      optionRefD.current.style.backgroundColor = 'rgba(234, 67, 53, 15%)'
    }
  }
  
  const selectedOption = (optionNumber) => {
    if(!isSelected){
      optionRefA.current.style.cursor = 'not-allowed'
      optionRefB.current.style.cursor = 'not-allowed'
      optionRefC.current.style.cursor = 'not-allowed'
      optionRefD.current.style.cursor = 'not-allowed'
      setIsSelected(true)
      if(optionNumber === answer){
        isAnswering(true)
        selectTrueAnswer()
      }
      else{
        isAnswering(false)
        selectFalseAnswer(optionNumber)
        selectTrueAnswer()
      }
    }
  }
  return (
    <div className='imageQuestionArea'>
      <div 
        className={`questionLevel`}
        style={{
          color: questionLevel === 'easy' ? '#3ACD7E' : questionLevel === 'medium' ? '#EAAF03' : questionLevel === 'hard' ? '#EA4335' : '#C92D20'
        }}
      >
        {questionLevel === 'easy' ? 'Kolay Seviye Soru' : questionLevel === 'medium' ? 'Orta Seviye Soru' : questionLevel === 'hard' ? 'Zor Seviye Soru' : 'Çok Zor Seviye Soru'}
      </div>
      <div className="question">
        <div id="content">{content}</div>
        <div id="speaker">
          <img 
            src='/assest/img/lessonIcons/speaker.svg'
            securitypolicy='restricted'
            alt='Soru Okuma Resmi'
            referrerPolicy='no-referrer'
            id='speakerImage'
            loading='eager'
            onClick={()=>isSpeaking(content)}
          />
        </div>
      </div>
      <div className="questionImage">
      <img 
                src={imageSrc}
                alt='Soru Resmi'
                id='questionImage'
              />
      </div>
      
      <div className="options" >
          <div className="optionRow">
            <div 
            className="opt" ref={optionRefA}
            onClick={()=>{selectedOption(1)}}
            ><span>A)</span> <span id="optContent">{optionA}</span></div>
            <div 
            className="opt" ref={optionRefB}
            onClick={()=>{selectedOption(2)}}
            ><span>B)</span> <span id="optContent">{optionB}</span></div>
          </div>
          <div className="optionRow">            
            <div 
            className="opt" ref={optionRefC}
            onClick={()=>{selectedOption(3)}}
            ><span>C)</span> <span id="optContent">{optionC}</span></div>
            <div 
            className="opt" ref={optionRefD}
            onClick={()=>{selectedOption(4)}}
            ><span>D)</span> <span id="optContent">{optionD}</span></div>
          </div>
      </div>
    </div>
  )
}
