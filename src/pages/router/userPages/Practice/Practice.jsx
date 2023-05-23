import React, { useState,useEffect } from 'react'
import { decrypt } from '../getUserPages';
import axios from 'axios'
import './Practice.css'
import Loader from '../../../partials/PartialLoader/Loader';
import {Link} from 'react-router-dom'
import { LessonHeader } from '../../../partials/lesson/LessonHeader/LessonHeader';
import QuestionMain from '../../../partials/lesson/question/Main/QuestionMain';

const Practice = () => {
    const [isUploading, setIsUploading] = useState(true)
    const [isNoQuestion, setIsNoQuestion] = useState(false)
    let isAuth=false;
    let secretKey,plainUsername;
    try {
      const localData = JSON.parse(window.localStorage.getItem('token_profile'));
      secretKey = localData.authProperty;
      plainUsername = decrypt(localData.secretUsername,secretKey)
      if (plainUsername) { isAuth = true; } else { window.open(`/`, '_self'); }
    } catch (err) {
      console.error(err)
      window.open(`/`,'_self')
    }

    const searchParams = new URLSearchParams(window.location.search);
    const paramsObj = Object.fromEntries(searchParams.entries());
    
    const [activeQuestion, setActiveQuestion] = useState(1)
    const [question, setQuestion] = useState([])
    const [questionKey, setQuestionKey] = useState(1);

    const setQuestionsForPractice = async(username,lesson) => {
    
        const getQuestions = await axios.get('/getQuestionForPractice',{
          params:{
            username,
            lessonName : lesson
          }
        })
        if(getQuestions.data.status){
          if([...getQuestions.data.incomingValue.data].length === 0){
            setIsNoQuestion(true)
          }
            setQuestion([...getQuestions.data.incomingValue.data])
            setIsUploading(false)
        }
      }
    useEffect(() => {
        setQuestionsForPractice(plainUsername,paramsObj.lessonName)
    }, [])
    
    const increaseActiveQuestion = (no) => {
      setActiveQuestion(no)
    }
    const shuffleArray = () => {
      const shuffledArray = [...question];
    
      for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
      }
      
      setQuestion(shuffledArray);
    };

    const repeatQuestions = () => {
      shuffleArray()
      increaseActiveQuestion()
      setQuestionKey((prevKey) => prevKey + 1);
    }
    
  return (
    <div className='lessonPage'>
      {isUploading ? (
        <Loader title={'Durumun inceleniyor..'} textColor={'#FFF'}/>
      ) : (
        isNoQuestion ? (
          <div className='notFound notQuestion'>
            <img src='/assest/img/lessonIcons/noQuestion.svg' alt='Uyarı Resmi' id='transted'/>
            <h1>Hiç soru bulunamadı !</h1>
            <h2>En kısa zamanda bu sorunu düzeltmeye çalışıyoruz..</h2>
            <Link to={`/${plainUsername}`}>Anasayfa'ya Git</Link>
          </div>
        ) : (
          <>
          <LessonHeader 
          status={'question'}
          lessonSubject={'Pratik Yap'} 
          />
          <div className="optionsArea">
            <Link to={`/${plainUsername}`}>Anasayfa'ya Dön</Link>
          </div>
          <QuestionMain   
              key={questionKey}
              questions={question} 
              nextedQuestion={increaseActiveQuestion}
              finishedQuestion={repeatQuestions}
          />
        </>
        )
       
        )}
    </div>
  )
}

export default Practice