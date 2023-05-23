import React from 'react'
import { useEffect,useState,useRef } from 'react'
import { StandartQuestion } from '../typesForQuestion/StandartQuestion'
import { ImageQuestion } from '../typesForQuestion/ImageQuestion'
import './../css/AnswerFooter.css'

const QuestionMain = ({questions,nextedQuestion,finishedQuestion}) => {  
    const [activeQuestionNo, setActiveQuestionNo] = useState(0)
    const [result, setResult] = useState({
      true : 0,
      false : 0
    })
    const [activeQuestionInfo, setActiveQuestionInfo] = useState({
        questionID : 0,
        content : '',
        A : '',
        B : '',
        C : '',
        D : '',
        questionLevel : '',
        questionAnswer : 0,
        questionImage : '',
        type : ''
    })
    useEffect(() => {
        setActiveQuestionInfo({...questions[activeQuestionNo]})
    }, [])
    
    const questionSpeaking = (content) => {
      let utterance = new SpeechSynthesisUtterance(content);
      speechSynthesis.speak(utterance)
    }
    const trueRef = useRef(null)
    const falseRef = useRef(null)
    const nextQuestion = () => {
        setActiveQuestionNo(activeQuestionNo + 1);
    };
    useEffect(() => {
      if(activeQuestionNo !== 0){
        trueRef.current.style.bottom = '-17.5vh';
        falseRef.current.style.bottom = '-17.5vh';
        if(questions[activeQuestionNo]){
          setActiveQuestionInfo({...questions[activeQuestionNo]})
          nextedQuestion(activeQuestionNo + 1,activeQuestionInfo.questionID,result)
        }else{
          finishedQuestion(result)
        }
      }
    }, [activeQuestionNo])
    
    const questionAnswering = (status) => {
    
      if (status) {
        trueRef.current.style.display = 'grid';
        falseRef.current.style.display = 'none';
        setTimeout(() => {
          trueRef.current.style.bottom = '0';
        }, 250);

        setResult(prevState => ({
          ...prevState,
          true: prevState.true + 1
        }));  
      } else {
        falseRef.current.style.display = 'grid';
        trueRef.current.style.display = 'none';
        setTimeout(() => {
          falseRef.current.style.bottom = '0';
        }, 250);

        setResult(prevState => ({
          ...prevState,
          false: prevState.false + 1
        }));  
      }
    };    
    
  return (
    <>
    
    {activeQuestionInfo.type === 'standart' ? (
        <StandartQuestion 
        content={activeQuestionInfo.content}
        questionLevel={activeQuestionInfo.questionLevel}
        isSpeaking={questionSpeaking}
        optionA={activeQuestionInfo.A}
        optionB={activeQuestionInfo.B}
        optionC={activeQuestionInfo.C}
        optionD={activeQuestionInfo.D}
        answer={activeQuestionInfo.questionAnswer}
        isAnswering={questionAnswering}
        />

    ) : (
        activeQuestionInfo.type === 'image' ? (
          <ImageQuestion
          content={activeQuestionInfo.content}
          questionLevel={activeQuestionInfo.questionLevel}
          imageSrc={'/assest/img/tablet.png'}
          isSpeaking={questionSpeaking}
          optionA={activeQuestionInfo.A}
          optionB={activeQuestionInfo.B}
          optionC={activeQuestionInfo.C}
          optionD={activeQuestionInfo.D}
          answer={activeQuestionInfo.questionAnswer}
          isAnswering={questionAnswering}
          />
        ) : (
          <></>
        )
    )}

      <div 
      className="trueAnswerFooter answerFooter" 
      ref={trueRef}
      style={{display : 'none'}}
      >
         <img 
            src='/assest/img/lessonIcons/trueAnswer.svg'
            securitypolicy='restricted'
            alt='Doğru Cevap Resmi'
            referrerPolicy='no-referrer'
            id='trueImage'
          />
          <div className="boldText">Doğru Cevap</div>
          <div className="actions">
            <div className="action" onClick={nextQuestion}>Sonraki Soruya Geç</div>
          </div>
      </div>
      <div 
      className="falseAnswerFooter answerFooter" 
      ref={falseRef}
      style={{display : 'none'}}
      >
        <img 
          src='/assest/img/lessonIcons/falseAnswer.svg'
          securitypolicy='restricted'
          alt='Yanlış Cevap Resmi'
          referrerPolicy='no-referrer'
          id='falseImage'
        />
        <div className="boldText">Yanlış Cevap</div>
        <div className="actions">
          <div className="action" onClick={nextQuestion}>Sonraki Soruya Geç</div>
        </div>
      </div>
    </>
  )
}

export default QuestionMain